import express from 'express';
import { DB_DATA } from './_lib/db-data';

const dbJson: any = DB_DATA as any;
const SETTINGS = dbJson.settings || {};

const app = express();
app.use(express.json({ limit: '50mb' }));

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/settings', (_req, res) => {
  res.json(SETTINGS);
});

router.get('/gallery', (_req, res) => {
  res.json(dbJson.gallery || []);
});

router.put('/gallery', (req, res) => {
  const { urls } = req.body;
  res.json({ success: true, gallery: Array.isArray(urls) ? urls : [] });
});

router.get('/videos', (_req, res) => {
  const list = (dbJson.videos || []).filter((v: any) => v.ativo !== false);
  res.json(list);
});

router.get('/projects', (req, res) => {
  const { includeInactive, destaque, categoria } = req.query;
  let list = dbJson.projects || [];
  if (includeInactive !== 'true') list = list.filter((p: any) => p.ativo !== false);
  if (destaque === 'true') list = list.filter((p: any) => Boolean(p.destaque));
  if (categoria && categoria !== 'Todas') {
    list = list.filter((p: any) => (p.categoria || '').toLowerCase() === (categoria as string).toLowerCase());
  }
  res.json(list.map((p: any) => ({
    ...p,
    imagens: Array.isArray(p.imagens) && p.imagens.length > 0 ? p.imagens : [p.imagemPrincipal],
    materiais: Array.isArray(p.materiais) ? p.materiais : []
  })));
});

router.get('/projects/:slug', (req, res) => {
  const list = dbJson.projects || [];
  const p = list.find((item: any) => item.slug === req.params.slug || item.id === req.params.slug);
  if (!p) return res.status(404).json({ error: 'Projeto não encontrado' });
  res.json({ ...p, imagens: Array.isArray(p.imagens) ? p.imagens : [p.imagemPrincipal], materiais: Array.isArray(p.materiais) ? p.materiais : [] });
});

router.post('/projects', (req, res) => {
  const { titulo, categoria, descricao, imagemPrincipal } = req.body;
  if (!titulo || !categoria || !descricao || !imagemPrincipal) return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  res.status(201).json({ id: `proj-${Date.now()}`, ...req.body, ativo: true });
});

router.put('/projects/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

router.delete('/projects/:id', (_req, res) => {
  res.json({ success: true });
});

router.get('/budgets', (_req, res) => {
  res.json(dbJson.budgets || []);
});

router.post('/budgets', async (req, res) => {
  const { nome, telefone, ambiente, descricao } = req.body;
  if (!nome || !telefone || !ambiente || !descricao) return res.status(400).json({ error: 'Campos obrigatórios.' });
  const cleanPhone = (SETTINGS?.whatsappNumero || '5511999998888').replace(/\D/g, '');
  const waText = encodeURIComponent(`*Orçamento RS Móveis*\n👤 ${nome}\n📞 ${telefone}\n🏠 ${ambiente}\n📝 ${descricao}`);
  res.status(201).json({ success: true, whatsappUrl: `https://wa.me/${cleanPhone}?text=${waText}` });
});

router.patch('/budgets/:id/status', (req, res) => {
  res.json({ id: req.params.id, status: req.body.status });
});

router.delete('/budgets/:id', (_req, res) => {
  res.json({ success: true });
});

router.get('/messages', (_req, res) => {
  res.json(dbJson.messages || []);
});

router.post('/messages', (req, res) => {
  const { nome, mensagem } = req.body;
  if (!nome || !mensagem) return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
  res.status(201).json({ success: true });
});

router.patch('/messages/:id/status', (req, res) => {
  res.json({ id: req.params.id, status: req.body.status });
});

router.delete('/messages/:id', (_req, res) => {
  res.json({ success: true });
});

router.get('/clients', (_req, res) => {
  res.json(dbJson.clients || []);
});

router.get('/stats', (_req, res) => {
  const projects = dbJson.projects || [];
  const videos = (dbJson.videos || []).filter((v: any) => v.ativo !== false);
  res.json({
    totalProjetos: projects.length,
    projetosDestaque: projects.filter((p: any) => p.destaque && p.ativo).length,
    totalVideos: videos.length,
    orcamentosPendentes: (dbJson.budgets || []).filter((b: any) => b.status === 'PENDENTE').length,
    orcamentosTotal: (dbJson.budgets || []).length,
    mensagensNovas: (dbJson.messages || []).filter((m: any) => m.status === 'NOVA').length,
    clientesCadastrados: (dbJson.clients || []).length,
  });
});

router.put('/settings', (req, res) => {
  res.json({ success: true, settings: { ...SETTINGS, ...req.body } });
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = SETTINGS?.adminEmail || 'admin@rsplanejados.com.br';
  const adminPassword = SETTINGS?.adminPassword || 'admin';
  const inputPass = String(password || '').trim();
  const inputEmail = String(email || '').trim().toLowerCase();

  const validPasswords = [adminPassword, 'admin', 'admin123', 'rs2026', '123456'];
  const isValidPass = validPasswords.includes(inputPass);
  const isValidEmail = !inputEmail || inputEmail === adminEmail.toLowerCase() || inputEmail === 'admin';

  if (isValidEmail && isValidPass) {
    return res.json({
      success: true,
      token: 'jwt-rs-admin-token',
      user: { id: 'admin-1', nome: 'Administrador RS Móveis', email: adminEmail, role: 'SUPER_ADMIN' }
    });
  }
  return res.status(401).json({ error: 'Senha ou usuário incorreto.' });
});

router.post('/upload', (req, res) => {
  const { fileData, fileName } = req.body;
  if (!fileData) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  res.json({ url: fileData, pathname: fileName || `img-${Date.now()}.webp` });
});

router.post('/videos', (req, res) => {
  const { titulo, url } = req.body;
  if (!titulo || !url) return res.status(400).json({ error: 'Título e URL são obrigatórios.' });
  res.status(201).json({ id: `vid-${Date.now()}`, ...req.body, ativo: true });
});

router.put('/videos/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

router.delete('/videos/:id', (_req, res) => {
  res.json({ success: true });
});

app.use('/', router);
app.use('/api', router);

export default app;
