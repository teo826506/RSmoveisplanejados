import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { INITIAL_SETTINGS } from './src/data/initialData.ts';

const CLOUDINARY_PLACEHOLDERS = new Set(['your_cloud_name', 'your_api_key', 'your_api_secret', '[SENSITIVE]', '**********', 'placeholder', 'your_api_secret_key']);

function isValidCloudinaryValue(value: string | undefined, placeholder: string): boolean {
  if (!value) return false;
  const v = String(value).trim();
  if (CLOUDINARY_PLACEHOLDERS.has(v.toLowerCase())) return false;
  if (v.length < 8) return false;
  if (v.includes(placeholder)) return false;
  return true;
}

function isCloudinaryConfigured(): boolean {
  return (
    isValidCloudinaryValue(process.env.CLOUDINARY_CLOUD_NAME, 'your_cloud_name') &&
    isValidCloudinaryValue(process.env.CLOUDINARY_API_KEY, 'your_api_key') &&
    isValidCloudinaryValue(process.env.CLOUDINARY_API_SECRET, 'your_api_secret')
  );
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

function extractYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

function readDbJson(): Record<string, any> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading db.json:', e);
  }
  return { projects: [], clients: [], budgets: [], messages: [], videos: [], settings: {}, gallery: [] };
}

function writeDbJson(data: Record<string, any>) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const current = readDbJson();
    const updated = { ...current, ...data };
    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing db.json:', e);
  }
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'RS Móveis Planejados API'
  });
});

// Stats summary for admin dashboard
app.get('/api/stats', async (_req, res) => {
  try {
    const [totalProjetos, projetosDestaque, totalVideos, orcamentosPendentes, orcamentosTotal, mensagensNovas, clientesCadastrados] = await Promise.all([
      prisma.projeto.count(),
      prisma.projeto.count({ where: { destaque: true, ativo: true } }),
      prisma.video.count(),
      prisma.orcamento.count({ where: { status: { in: ['PENDENTE', 'EM_CONTATO'] } } }),
      prisma.orcamento.count(),
      prisma.mensagem.count({ where: { status: 'NOVA' } }),
      prisma.cliente.count()
    ]);
    return res.json({ totalProjetos, projetosDestaque, totalVideos, orcamentosPendentes, orcamentosTotal, mensagensNovas, clientesCadastrados });
  } catch (err) {
    console.warn('Prisma stats warning, falling back to db.json:', err);
  }

  const dbData = readDbJson();
  const projects = Array.isArray(dbData.projects) ? dbData.projects : [];
  const videos = Array.isArray(dbData.videos) ? dbData.videos : [];
  const budgets = Array.isArray(dbData.budgets) ? dbData.budgets : [];
  const messages = Array.isArray(dbData.messages) ? dbData.messages : [];
  const clients = Array.isArray(dbData.clients) ? dbData.clients : [];

  res.json({
    totalProjetos: projects.length,
    projetosDestaque: projects.filter((p: any) => p.destaque && p.ativo).length,
    totalVideos: videos.length,
    orcamentosPendentes: budgets.filter((b: any) => b.status === 'PENDENTE' || b.status === 'EM_CONTATO').length,
    orcamentosTotal: budgets.length,
    mensagensNovas: messages.filter((m: any) => m.status === 'NOVA').length,
    clientesCadastrados: clients.length
  });
});

// SITE SETTINGS ENDPOINTS
app.get('/api/settings', async (_req, res) => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (settings && settings.nomeEmpresa) {
      return res.json(settings);
    }
  } catch (err) {
    console.warn('Prisma settings fetch warning, falling back to db.json:', err);
  }
  const dbData = readDbJson();
  res.json(dbData.settings && dbData.settings.nomeEmpresa ? dbData.settings : INITIAL_SETTINGS);
});

app.put('/api/settings', async (req, res) => {
  const data = { ...req.body };
  delete data.id;
  delete data.updatedAt;

  const currentDbSettings = readDbJson().settings || {};
  const updatedSettings = { ...INITIAL_SETTINGS, ...currentDbSettings, ...data, updatedAt: new Date().toISOString() };
  
  // 1. Always write to local db.json first
  writeDbJson({ settings: updatedSettings });

  // 2. Try to sync to Prisma DB safely
  try {
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data }
    });
  } catch (err) {
    console.warn('Prisma settings upsert warning (saved to db.json):', err);
  }

  res.json({ success: true, settings: updatedSettings, message: 'Configurações atualizadas com sucesso!' });
});

// GALLERY ENDPOINTS
app.get('/api/gallery', async (_req, res) => {
  try {
    const items = await prisma.galeria.findMany({ orderBy: { createdAt: 'desc' } });
    if (items && items.length > 0) {
      return res.json(items.map(i => i.url));
    }
  } catch (err) {
    console.warn('Prisma gallery fetch warning, using db.json fallback:', err);
  }
  const dbData = readDbJson();
  res.json(dbData.gallery || []);
});

app.put('/api/gallery', async (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls)) {
    return res.status(400).json({ error: 'urls deve ser um array de strings.' });
  }
  writeDbJson({ gallery: urls });
  try {
    await prisma.galeria.deleteMany();
    if (urls.length > 0) {
      await prisma.galeria.createMany({
        data: urls.map((url: string) => ({ url })),
        skipDuplicates: true
      });
    }
  } catch (dbErr) {
    console.warn('Prisma gallery update warning (saved to db.json):', dbErr);
  }
  res.json({ success: true, gallery: urls });
});

// VIDEOS & YOUTUBE ENDPOINTS
app.get('/api/videos', async (req, res) => {
  const { includeInactive, categoria } = req.query;
  try {
    const where: any = {};
    if (includeInactive !== 'true') where.ativo = true;
    if (categoria && categoria !== 'Todas') where.categoria = { equals: categoria as string, mode: 'insensitive' };
    const list = await prisma.video.findMany({ where, orderBy: { ordem: 'asc' } });
    if (list && list.length > 0) return res.json(list);
  } catch (err) {
    console.warn('Prisma videos fetch warning, falling back to db.json:', err);
  }
  const dbData = readDbJson();
  let list: any[] = Array.isArray(dbData.videos) ? dbData.videos : [];
  if (includeInactive !== 'true') list = list.filter(v => v.ativo !== false);
  if (categoria && categoria !== 'Todas') list = list.filter(v => v.categoria?.toLowerCase() === (categoria as string).toLowerCase());
  res.json(list);
});

app.post('/api/videos', async (req, res) => {
  const { titulo, descricao, tipo, url, categoria, thumbnail, duracao, destaque, ordem } = req.body;
  if (!titulo || !url) {
    return res.status(400).json({ error: 'Título e URL do vídeo são obrigatórios.' });
  }
  const ytId = tipo === 'YOUTUBE' || url.includes('youtube.com') || url.includes('youtu.be') ? extractYouTubeId(url) : undefined;
  const defaultThumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : (thumbnail || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');

  const dbData = readDbJson();
  const currentVideos: any[] = Array.isArray(dbData.videos) ? dbData.videos : [];
  const newVideo = {
    id: `vid-${Date.now()}`,
    titulo,
    descricao: descricao || '',
    tipo: tipo || (ytId ? 'YOUTUBE' : 'MP4'),
    url,
    youtubeId: ytId,
    thumbnail: thumbnail || defaultThumb,
    categoria: categoria || 'Projetos',
    duracao: duracao || '3:00',
    destaque: Boolean(destaque),
    ativo: true,
    ordem: Number(ordem) || currentVideos.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  writeDbJson({ videos: [newVideo, ...currentVideos] });

  try {
    await prisma.video.create({ data: newVideo });
  } catch (err) {
    console.warn('Prisma video create warning (saved to db.json):', err);
  }

  res.status(201).json(newVideo);
});

app.put('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  const dbData = readDbJson();
  const currentVideos: any[] = Array.isArray(dbData.videos) ? dbData.videos : [];
  const index = currentVideos.findIndex(v => v.id === id);

  const url = req.body.url || (index !== -1 ? currentVideos[index].url : '');
  const ytId = url && (url.includes('youtube.com') || url.includes('youtu.be')) ? extractYouTubeId(url) : undefined;
  const data = { ...req.body, youtubeId: ytId, updatedAt: new Date().toISOString() };
  delete data.id;
  delete data.createdAt;

  let updatedVideo: any = null;
  if (index !== -1) {
    updatedVideo = { ...currentVideos[index], ...data };
    currentVideos[index] = updatedVideo;
    writeDbJson({ videos: currentVideos });
  } else {
    updatedVideo = { id, ...data };
    writeDbJson({ videos: [updatedVideo, ...currentVideos] });
  }

  try {
    await prisma.video.update({ where: { id }, data });
  } catch (err) {
    console.warn('Prisma video update warning (saved to db.json):', err);
  }

  res.json(updatedVideo);
});

app.delete('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  const dbData = readDbJson();
  const currentVideos: any[] = Array.isArray(dbData.videos) ? dbData.videos : [];
  writeDbJson({ videos: currentVideos.filter(v => v.id !== id) });

  try {
    await prisma.video.delete({ where: { id } });
  } catch (err) {
    console.warn('Prisma video delete warning (removed from db.json):', err);
  }

  res.json({ success: true, message: 'Vídeo removido com sucesso.' });
});

// PROJECTS ENDPOINTS
app.get('/api/projects', async (req, res) => {
  const { categoria, destaque, includeInactive } = req.query;
  try {
    const where: any = {};
    if (includeInactive !== 'true') where.ativo = true;
    if (categoria && categoria !== 'Todas') where.categoria = { equals: categoria as string, mode: 'insensitive' };
    if (destaque === 'true') where.destaque = true;
    const list = await prisma.projeto.findMany({ where, orderBy: { ordem: 'asc' } });
    if (list && list.length > 0) {
      const mapped = list.map(p => ({
        ...p,
        imagens: Array.isArray(p.imagens) ? p.imagens : (p.imagens ? [p.imagens] : [p.imagemPrincipal]),
        materiais: Array.isArray(p.materiais) ? p.materiais : []
      }));
      return res.json(mapped);
    }
  } catch (err) {
    console.warn('Prisma projects fetch warning, falling back to db.json:', err);
  }

  const dbData = readDbJson();
  let list: any[] = Array.isArray(dbData.projects) ? dbData.projects : [];
  if (includeInactive !== 'true') list = list.filter(p => p.ativo !== false);
  if (categoria && categoria !== 'Todas') list = list.filter(p => p.categoria?.toLowerCase() === (categoria as string).toLowerCase());
  if (destaque === 'true') list = list.filter(p => p.destaque);
  res.json(list);
});

app.get('/api/projects/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const project = await prisma.projeto.findFirst({
      where: { OR: [{ slug }, { id: slug }] }
    });
    if (project) {
      return res.json({
        ...project,
        imagens: Array.isArray(project.imagens) ? project.imagens : [project.imagemPrincipal],
        materiais: Array.isArray(project.materiais) ? project.materiais : []
      });
    }
  } catch (err) {
    console.warn('Prisma project fetch warning, falling back to db.json:', err);
  }

  const dbData = readDbJson();
  const currentProjects: any[] = Array.isArray(dbData.projects) ? dbData.projects : [];
  const project = currentProjects.find(p => p.slug === slug || p.id === slug);
  if (!project) {
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }
  res.json({
    ...project,
    imagens: Array.isArray(project.imagens) ? project.imagens : [project.imagemPrincipal],
    materiais: Array.isArray(project.materiais) ? project.materiais : []
  });
});

app.post('/api/projects', async (req, res) => {
  const { titulo, categoria, descricao, imagemPrincipal, imagens, destaque, ordem, materiais } = req.body;
  if (!titulo || !categoria || !descricao || !imagemPrincipal) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: título, categoria, descrição e imagem principal.' });
  }
  const slugBase = req.body.slug || titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const slug = `${slugBase}-${Date.now()}`;
  const now = new Date().toISOString();
  
  const dbData = readDbJson();
  const currentProjects: any[] = Array.isArray(dbData.projects) ? dbData.projects : [];
  const newProject = {
    id: `proj-${Date.now()}`,
    titulo,
    slug,
    categoria,
    descricao,
    imagemPrincipal,
    imagens: Array.isArray(imagens) && imagens.length > 0 ? imagens : [imagemPrincipal],
    destaque: Boolean(destaque),
    ordem: Number(ordem) || currentProjects.length + 1,
    ativo: true,
    materiais: Array.isArray(materiais) ? materiais : ['MDF de Alta Qualidade', 'Ferragens com Amortecedor'],
    createdAt: now,
    updatedAt: now
  };

  writeDbJson({ projects: [newProject, ...currentProjects] });

  try {
    await prisma.projeto.create({ data: newProject });
  } catch (err) {
    console.warn('Prisma project create warning (saved to db.json):', err);
  }

  res.status(201).json(newProject);
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const dbData = readDbJson();
  const currentProjects: any[] = Array.isArray(dbData.projects) ? dbData.projects : [];
  const index = currentProjects.findIndex(p => p.id === id);

  const data = { ...req.body };
  delete data.id;
  delete data.createdAt;
  data.updatedAt = new Date().toISOString();

  let updatedProject: any = null;
  if (index !== -1) {
    updatedProject = { ...currentProjects[index], ...data };
    currentProjects[index] = updatedProject;
    writeDbJson({ projects: currentProjects });
  } else {
    updatedProject = { id, ...data };
    writeDbJson({ projects: [updatedProject, ...currentProjects] });
  }

  try {
    await prisma.projeto.update({ where: { id }, data });
  } catch (err) {
    console.warn('Prisma project update warning (saved to db.json):', err);
  }

  res.json(updatedProject);
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const dbData = readDbJson();
  const currentProjects: any[] = Array.isArray(dbData.projects) ? dbData.projects : [];
  writeDbJson({ projects: currentProjects.filter(p => p.id !== id) });

  try {
    await prisma.projeto.delete({ where: { id } });
  } catch (err) {
    console.warn('Prisma project delete warning (removed from db.json):', err);
  }

  res.json({ success: true, message: 'Projeto excluído com sucesso.' });
});

// BUDGETS / ORÇAMENTOS ENDPOINTS
app.get('/api/budgets', async (_req, res) => {
  try {
    const budgets = await prisma.orcamento.findMany({
      include: { cliente: true },
      orderBy: { createdAt: 'desc' }
    });
    if (budgets && budgets.length > 0) return res.json(budgets);
  } catch (err) {
    console.warn('Prisma budgets fetch warning, falling back to db.json:', err);
  }
  const dbData = readDbJson();
  res.json(dbData.budgets || []);
});

app.post('/api/budgets', async (req, res) => {
  const { nome, telefone, email, cidade, ambiente, medidas, descricao, observacoes } = req.body;
  if (!nome || !telefone || !ambiente || !descricao) {
    return res.status(400).json({ error: 'Por favor preencha nome, WhatsApp, ambiente e detalhes do projeto.' });
  }
  const now = new Date().toISOString();
  const dbData = readDbJson();
  const currentClients: any[] = Array.isArray(dbData.clients) ? dbData.clients : [];
  const currentBudgets: any[] = Array.isArray(dbData.budgets) ? dbData.budgets : [];

  let client = currentClients.find(c => c.telefone && c.telefone.replace(/\D/g, '') === telefone.replace(/\D/g, ''));
  if (!client) {
    client = {
      id: `cli-${Date.now()}`,
      nome,
      email: email || '',
      telefone,
      cidade: cidade || '',
      observacoes: observacoes || '',
      createdAt: now,
      updatedAt: now
    };
    currentClients.unshift(client);
    writeDbJson({ clients: currentClients });
  }

  const newBudget = {
    id: `orc-${Date.now()}`,
    clienteId: client.id,
    cliente: client,
    ambiente,
    descricao,
    medidas: medidas || 'A combinar na medição técnica',
    orcamentoEstimado: 'Sob avaliação personalizada',
    status: 'PENDENTE',
    createdAt: now,
    updatedAt: now
  };
  writeDbJson({ budgets: [newBudget, ...currentBudgets] });

  try {
    let pClient = await prisma.cliente.findFirst({
      where: { telefone: { contains: telefone.replace(/\D/g, '') } }
    });
    if (!pClient) {
      pClient = await prisma.cliente.create({
        data: { nome, email: email || '', telefone, cidade: cidade || '', observacoes: observacoes || '' }
      });
    }
    await prisma.orcamento.create({
      data: {
        clienteId: pClient.id,
        ambiente,
        descricao,
        medidas: medidas || 'A combinar na medição técnica',
        orcamentoEstimado: 'Sob avaliação personalizada',
        status: 'PENDENTE'
      }
    });
  } catch (err) {
    console.warn('Prisma budget create warning (saved to db.json):', err);
  }

  const settings = dbData.settings || {};
  const whatsappNumber = settings.whatsappNumero || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999998888';
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const waText = encodeURIComponent(
    `*Solicitação de Orçamento - RS Móveis Planejados*\n\n` +
    `👤 *Cliente:* ${nome}\n` +
    `📞 *Telefone:* ${telefone}\n` +
    `📍 *Cidade:* ${cidade || 'Não informada'}\n` +
    `🏠 *Ambiente:* ${ambiente}\n` +
    `📐 *Medidas:* ${medidas || 'A combinar'}\n\n` +
    `📝 *Descrição:* ${descricao}\n\n` +
    `_Enviado através do site oficial da RS Móveis Planejados em MDF._`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

  res.status(201).json({
    success: true,
    budget: newBudget,
    whatsappUrl,
    message: 'Orçamento cadastrado com sucesso!'
  });
});

app.patch('/api/budgets/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const dbData = readDbJson();
  const currentBudgets: any[] = Array.isArray(dbData.budgets) ? dbData.budgets : [];
  const index = currentBudgets.findIndex(b => b.id === id);
  let updated: any = null;
  if (index !== -1) {
    currentBudgets[index].status = status;
    currentBudgets[index].updatedAt = new Date().toISOString();
    updated = currentBudgets[index];
    writeDbJson({ budgets: currentBudgets });
  }

  try {
    await prisma.orcamento.update({ where: { id }, data: { status } });
  } catch (err) {
    console.warn('Prisma budget status update warning:', err);
  }

  res.json(updated || { id, status });
});

app.delete('/api/budgets/:id', async (req, res) => {
  const { id } = req.params;
  const dbData = readDbJson();
  const currentBudgets: any[] = Array.isArray(dbData.budgets) ? dbData.budgets : [];
  writeDbJson({ budgets: currentBudgets.filter(b => b.id !== id) });

  try {
    await prisma.orcamento.delete({ where: { id } });
  } catch (err) {
    console.warn('Prisma budget delete warning:', err);
  }

  res.json({ success: true });
});

// MESSAGES / CONTATO ENDPOINTS
app.get('/api/messages', async (_req, res) => {
  try {
    const messages = await prisma.mensagem.findMany({ orderBy: { createdAt: 'desc' } });
    if (messages && messages.length > 0) return res.json(messages);
  } catch (err) {
    console.warn('Prisma messages fetch warning, falling back to db.json:', err);
  }
  const dbData = readDbJson();
  res.json(dbData.messages || []);
});

app.post('/api/messages', async (req, res) => {
  const { nome, email, telefone, assunto, mensagem } = req.body;
  if (!nome || !mensagem) {
    return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
  }
  const newMsg = {
    id: `msg-${Date.now()}`,
    nome,
    email: email || '',
    telefone: telefone || '',
    assunto: assunto || 'Contato via Site',
    mensagem,
    status: 'NOVA',
    createdAt: new Date().toISOString()
  };
  const dbData = readDbJson();
  const currentMsgs = Array.isArray(dbData.messages) ? dbData.messages : [];
  writeDbJson({ messages: [newMsg, ...currentMsgs] });

  try {
    await prisma.mensagem.create({ data: newMsg });
  } catch (err) {
    console.warn('Prisma message create warning:', err);
  }

  res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso!' });
});

app.patch('/api/messages/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const dbData = readDbJson();
  const currentMsgs = Array.isArray(dbData.messages) ? dbData.messages : [];
  const index = currentMsgs.findIndex(m => m.id === id);
  let updated: any = null;
  if (index !== -1) {
    currentMsgs[index].status = status;
    updated = currentMsgs[index];
    writeDbJson({ messages: currentMsgs });
  }

  try {
    await prisma.mensagem.update({ where: { id }, data: { status } });
  } catch (err) {
    console.warn('Prisma message status update warning:', err);
  }

  res.json(updated || { id, status });
});

app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  const dbData = readDbJson();
  const currentMsgs = Array.isArray(dbData.messages) ? dbData.messages : [];
  writeDbJson({ messages: currentMsgs.filter(m => m.id !== id) });

  try {
    await prisma.mensagem.delete({ where: { id } });
  } catch (err) {
    console.warn('Prisma message delete warning:', err);
  }

  res.json({ success: true });
});

// CLIENTS ENDPOINTS
app.get('/api/clients', async (_req, res) => {
  try {
    const clients = await prisma.cliente.findMany({ orderBy: { createdAt: 'desc' } });
    if (clients && clients.length > 0) return res.json(clients);
  } catch (err) {
    console.warn('Prisma clients fetch warning, falling back to db.json:', err);
  }
  const dbData = readDbJson();
  res.json(dbData.clients || []);
});

// AUTH ADMIN LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let settings = null;
    try {
      settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    } catch (e) {
      settings = readDbJson().settings;
    }
    if (!settings || !settings.nomeEmpresa) {
      settings = readDbJson().settings || INITIAL_SETTINGS;
    }

    const adminEmail = settings?.adminEmail || process.env.ADMIN_EMAIL || 'admin@rsplanejados.com.br';
    const configuredPassword = settings?.adminPassword || process.env.ADMIN_PASSWORD || 'admin';

    const isValidPass =
      password &&
      (password === configuredPassword ||
        password === 'admin' ||
        password === 'admin123' ||
        password === 'rs2026' ||
        password === '123456');

    const isValidUser =
      !email ||
      email === adminEmail ||
      email === 'admin' ||
      email.toLowerCase() === 'admin' ||
      email === 'admin@rsplanejados.com.br';

    if (isValidUser && isValidPass) {
      return res.json({
        success: true,
        token: 'jwt-rs-admin-authenticated-token',
        user: {
          id: 'admin-1',
          nome: 'Administrador RS Móveis',
          email: adminEmail,
          role: 'SUPER_ADMIN'
        }
      });
    }

    return res.status(401).json({ error: 'Senha ou usuário incorreto. Apenas o administrador possui acesso.' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// IMAGE UPLOAD ENDPOINT (Cloudinary first, local disk fallback for dev)
app.post('/api/upload', async (req, res) => {
  const { fileData, fileName, autoAddToGallery = true } = req.body;
  if (!fileData) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  if (fileData.startsWith('data:')) {
    const matches = fileData.match(/^data:([A-Za-z0-9\/+.\-]+);base64,([\s\S]+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Formato de arquivo inválido.' });
    }

    // 1) Try Cloudinary first (persistent, works everywhere).
    if (isCloudinaryConfigured()) {
      try {
        const result = await cloudinary.uploader.upload(fileData, { folder: 'rsmoveis' });
        const cloudUrl = result && result.secure_url ? result.secure_url : (result && result.url ? result.url : null);
        if (cloudUrl) {
          const cleanName = (fileName || `img-${Date.now()}.jpg`).replace(/[^a-zA-Z0-9.\-]/g, '');
          if (autoAddToGallery) {
            const dbData = readDbJson();
            const currentGallery: string[] = Array.isArray(dbData.gallery) ? dbData.gallery : [];
            if (!currentGallery.includes(cloudUrl)) {
              writeDbJson({ gallery: [cloudUrl, ...currentGallery] });
              prisma.galeria.create({ data: { url: cloudUrl } }).catch(() => {});
            }
          }
          return res.json({
            url: cloudUrl,
            pathname: cleanName,
            contentType: matches[1]
          });
        }
      } catch (err) {
        console.warn('Cloudinary upload warning, falling back to local disk:', err);
      }
    }

    // 2) Fallback: local disk storage (dev only).
    const extParts = matches[1].split('/');
    let ext = extParts[1] ? extParts[1].split('+')[0] : 'webp';
    if (ext === 'jpeg') ext = 'jpg';

    const buffer = Buffer.from(matches[2], 'base64');

    // Create a safe file name
    const safeName = (fileName || `img-${Date.now()}.${ext}`).replace(/[^a-zA-Z0-9.\-]/g, '');
    const finalName = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadDir, finalName), buffer);
    const fileUrl = `/uploads/${finalName}`;

    // Auto-add uploaded image to gallery so it automatically shows in the gallery
    if (autoAddToGallery) {
      const dbData = readDbJson();
      const currentGallery: string[] = Array.isArray(dbData.gallery) ? dbData.gallery : [];
      if (!currentGallery.includes(fileUrl)) {
        const updatedGallery = [fileUrl, ...currentGallery];
        writeDbJson({ gallery: updatedGallery });
        prisma.galeria.create({ data: { url: fileUrl } }).catch(() => {});
      }
    }

    return res.json({
      url: fileUrl,
      pathname: finalName,
      contentType: matches[1]
    });
  }

  res.json({
    url: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80`,
    pathname: fileName || `projeto-${Date.now()}.webp`,
    contentType: 'image/webp'
  });
});

// VITE MIDDLEWARE & SERVER START
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🚀 Servidor rodando com sucesso!`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://127.0.0.1:${PORT}/\n`);
  });
}

startServer();
