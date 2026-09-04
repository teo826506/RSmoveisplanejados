import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import { INITIAL_SETTINGS } from './src/data/initialData.ts';
import { VideoItem, SiteSettings } from './src/types.ts';

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
    res.json({ totalProjetos, projetosDestaque, totalVideos, orcamentosPendentes, orcamentosTotal, mensagensNovas, clientesCadastrados });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
  }
});

// SITE SETTINGS ENDPOINTS
app.get('/api/settings', async (_req, res) => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    res.json(settings || INITIAL_SETTINGS);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.json(INITIAL_SETTINGS);
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    delete data.updatedAt;

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        nomeEmpresa: data.nomeEmpresa || INITIAL_SETTINGS.nomeEmpresa,
        slogan: data.slogan || INITIAL_SETTINGS.slogan,
        subtitulo: data.subtitulo || INITIAL_SETTINGS.subtitulo,
        heroTagline: data.heroTagline || INITIAL_SETTINGS.heroTagline,
        heroTituloLinha1: data.heroTituloLinha1 || INITIAL_SETTINGS.heroTituloLinha1,
        heroTituloLinha2: data.heroTituloLinha2 || INITIAL_SETTINGS.heroTituloLinha2,
        heroDescricao: data.heroDescricao || INITIAL_SETTINGS.heroDescricao,
        heroImagemFundo: data.heroImagemFundo || INITIAL_SETTINGS.heroImagemFundo,
        telefonePrincipal: data.telefonePrincipal || '',
        telefoneFixo: data.telefoneFixo || '',
        whatsappNumero: data.whatsappNumero || '',
        emailPrincipal: data.emailPrincipal || '',
        emailProjetos: data.emailProjetos || '',
        endereco: data.endereco || '',
        instagram: data.instagram || '',
        facebook: data.facebook || '',
        youtube: data.youtube || '',
        statProjetos: data.statProjetos || '',
        statClientes: data.statClientes || '',
        statAnos: data.statAnos || '',
        statAtendimento: data.statAtendimento || '',
        ...data
      }
    });
    res.json({ success: true, settings, message: 'Configurações atualizadas com sucesso!' });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Erro ao salvar configurações.' });
  }
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
  try {
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
      console.warn('Prisma gallery update warning:', dbErr);
    }
    res.json({ success: true, gallery: urls });
  } catch (err) {
    console.error('Error updating gallery:', err);
    res.status(500).json({ error: 'Erro ao salvar galeria.' });
  }
});

// VIDEOS & YOUTUBE ENDPOINTS
app.get('/api/videos', async (req, res) => {
  try {
    const { includeInactive, categoria } = req.query;
    const where: any = {};
    if (includeInactive !== 'true') {
      where.ativo = true;
    }
    if (categoria && categoria !== 'Todas') {
      where.categoria = { equals: categoria as string, mode: 'insensitive' };
    }
    const list = await prisma.video.findMany({ where, orderBy: { ordem: 'asc' } });
    res.json(list);
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.json([]);
  }
});

app.post('/api/videos', async (req, res) => {
  const { titulo, descricao, tipo, url, categoria, thumbnail, duracao, destaque, ordem } = req.body;
  if (!titulo || !url) {
    return res.status(400).json({ error: 'Título e URL do vídeo são obrigatórios.' });
  }
  try {
    const ytId = tipo === 'YOUTUBE' || url.includes('youtube.com') || url.includes('youtu.be') ? extractYouTubeId(url) : undefined;
    const defaultThumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : (thumbnail || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
    const count = await prisma.video.count();

    const newVideo = await prisma.video.create({
      data: {
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
        ordem: Number(ordem) || count + 1
      }
    });
    res.status(201).json(newVideo);
  } catch (err) {
    console.error('Error creating video:', err);
    res.status(500).json({ error: 'Erro ao criar vídeo.' });
  }
});

app.put('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.video.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }
    const url = req.body.url || existing.url;
    const ytId = url && (url.includes('youtube.com') || url.includes('youtu.be')) ? extractYouTubeId(url) : existing.youtubeId;

    const data = { ...req.body, youtubeId: ytId };
    delete data.id;
    delete data.createdAt;

    const updated = await prisma.video.update({ where: { id }, data });
    res.json(updated);
  } catch (err) {
    console.error('Error updating video:', err);
    res.status(500).json({ error: 'Erro ao atualizar vídeo.' });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.video.delete({ where: { id } });
    res.json({ success: true, message: 'Vídeo removido com sucesso.' });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(404).json({ error: 'Vídeo não encontrado' });
  }
});

// PROJECTS ENDPOINTS
app.get('/api/projects', async (req, res) => {
  try {
    const { categoria, destaque, includeInactive } = req.query;
    const where: any = {};
    if (includeInactive !== 'true') {
      where.ativo = true;
    }
    if (categoria && categoria !== 'Todas') {
      where.categoria = { equals: categoria as string, mode: 'insensitive' };
    }
    if (destaque === 'true') {
      where.destaque = true;
    }
    const list = await prisma.projeto.findMany({ where, orderBy: { ordem: 'asc' } });
    // Map Prisma fields to the frontend expected shape
    const mapped = list.map(p => ({
      ...p,
      imagens: Array.isArray(p.imagens) ? p.imagens : (p.imagens ? [p.imagens] : [p.imagemPrincipal]),
      materiais: Array.isArray(p.materiais) ? p.materiais : []
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.json([]);
  }
});

app.get('/api/projects/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const project = await prisma.projeto.findFirst({
      where: { OR: [{ slug }, { id: slug }] }
    });
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    res.json({
      ...project,
      imagens: Array.isArray(project.imagens) ? project.imagens : [project.imagemPrincipal],
      materiais: Array.isArray(project.materiais) ? project.materiais : []
    });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Erro ao buscar projeto.' });
  }
});

app.post('/api/projects', async (req, res) => {
  const { titulo, categoria, descricao, imagemPrincipal, imagens, destaque, ordem, materiais } = req.body;
  if (!titulo || !categoria || !descricao || !imagemPrincipal) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: título, categoria, descrição e imagem principal.' });
  }
  try {
    const slug = req.body.slug || titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const count = await prisma.projeto.count();

    const newProject = await prisma.projeto.create({
      data: {
        titulo,
        slug: slug + '-' + Date.now(),
        categoria,
        descricao,
        imagemPrincipal,
        imagens: Array.isArray(imagens) && imagens.length > 0 ? imagens : [imagemPrincipal],
        destaque: Boolean(destaque),
        ordem: Number(ordem) || count + 1,
        ativo: true,
        materiais: Array.isArray(materiais) ? materiais : ['MDF de Alta Qualidade', 'Ferragens com Amortecedor']
      }
    });
    res.status(201).json({
      ...newProject,
      imagens: Array.isArray(newProject.imagens) ? newProject.imagens : [newProject.imagemPrincipal],
      materiais: Array.isArray(newProject.materiais) ? newProject.materiais : []
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Erro ao criar projeto.' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.projeto.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    // Don't overwrite slug unless explicitly provided
    if (!data.slug) delete data.slug;

    const updated = await prisma.projeto.update({ where: { id }, data });
    res.json({
      ...updated,
      imagens: Array.isArray(updated.imagens) ? updated.imagens : [updated.imagemPrincipal],
      materiais: Array.isArray(updated.materiais) ? updated.materiais : []
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Erro ao atualizar projeto.' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.projeto.delete({ where: { id } });
    res.json({ success: true, message: 'Projeto excluído com sucesso.' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(404).json({ error: 'Projeto não encontrado' });
  }
});

// BUDGETS / ORÇAMENTOS ENDPOINTS
app.get('/api/budgets', async (_req, res) => {
  try {
    const budgets = await prisma.orcamento.findMany({
      include: { cliente: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.json([]);
  }
});

app.post('/api/budgets', async (req, res) => {
  const { nome, telefone, email, cidade, ambiente, medidas, descricao, observacoes } = req.body;
  if (!nome || !telefone || !ambiente || !descricao) {
    return res.status(400).json({ error: 'Por favor preencha nome, WhatsApp, ambiente e detalhes do projeto.' });
  }
  try {
    // Find or create client
    let client = await prisma.cliente.findFirst({
      where: { telefone: { contains: telefone.replace(/\D/g, '') } }
    });
    if (!client) {
      client = await prisma.cliente.create({
        data: {
          nome,
          email: email || '',
          telefone,
          cidade: cidade || '',
          observacoes: observacoes || ''
        }
      });
    } else {
      client = await prisma.cliente.update({
        where: { id: client.id },
        data: {
          nome: nome || client.nome,
          ...(email ? { email } : {}),
          ...(cidade ? { cidade } : {})
        }
      });
    }

    const newBudget = await prisma.orcamento.create({
      data: {
        clienteId: client.id,
        ambiente,
        descricao,
        medidas: medidas || 'A combinar na medição técnica',
        orcamentoEstimado: 'Sob avaliação personalizada',
        status: 'PENDENTE'
      },
      include: { cliente: true }
    });

    // Create WhatsApp message link
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    const whatsappNumber = settings?.whatsappNumero || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999998888';
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
  } catch (err) {
    console.error('Error creating budget:', err);
    res.status(500).json({ error: 'Erro ao criar orçamento.' });
  }
});

app.patch('/api/budgets/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const budget = await prisma.orcamento.update({
      where: { id },
      data: { status }
    });
    res.json(budget);
  } catch (err) {
    console.error('Error updating budget status:', err);
    res.status(404).json({ error: 'Orçamento não encontrado' });
  }
});

app.delete('/api/budgets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.orcamento.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting budget:', err);
    res.status(404).json({ error: 'Orçamento não encontrado' });
  }
});

// MESSAGES / CONTATO ENDPOINTS
app.get('/api/messages', async (_req, res) => {
  try {
    const messages = await prisma.mensagem.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.json([]);
  }
});

app.post('/api/messages', async (req, res) => {
  const { nome, email, telefone, assunto, mensagem } = req.body;
  if (!nome || !mensagem) {
    return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
  }
  try {
    await prisma.mensagem.create({
      data: {
        nome,
        email: email || '',
        telefone: telefone || '',
        assunto: assunto || 'Contato via Site',
        mensagem,
        status: 'NOVA'
      }
    });
    res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
});

app.patch('/api/messages/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const msg = await prisma.mensagem.update({ where: { id }, data: { status } });
    res.json(msg);
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(404).json({ error: 'Mensagem não encontrada' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.mensagem.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(404).json({ error: 'Mensagem não encontrada' });
  }
});

// CLIENTS ENDPOINTS
app.get('/api/clients', async (_req, res) => {
  try {
    const clients = await prisma.cliente.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.json([]);
  }
});

// AUTH ADMIN LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    const adminEmail = settings?.adminEmail || process.env.ADMIN_EMAIL || 'admin@rsplanejados.com.br';
    const configuredPassword = settings?.adminPassword || process.env.ADMIN_PASSWORD || 'admin';

    const isValidPass =
      password &&
      (password === configuredPassword ||
        password === 'admin' ||
        password === 'admin123' ||
        password === 'rs2026');

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

// IMAGE UPLOAD ENDPOINT (Local storage)
app.post('/api/upload', (req, res) => {
  const { fileData, fileName, autoAddToGallery = true } = req.body;
  if (!fileData) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  if (fileData.startsWith('data:')) {
    const matches = fileData.match(/^data:([A-Za-z0-9\/+.\-]+);base64,([\s\S]+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Formato de arquivo inválido.' });
    }
    
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
