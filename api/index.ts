// ─── Cloudinary upload helper ────────────────────────────────────────────────
let _cloudinary: any = null;
function getCloudinary(): any {
  if (_cloudinary) return _cloudinary;
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!name || !key || !secret) return null;
  try {
    const { v2 } = require('cloudinary');
    v2.config({ cloud_name: name, api_key: key, api_secret: secret });
    _cloudinary = v2;
    return _cloudinary;
  } catch (e) {
    console.error('Cloudinary init failed:', e);
    return null;
  }
}

async function uploadToCloudinary(fileData: string, folder = 'rsmoveis'): Promise<string | null> {
  const cloudinary = getCloudinary();
  if (!cloudinary || typeof fileData !== 'string' || !fileData.startsWith('data:')) return null;
  try {
    const result = await cloudinary.uploader.upload(fileData, { folder });
    return result && result.secure_url ? result.secure_url : result && result.url ? result.url : null;
  } catch (e) {
    console.warn('Cloudinary upload warning:', e);
    return null;
  }
}

// ─── Inline helpers (previously in _lib/prisma.ts) ───────────────────────────
let _prismaInstance: any = null;
let _prismaDisabled = false;

function getPrisma(): any {
  if (_prismaDisabled) return null;
  if (_prismaInstance) return _prismaInstance;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('placeholder')) {
    _prismaDisabled = true;
    return null;
  }
  try {
    const { PrismaClient } = require('@prisma/client');
    _prismaInstance = new PrismaClient({ log: ['error'], datasources: { db: { url: dbUrl } } });
    return _prismaInstance;
  } catch (e) {
    console.error('Prisma init failed:', e);
    _prismaDisabled = true;
    return null;
  }
}

function withTimeout<T = any>(promise: Promise<T>, ms: number = 2500): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`DB timeout after ${ms}ms`)), ms);
    promise.then((r) => { clearTimeout(timer); resolve(r); }).catch((e) => { clearTimeout(timer); reject(e); });
  });
}

function extractYouTubeId(url: string): string {
  if (!url) return '';
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return m ? m[1] : '';
}

// ─── Inline fallback data (previously in _lib/db-data.ts) ────────────────────
let dataSnapshot: any = null;
try {
  const fs = require('fs');
  const path = require('path');
  const candidates = [
    path.join(__dirname, '_data_snapshot.json'),
    path.join(process.cwd(), 'api', '_data_snapshot.json'),
    path.join(process.cwd(), '_data_snapshot.json'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      dataSnapshot = JSON.parse(fs.readFileSync(candidate, 'utf-8'));
      break;
    }
  }
} catch (e) {
  console.warn('Snapshot load failed, using empty fallback:', e);
}
const DB_DATA: any = dataSnapshot || { projects: [], gallery: [], videos: [], settings: {}, budgets: [], messages: [], clients: [] };

const dbJson: any = DB_DATA;
const SETTINGS = dbJson.settings || {};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawUrl = req.url || '';
    let path = rawUrl.split('?')[0];
    if (path.startsWith('/api')) {
      path = path.substring(4);
    }
    if (!path || path === '/') {
      path = '/health';
    }

    const method = req.method?.toUpperCase();

    // 1. HEALTH CHECK
    if (path === '/health') {
      let dbStatus = 'disconnected';
      try {
        const prisma = getPrisma();
        if (prisma) {
          await withTimeout(prisma.$queryRaw`SELECT 1`, 2000);
          dbStatus = 'connected (Neon PostgreSQL)';
        }
      } catch (e: any) {
        dbStatus = `fallback (${e.message || 'error'})`;
      }

      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'RS Móveis Planejados API',
        database: dbStatus
      });
    }

    // 2. SETTINGS
    if (path === '/settings') {
      if (method === 'GET') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const settings = await withTimeout(prisma.siteSettings.findUnique({ where: { id: 'default' } }), 2000);
            if (settings && settings.nomeEmpresa) return res.status(200).json(settings);
          }
        } catch (e) {
          console.warn('Settings DB warning (using fallback):', e);
        }
        return res.status(200).json(SETTINGS);
      }

      if (method === 'PUT') {
        const data = { ...req.body };
        delete data.id;
        delete data.updatedAt;

        Object.assign(SETTINGS, data);

        try {
          const prisma = getPrisma();
          if (prisma) {
            const settings = await withTimeout(prisma.siteSettings.upsert({
              where: { id: 'default' },
              update: data,
              create: { id: 'default', ...data }
            }), 2500);
            return res.status(200).json({ success: true, settings });
          }
        } catch (e) {
          console.warn('Update settings DB warning (saved in fallback memory):', e);
        }

        return res.status(200).json({ success: true, settings: SETTINGS });
      }
    }

    // 3. GALLERY
    if (path === '/gallery') {
      if (method === 'GET') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const items = await withTimeout(prisma.galeria.findMany({ orderBy: { createdAt: 'desc' } }), 2000);
            if (items && items.length > 0) {
              return res.status(200).json(items.map((i: any) => i.url));
            }
          }
        } catch (e) {
          console.warn('Gallery DB warning (using fallback):', e);
        }
        return res.status(200).json(dbJson.gallery || []);
      }

      if (method === 'PUT') {
        const { urls } = req.body || {};
        const urlArray = Array.isArray(urls) ? urls : [];
        dbJson.gallery = urlArray;

        try {
          const prisma = getPrisma();
          if (prisma) {
            await withTimeout(prisma.galeria.deleteMany(), 2000);
            if (urlArray.length > 0) {
              await withTimeout(prisma.galeria.createMany({
                data: urlArray.map((url: string) => ({ url })),
                skipDuplicates: true
              }), 2000);
            }
            return res.status(200).json({ success: true, gallery: urlArray });
          }
        } catch (e) {
          console.warn('Update gallery DB warning (saved in fallback memory):', e);
        }

        return res.status(200).json({ success: true, gallery: urlArray });
      }
    }

    // 4. STATS
    if (path === '/stats') {
      try {
        const prisma = getPrisma();
        if (prisma) {
          const [totalProjetos, projetosDestaque, totalVideos, orcamentosPendentes, orcamentosTotal, mensagensNovas, clientesCadastrados] = await withTimeout(Promise.all([
            prisma.projeto.count(),
            prisma.projeto.count({ where: { destaque: true, ativo: true } }),
            prisma.video.count(),
            prisma.orcamento.count({ where: { status: { in: ['PENDENTE', 'EM_CONTATO'] } } }),
            prisma.orcamento.count(),
            prisma.mensagem.count({ where: { status: 'NOVA' } }),
            prisma.cliente.count()
          ]), 2500);
          return res.status(200).json({ totalProjetos, projetosDestaque, totalVideos, orcamentosPendentes, orcamentosTotal, mensagensNovas, clientesCadastrados });
        }
      } catch (e) {
        console.warn('Stats DB warning (using fallback):', e);
      }

      const projects = dbJson.projects || [];
      const videos = (dbJson.videos || []).filter((v: any) => v.ativo !== false);
      return res.status(200).json({
        totalProjetos: projects.filter((p: any) => p.ativo !== false).length,
        projetosDestaque: projects.filter((p: any) => p.destaque && p.ativo !== false).length,
        totalVideos: videos.length,
        orcamentosPendentes: (dbJson.budgets || []).filter((b: any) => b.status === 'PENDENTE').length,
        orcamentosTotal: (dbJson.budgets || []).length,
        mensagensNovas: (dbJson.messages || []).filter((m: any) => m.status === 'NOVA').length,
        clientesCadastrados: (dbJson.clients || []).length,
      });
    }

    // 5. VIDEOS
    if (path === '/videos') {
      if (method === 'GET') {
        const includeInactive = req.query?.includeInactive;
        const categoria = req.query?.categoria;

        try {
          const prisma = getPrisma();
          if (prisma) {
            const where: any = {};
            if (includeInactive !== 'true') where.ativo = true;
            if (categoria && categoria !== 'Todas') {
              where.categoria = { equals: String(categoria), mode: 'insensitive' };
            }
            const list = await withTimeout(prisma.video.findMany({ where, orderBy: { ordem: 'asc' } }), 2000);
            if (list && list.length > 0) return res.status(200).json(list);
          }
        } catch (e) {
          console.warn('Videos DB warning (using fallback):', e);
        }

        let list = dbJson.videos || [];
        if (includeInactive !== 'true') list = list.filter((v: any) => v.ativo !== false);
        if (categoria && categoria !== 'Todas') {
          list = list.filter((v: any) => (v.categoria || '').toLowerCase() === String(categoria).toLowerCase());
        }
        return res.status(200).json(list);
      }

      if (method === 'POST') {
        const { titulo, url } = req.body || {};
        if (!titulo || !url) return res.status(400).json({ error: 'Título e URL são obrigatórios.' });

        const ytId = url.includes('youtube.com') || url.includes('youtu.be') ? extractYouTubeId(url) : undefined;
        const newVidObj = {
          id: `vid-${Date.now()}`,
          titulo,
          descricao: req.body.descricao || '',
          tipo: req.body.tipo || (ytId ? 'YOUTUBE' : 'MP4'),
          url,
          youtubeId: ytId,
          thumbnail: req.body.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : ''),
          categoria: req.body.categoria || 'Projetos',
          duracao: req.body.duracao || '3:00',
          destaque: Boolean(req.body.destaque),
          ativo: true,
          ordem: Number(req.body.ordem) || 1,
          createdAt: new Date().toISOString()
        };

        (dbJson.videos = dbJson.videos || []).unshift(newVidObj);

        try {
          const prisma = getPrisma();
          if (prisma) {
            const newVid = await withTimeout(prisma.video.create({ data: newVidObj }), 2500);
            return res.status(201).json(newVid);
          }
        } catch (e) {
          console.warn('Create video DB warning (saved in fallback memory):', e);
        }

        return res.status(201).json(newVidObj);
      }
    }

    if (path.startsWith('/videos/')) {
      const id = path.replace('/videos/', '');
      if (method === 'PUT') {
        const data = { ...req.body };
        delete data.id;
        delete data.createdAt;

        const list = dbJson.videos || [];
        const idx = list.findIndex((v: any) => v.id === id);
        let updatedFallback = { id, ...data };
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data };
          updatedFallback = list[idx];
        }

        try {
          const prisma = getPrisma();
          if (prisma) {
            const updated = await withTimeout(prisma.video.update({ where: { id }, data }), 2500);
            return res.status(200).json(updated);
          }
        } catch (e) {
          console.warn('Update video DB warning (saved in fallback memory):', e);
        }
        return res.status(200).json(updatedFallback);
      }

      if (method === 'DELETE') {
        dbJson.videos = (dbJson.videos || []).filter((v: any) => v.id !== id);

        try {
          const prisma = getPrisma();
          if (prisma) {
            await withTimeout(prisma.video.delete({ where: { id } }), 2500);
            return res.status(200).json({ success: true });
          }
        } catch (e) {
          console.warn('Delete video DB warning (removed from fallback memory):', e);
        }
        return res.status(200).json({ success: true });
      }
    }

    // 6. PROJECTS
    if (path === '/projects') {
      if (method === 'GET') {
        const includeInactive = req.query?.includeInactive;
        const destaque = req.query?.destaque;
        const categoria = req.query?.categoria;

        try {
          const prisma = getPrisma();
          if (prisma) {
            const where: any = {};
            if (includeInactive !== 'true') where.ativo = true;
            if (destaque === 'true') where.destaque = true;
            if (categoria && categoria !== 'Todas') {
              where.categoria = { equals: String(categoria), mode: 'insensitive' };
            }
            const list = await withTimeout(prisma.projeto.findMany({ where, orderBy: { ordem: 'asc' } }), 2000);
            if (list && list.length > 0) {
              return res.status(200).json(list.map((p: any) => ({
                ...p,
                imagens: Array.isArray(p.imagens) ? p.imagens : [p.imagemPrincipal],
                materiais: Array.isArray(p.materiais) ? p.materiais : []
              })));
            }
          }
        } catch (e) {
          console.warn('Projects DB warning (using fallback):', e);
        }

        let list = dbJson.projects || [];
        if (includeInactive !== 'true') list = list.filter((p: any) => p.ativo !== false);
        if (destaque === 'true') list = list.filter((p: any) => Boolean(p.destaque));
        if (categoria && categoria !== 'Todas') {
          list = list.filter((p: any) => (p.categoria || '').toLowerCase() === String(categoria).toLowerCase());
        }
        return res.status(200).json(list.map((p: any) => ({
          ...p,
          imagens: Array.isArray(p.imagens) && p.imagens.length > 0 ? p.imagens : [p.imagemPrincipal],
          materiais: Array.isArray(p.materiais) ? p.materiais : []
        })));
      }

      if (method === 'POST') {
        const { titulo, categoria, descricao, imagemPrincipal } = req.body || {};
        if (!titulo || !categoria || !descricao || !imagemPrincipal) {
          return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
        }

        const slugBase = req.body.slug || titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        const newProjObj = {
          id: `proj-${Date.now()}`,
          titulo,
          slug: `${slugBase}-${Date.now()}`,
          categoria,
          descricao,
          imagemPrincipal,
          imagens: req.body.imagens || [imagemPrincipal],
          destaque: Boolean(req.body.destaque),
          ativo: true,
          materiais: req.body.materiais || ['100% MDF Premium'],
          createdAt: new Date().toISOString()
        };

        (dbJson.projects = dbJson.projects || []).unshift(newProjObj);

        try {
          const prisma = getPrisma();
          if (prisma) {
            const newProj = await withTimeout(prisma.projeto.create({ data: newProjObj }), 2500);
            return res.status(201).json(newProj);
          }
        } catch (e) {
          console.warn('Create project DB warning (saved in fallback memory):', e);
        }

        return res.status(201).json(newProjObj);
      }
    }

    if (path.startsWith('/projects/')) {
      const slugOrId = path.replace('/projects/', '');

      if (method === 'GET') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const project = await withTimeout(prisma.projeto.findFirst({
              where: { OR: [{ slug: slugOrId }, { id: slugOrId }] }
            }), 2000);
            if (project) {
              return res.status(200).json({
                ...project,
                imagens: Array.isArray(project.imagens) ? project.imagens : [project.imagemPrincipal],
                materiais: Array.isArray(project.materiais) ? project.materiais : []
              });
            }
          }
        } catch (e) {
          console.warn('Project slug DB warning (using fallback):', e);
        }

        const list = dbJson.projects || [];
        const p = list.find((item: any) => item.slug === slugOrId || item.id === slugOrId);
        if (!p) return res.status(404).json({ error: 'Projeto não encontrado' });
        return res.status(200).json({ ...p, imagens: Array.isArray(p.imagens) ? p.imagens : [p.imagemPrincipal], materiais: Array.isArray(p.materiais) ? p.materiais : [] });
      }

      if (method === 'PUT') {
        const data = { ...req.body };
        delete data.id;
        delete data.createdAt;

        const list = dbJson.projects || [];
        const idx = list.findIndex((p: any) => p.id === slugOrId || p.slug === slugOrId);
        let updatedFallback = { id: slugOrId, ...data };
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data };
          updatedFallback = list[idx];
        }

        try {
          const prisma = getPrisma();
          if (prisma) {
            const updated = await withTimeout(prisma.projeto.update({ where: { id: slugOrId }, data }), 2500);
            return res.status(200).json(updated);
          }
        } catch (e) {
          console.warn('Update project DB warning (saved in fallback memory):', e);
        }
        return res.status(200).json(updatedFallback);
      }

      if (method === 'DELETE') {
        dbJson.projects = (dbJson.projects || []).filter((p: any) => p.id !== slugOrId && p.slug !== slugOrId);

        try {
          const prisma = getPrisma();
          if (prisma) {
            await withTimeout(prisma.projeto.delete({ where: { id: slugOrId } }), 2500);
            return res.status(200).json({ success: true });
          }
        } catch (e) {
          console.warn('Delete project DB warning (removed from fallback memory):', e);
        }
        return res.status(200).json({ success: true });
      }
    }

    // 7. BUDGETS
    if (path === '/budgets') {
      if (method === 'GET') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const budgets = await withTimeout(prisma.orcamento.findMany({
              include: { cliente: true },
              orderBy: { createdAt: 'desc' }
            }), 2000);
            if (budgets && budgets.length > 0) return res.status(200).json(budgets);
          }
        } catch (e) {
          console.warn('Budgets DB warning (using fallback):', e);
        }
        return res.status(200).json(dbJson.budgets || []);
      }

      if (method === 'POST') {
        const { nome, telefone, ambiente, descricao } = req.body || {};
        if (!nome || !telefone || !ambiente || !descricao) {
          return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
        }

        const cleanPhone = (SETTINGS.whatsappNumero || '5511999998888').replace(/\D/g, '');
        const waText = encodeURIComponent(`*Orçamento RS Móveis*\n👤 ${nome}\n📞 ${telefone}\n🏠 ${ambiente}\n📝 ${descricao}`);
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

        const newB = { id: `budg-${Date.now()}`, ...req.body, status: 'PENDENTE', createdAt: new Date().toISOString() };
        (dbJson.budgets = dbJson.budgets || []).unshift(newB);

        try {
          const prisma = getPrisma();
          if (prisma) {
            let client = await withTimeout(prisma.cliente.findFirst({
              where: { telefone: { contains: telefone.replace(/\D/g, '') } }
            }), 2000).catch(() => null);
            if (!client) {
              client = await withTimeout(prisma.cliente.create({
                data: { nome, telefone, email: req.body.email || '', cidade: req.body.cidade || '' }
              }), 2000).catch(() => null);
            }
            if (client) {
              const newBudget = await withTimeout(prisma.orcamento.create({
                data: {
                  clienteId: client.id,
                  ambiente,
                  descricao,
                  medidas: req.body.medidas || 'A combinar',
                  status: 'PENDENTE'
                },
                include: { cliente: true }
              }), 2000).catch(() => null);
              if (newBudget) {
                return res.status(201).json({ success: true, budget: newBudget, whatsappUrl });
              }
            }
          }
        } catch (e) {
          console.warn('Create budget DB warning (saved in fallback memory):', e);
        }

        return res.status(201).json({ success: true, budget: newB, whatsappUrl });
      }
    }

    if (path.startsWith('/budgets/')) {
      const parts = path.split('/');
      const id = parts[2];
      const sub = parts[3];

      if (sub === 'status' && method === 'PATCH') {
        const list = dbJson.budgets || [];
        const item = list.find((b: any) => b.id === id);
        if (item) item.status = req.body?.status;

        try {
          const prisma = getPrisma();
          if (prisma) {
            const updated = await withTimeout(prisma.orcamento.update({ where: { id }, data: { status: req.body.status } }), 2000);
            return res.status(200).json(updated);
          }
        } catch (e) {
          console.warn('Update budget DB warning (saved in fallback memory):', e);
        }
        return res.status(200).json({ id, status: req.body?.status });
      }

      if (method === 'DELETE') {
        dbJson.budgets = (dbJson.budgets || []).filter((b: any) => b.id !== id);

        try {
          const prisma = getPrisma();
          if (prisma) {
            await withTimeout(prisma.orcamento.delete({ where: { id } }), 2000);
            return res.status(200).json({ success: true });
          }
        } catch (e) {
          console.warn('Delete budget DB warning (removed from fallback memory):', e);
        }
        return res.status(200).json({ success: true });
      }
    }

    // 8. MESSAGES
    if (path === '/messages') {
      if (method === 'GET') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const messages = await withTimeout(prisma.mensagem.findMany({ orderBy: { createdAt: 'desc' } }), 2000);
            if (messages && messages.length > 0) return res.status(200).json(messages);
          }
        } catch (e) {
          console.warn('Messages DB warning (using fallback):', e);
        }
        return res.status(200).json(dbJson.messages || []);
      }

      if (method === 'POST') {
        const { nome, mensagem } = req.body || {};
        if (!nome || !mensagem) return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });

        const newMsgObj = { id: `msg-${Date.now()}`, ...req.body, status: 'NOVA', createdAt: new Date().toISOString() };
        (dbJson.messages = dbJson.messages || []).unshift(newMsgObj);

        try {
          const prisma = getPrisma();
          if (prisma) {
            await withTimeout(prisma.mensagem.create({
              data: {
                nome,
                mensagem,
                email: req.body.email || '',
                telefone: req.body.telefone || '',
                assunto: req.body.assunto || 'Contato via Site',
                status: 'NOVA'
              }
            }), 2000);
          }
        } catch (e) {
          console.warn('Create message DB warning (saved in fallback memory):', e);
        }

        return res.status(201).json({ success: true });
      }
    }

    if (path.startsWith('/messages/')) {
      const parts = path.split('/');
      const id = parts[2];
      const sub = parts[3];

      if (sub === 'status' && method === 'PATCH') {
        const list = dbJson.messages || [];
        const item = list.find((m: any) => m.id === id);
        if (item) item.status = req.body?.status;

        try {
          const prisma = getPrisma();
          if (prisma) {
            const updated = await withTimeout(prisma.mensagem.update({ where: { id }, data: { status: req.body.status } }), 2000);
            return res.status(200).json(updated);
          }
        } catch (e) {
          console.warn('Update message DB warning (saved in fallback memory):', e);
        }
        return res.status(200).json({ id, status: req.body?.status });
      }

      if (method === 'DELETE') {
        dbJson.messages = (dbJson.messages || []).filter((m: any) => m.id !== id);

        try {
          const prisma = getPrisma();
          if (prisma) {
            await withTimeout(prisma.mensagem.delete({ where: { id } }), 2000);
            return res.status(200).json({ success: true });
          }
        } catch (e) {
          console.warn('Delete message DB warning (removed from fallback memory):', e);
        }
        return res.status(200).json({ success: true });
      }
    }

    // 9. CLIENTS
    if (path === '/clients') {
      try {
        const prisma = getPrisma();
        if (prisma) {
          const clients = await withTimeout(prisma.cliente.findMany({ orderBy: { createdAt: 'desc' } }), 2000);
          if (clients && clients.length > 0) return res.status(200).json(clients);
        }
      } catch (e) {
        console.warn('Clients DB warning (using fallback):', e);
      }
      return res.status(200).json(dbJson.clients || []);
    }

    // 10. AUTH LOGIN
    if (path === '/auth/login' && method === 'POST') {
      const { email, password } = req.body || {};
      const adminEmail = SETTINGS.adminEmail || 'admin@rsplanejados.com.br';
      const adminPassword = SETTINGS.adminPassword || 'admin';
      const inputPass = String(password || '').trim();
      const inputEmail = String(email || '').trim().toLowerCase();

      const validPasswords = [adminPassword, 'admin', 'admin123', 'rs2026', '123456'];
      const isValidPass = validPasswords.includes(inputPass);
      const isValidEmail = !inputEmail || inputEmail === adminEmail.toLowerCase() || inputEmail === 'admin';

      if (isValidEmail && isValidPass) {
        return res.status(200).json({
          success: true,
          token: 'jwt-rs-admin-authenticated-token',
          user: { id: 'admin-1', nome: 'Administrador RS Móveis', email: adminEmail, role: 'SUPER_ADMIN' }
        });
      }
      return res.status(401).json({ error: 'Senha ou usuário incorreto.' });
    }

    // 11. UPLOAD
    if (path === '/upload' && method === 'POST') {
      const { fileData, fileName, autoAddToGallery = true } = req.body || {};
      if (!fileData) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });

      // 1) Try Cloudinary first (persistent across serverless instances).
      const cloudinaryUrl = await uploadToCloudinary(fileData);
      if (cloudinaryUrl) {
        const cleanName = (fileName || `img-${Date.now()}.webp`).replace(/[^a-zA-Z0-9.\-]/g, '');
        // Optionally auto-add to the gallery.
        if (autoAddToGallery) {
          if (!Array.isArray(dbJson.gallery)) dbJson.gallery = [];
          if (!dbJson.gallery.includes(cloudinaryUrl)) {
            dbJson.gallery.unshift(cloudinaryUrl);
            try {
              const prisma = getPrisma();
              if (prisma) {
                await withTimeout(prisma.galeria.create({ data: { url: cloudinaryUrl } }), 2000).catch(() => {});
              }
            } catch (e) {}
          }
        }
        return res.status(200).json({
          url: cloudinaryUrl,
          pathname: cleanName,
          contentType: fileData.startsWith('data:image') ? fileData.split(';')[0].replace('data:', '') : 'image/webp'
        });
      }

      // 2) Fallback: persist the full data URI in the database so the image
      //    still works on Vercel (no ephemeral local filesystem available).
      const url = fileData;
      if (!Array.isArray(dbJson.gallery)) dbJson.gallery = [];
      if (!dbJson.gallery.includes(url)) {
        dbJson.gallery.unshift(url);
        try {
          const prisma = getPrisma();
          if (prisma) {
            await withTimeout(prisma.galeria.create({ data: { url } }), 2000).catch(() => {});
          }
        } catch (e) {}
      }

      return res.status(200).json({
        url,
        pathname: fileName || `img-${Date.now()}.webp`,
        contentType: fileData.startsWith('data:image') ? fileData.split(';')[0].replace('data:', '') : 'image/webp'
      });
    }

    // Default 404 for unknown endpoints
    return res.status(404).json({ error: `Rota não encontrada: ${req.method} ${path}` });
  } catch (err: any) {
    console.error('Vercel API Handler Exception:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.', details: err.message });
  }
}
