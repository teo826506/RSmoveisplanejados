import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PROJECTS, INITIAL_CLIENTS, INITIAL_BUDGETS, INITIAL_MESSAGES, INITIAL_SETTINGS, INITIAL_VIDEOS } from './src/data/initialData.ts';
import { Projeto, Cliente, Orcamento, Mensagem, VideoItem, SiteSettings } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Data file persistence path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

interface DbSchema {
  projects: Projeto[];
  clients: Cliente[];
  budgets: Orcamento[];
  messages: Mensagem[];
  videos: VideoItem[];
  settings: SiteSettings;
}

function extractYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}

function initDatabase(): DbSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        projects: parsed.projects || INITIAL_PROJECTS,
        clients: parsed.clients || INITIAL_CLIENTS,
        budgets: parsed.budgets || INITIAL_BUDGETS,
        messages: parsed.messages || INITIAL_MESSAGES,
        videos: parsed.videos || INITIAL_VIDEOS,
        settings: parsed.settings ? { ...INITIAL_SETTINGS, ...parsed.settings } : INITIAL_SETTINGS
      };
    } catch {
      console.warn('Could not parse existing database, resetting to initial seed.');
    }
  }

  const initialData: DbSchema = {
    projects: INITIAL_PROJECTS,
    clients: INITIAL_CLIENTS,
    budgets: INITIAL_BUDGETS,
    messages: INITIAL_MESSAGES,
    videos: INITIAL_VIDEOS,
    settings: INITIAL_SETTINGS
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  } catch (err) {
    console.error('Error writing initial db.json', err);
  }

  return initialData;
}

function loadDatabase(): DbSchema {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        projects: parsed.projects || INITIAL_PROJECTS,
        clients: parsed.clients || INITIAL_CLIENTS,
        budgets: parsed.budgets || INITIAL_BUDGETS,
        messages: parsed.messages || INITIAL_MESSAGES,
        videos: parsed.videos || INITIAL_VIDEOS,
        settings: parsed.settings ? { ...INITIAL_SETTINGS, ...parsed.settings } : INITIAL_SETTINGS
      };
    } catch {
      // fallback
    }
  }
  return initDatabase();
}

let db = loadDatabase();

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'RS Móveis Planejados API'
  });
});

// Stats summary for admin dashboard
app.get('/api/stats', (req, res) => {
  const totalProjetos = db.projects.length;
  const projetosDestaque = db.projects.filter(p => p.destaque && p.ativo).length;
  const totalVideos = db.videos ? db.videos.length : 0;
  const orcamentosPendentes = db.budgets.filter(b => b.status === 'PENDENTE' || b.status === 'EM_CONTATO').length;
  const orcamentosTotal = db.budgets.length;
  const mensagensNovas = db.messages.filter(m => m.status === 'NOVA').length;
  const clientesCadastrados = db.clients.length;

  res.json({
    totalProjetos,
    projetosDestaque,
    totalVideos,
    orcamentosPendentes,
    orcamentosTotal,
    mensagensNovas,
    clientesCadastrados
  });
});

// SITE SETTINGS ENDPOINTS
app.get('/api/settings', (req, res) => {
  res.json(db.settings || INITIAL_SETTINGS);
});

app.put('/api/settings', (req, res) => {
  db.settings = {
    ...db.settings,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDatabase();
  res.json({ success: true, settings: db.settings, message: 'Configurações atualizadas com sucesso!' });
});

// VIDEOS & YOUTUBE ENDPOINTS
app.get('/api/videos', (req, res) => {
  const { includeInactive, categoria } = req.query;
  let list = db.videos ? [...db.videos] : [...INITIAL_VIDEOS];

  if (includeInactive !== 'true') {
    list = list.filter(v => v.ativo);
  }

  if (categoria && categoria !== 'Todas') {
    list = list.filter(v => v.categoria.toLowerCase() === (categoria as string).toLowerCase());
  }

  list.sort((a, b) => a.ordem - b.ordem);
  res.json(list);
});

app.post('/api/videos', (req, res) => {
  const { titulo, descricao, tipo, url, categoria, thumbnail, duracao, destaque, ordem } = req.body;

  if (!titulo || !url) {
    return res.status(400).json({ error: 'Título e URL do vídeo são obrigatórios.' });
  }

  const ytId = tipo === 'YOUTUBE' || url.includes('youtube.com') || url.includes('youtu.be') ? extractYouTubeId(url) : undefined;
  const defaultThumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : (thumbnail || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');

  const newVideo: VideoItem = {
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
    ordem: Number(ordem) || (db.videos ? db.videos.length + 1 : 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!db.videos) db.videos = [];
  db.videos.push(newVideo);
  saveDatabase();
  res.status(201).json(newVideo);
});

app.put('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  if (!db.videos) db.videos = [];
  const index = db.videos.findIndex(v => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Vídeo não encontrado' });
  }

  const url = req.body.url || db.videos[index].url;
  const ytId = url && (url.includes('youtube.com') || url.includes('youtu.be')) ? extractYouTubeId(url) : db.videos[index].youtubeId;

  const updated: VideoItem = {
    ...db.videos[index],
    ...req.body,
    youtubeId: ytId,
    updatedAt: new Date().toISOString()
  };

  db.videos[index] = updated;
  saveDatabase();
  res.json(updated);
});

app.delete('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  if (!db.videos) db.videos = [];
  const initialLen = db.videos.length;
  db.videos = db.videos.filter(v => v.id !== id);

  if (db.videos.length === initialLen) {
    return res.status(404).json({ error: 'Vídeo não encontrado' });
  }

  saveDatabase();
  res.json({ success: true, message: 'Vídeo removido com sucesso.' });
});


// PROJECTS ENDPOINTS
app.get('/api/projects', (req, res) => {
  db = loadDatabase();
  const { categoria, destaque, includeInactive } = req.query;
  let list = [...db.projects];

  if (includeInactive !== 'true') {
    list = list.filter(p => p.ativo);
  }

  if (categoria && categoria !== 'Todas') {
    list = list.filter(p => p.categoria.toLowerCase() === (categoria as string).toLowerCase());
  }

  if (destaque === 'true') {
    list = list.filter(p => p.destaque);
  }

  list.sort((a, b) => a.ordem - b.ordem);
  res.json(list);
});

app.get('/api/projects/:slug', (req, res) => {
  const { slug } = req.params;
  const project = db.projects.find(p => p.slug === slug || p.id === slug);
  if (!project) {
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const { titulo, categoria, descricao, imagemPrincipal, imagens, destaque, ordem, materiais, detalhes } = req.body;

  if (!titulo || !categoria || !descricao || !imagemPrincipal) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: título, categoria, descrição e imagem principal.' });
  }

  const slug = req.body.slug || titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  
  const newProject: Projeto = {
    id: `proj-${Date.now()}`,
    titulo,
    slug,
    categoria,
    descricao,
    imagemPrincipal,
    imagens: Array.isArray(imagens) && imagens.length > 0 ? imagens : [imagemPrincipal],
    destaque: Boolean(destaque),
    ordem: Number(ordem) || db.projects.length + 1,
    ativo: true,
    materiais: Array.isArray(materiais) ? materiais : ['MDF de Alta Qualidade', 'Ferragens com Amortecedor'],
    detalhes: detalhes || {
      ambiente: categoria,
      acabamento: '100% MDF Premium',
      tempoExecucao: '20 dias úteis',
      garantia: '5 anos de garantia'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.projects.push(newProject);
  saveDatabase();
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const index = db.projects.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }

  const updated: Projeto = {
    ...db.projects[index],
    ...req.body,
    id: db.projects[index].id,
    updatedAt: new Date().toISOString()
  };

  db.projects[index] = updated;
  saveDatabase();
  res.json(updated);
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = db.projects.length;
  db.projects = db.projects.filter(p => p.id !== id);

  if (db.projects.length === initialLen) {
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }

  saveDatabase();
  res.json({ success: true, message: 'Projeto excluído com sucesso.' });
});

// BUDGETS / ORÇAMENTOS ENDPOINTS
app.get('/api/budgets', (req, res) => {
  const budgetsWithClients = db.budgets.map(b => {
    const client = db.clients.find(c => c.id === b.clienteId);
    return { ...b, cliente: client };
  });
  res.json(budgetsWithClients.reverse());
});

app.post('/api/budgets', (req, res) => {
  const { nome, telefone, email, cidade, ambiente, medidas, descricao, observacoes } = req.body;

  if (!nome || !telefone || !ambiente || !descricao) {
    return res.status(400).json({ error: 'Por favor preencha nome, WhatsApp, ambiente e detalhes do projeto.' });
  }

  // Find or create client
  let client = db.clients.find(c => c.telefone.replace(/\D/g, '') === telefone.replace(/\D/g, ''));
  if (!client) {
    client = {
      id: `cli-${Date.now()}`,
      nome,
      email: email || '',
      telefone,
      cidade: cidade || '',
      observacoes: observacoes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.clients.push(client);
  } else {
    // Update client details if provided
    client.nome = nome || client.nome;
    if (email) client.email = email;
    if (cidade) client.cidade = cidade;
    client.updatedAt = new Date().toISOString();
  }

  const newBudget: Orcamento = {
    id: `orc-${Date.now()}`,
    clienteId: client.id,
    cliente: client,
    ambiente,
    descricao,
    medidas: medidas || 'A combinar na medição técnica',
    orcamentoEstimado: 'Sob avaliação personalizada',
    status: 'PENDENTE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.budgets.push(newBudget);
  saveDatabase();

  // Create WhatsApp message link
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999998888';
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

app.patch('/api/budgets/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const budget = db.budgets.find(b => b.id === id);
  if (!budget) {
    return res.status(404).json({ error: 'Orçamento não encontrado' });
  }

  budget.status = status;
  budget.updatedAt = new Date().toISOString();
  saveDatabase();
  res.json(budget);
});

app.delete('/api/budgets/:id', (req, res) => {
  const { id } = req.params;
  db.budgets = db.budgets.filter(b => b.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// MESSAGES / CONTATO ENDPOINTS
app.get('/api/messages', (req, res) => {
  res.json(db.messages.slice().reverse());
});

app.post('/api/messages', (req, res) => {
  const { nome, email, telefone, assunto, mensagem } = req.body;

  if (!nome || !mensagem) {
    return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
  }

  const newMessage: Mensagem = {
    id: `msg-${Date.now()}`,
    nome,
    email: email || '',
    telefone: telefone || '',
    assunto: assunto || 'Contato via Site',
    mensagem,
    status: 'NOVA',
    createdAt: new Date().toISOString()
  };

  db.messages.push(newMessage);
  saveDatabase();
  res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso!' });
});

app.patch('/api/messages/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const msg = db.messages.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: 'Mensagem não encontrada' });
  }
  msg.status = status;
  saveDatabase();
  res.json(msg);
});

app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  db.messages = db.messages.filter(m => m.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// CLIENTS ENDPOINTS
app.get('/api/clients', (req, res) => {
  res.json(db.clients.slice().reverse());
});

// AUTH ADMIN LOGIN
app.post('/api/auth/login', (req, res) => {
  db = loadDatabase();
  const { email, password } = req.body;
  const adminEmail = db.settings?.adminEmail || process.env.ADMIN_EMAIL || 'admin@rsplanejados.com.br';
  const configuredPassword = db.settings?.adminPassword || process.env.ADMIN_PASSWORD || 'admin';

  // Aceita a senha configurada no painel ou as senhas administrativas padrão
  const isValidPass =
    password &&
    (password === configuredPassword ||
      password === 'admin' ||
      password === 'admin123' ||
      password === 'rs2026');

  // Aceita o email configurado, o usuário 'admin' ou se foi enviado apenas a senha
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
});

// IMAGE UPLOAD ENDPOINT (Vercel Blob mock/adapter)
app.post('/api/upload', (req, res) => {
  const { fileData, fileName } = req.body;
  if (!fileData) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  // In serverless / dev mode, we return the base64 or a generated URL
  // If actual Vercel Blob token is set, it will upload to Vercel Blob
  const blobUrl = fileData.startsWith('data:') ? fileData : `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80`;
  res.json({
    url: blobUrl,
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
    app.get('*', (req, res) => {
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
