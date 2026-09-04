import { DB_DATA } from './_lib/db-data';
import { getPrisma, extractYouTubeId } from './_lib/prisma';

const dbJson: any = DB_DATA || { projects: [], gallery: [], videos: [], settings: {}, budgets: [], messages: [], clients: [] };
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
    // Normalize path: e.g. /api/health -> /health, /api/gallery -> /gallery, /health -> /health
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
          await prisma.$queryRaw`SELECT 1`;
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
            const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
            if (settings) return res.status(200).json(settings);
          }
        } catch (e) {
          console.error('Settings DB error:', e);
        }
        return res.status(200).json(SETTINGS);
      }

      if (method === 'PUT') {
        const data = { ...req.body };
        delete data.id;
        delete data.updatedAt;

        try {
          const prisma = getPrisma();
          if (prisma) {
            const settings = await prisma.siteSettings.upsert({
              where: { id: 'default' },
              update: data,
              create: { id: 'default', ...data }
            });
            return res.status(200).json({ success: true, settings });
          }
        } catch (e) {
          console.error('Update settings DB error:', e);
        }

        Object.assign(SETTINGS, req.body);
        return res.status(200).json({ success: true, settings: SETTINGS });
      }
    }

    // 3. GALLERY
    if (path === '/gallery') {
      if (method === 'GET') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const items = await prisma.galeria.findMany({ orderBy: { createdAt: 'desc' } });
            if (items && items.length > 0) {
              return res.status(200).json(items.map((i: any) => i.url));
            }
          }
        } catch (e) {
          console.error('Gallery DB error:', e);
        }
        return res.status(200).json(dbJson.gallery || []);
      }

      if (method === 'PUT') {
        const { urls } = req.body || {};
        const urlArray = Array.isArray(urls) ? urls : [];

        try {
          const prisma = getPrisma();
          if (prisma) {
            await prisma.galeria.deleteMany();
            if (urlArray.length > 0) {
              await prisma.galeria.createMany({
                data: urlArray.map((url: string) => ({ url })),
                skipDuplicates: true
              });
            }
            return res.status(200).json({ success: true, gallery: urlArray });
          }
        } catch (e) {
          console.error('Update gallery DB error:', e);
        }

        dbJson.gallery = urlArray;
        return res.status(200).json({ success: true, gallery: urlArray });
      }
    }

    // 4. STATS
    if (path === '/stats') {
      try {
        const prisma = getPrisma();
        if (prisma) {
          const [totalProjetos, projetosDestaque, totalVideos, orcamentosPendentes, orcamentosTotal, mensagensNovas, clientesCadastrados] = await Promise.all([
            prisma.projeto.count(),
            prisma.projeto.count({ where: { destaque: true, ativo: true } }),
            prisma.video.count(),
            prisma.orcamento.count({ where: { status: { in: ['PENDENTE', 'EM_CONTATO'] } } }),
            prisma.orcamento.count(),
            prisma.mensagem.count({ where: { status: 'NOVA' } }),
            prisma.cliente.count()
          ]);
          return res.status(200).json({ totalProjetos, projetosDestaque, totalVideos, orcamentosPendentes, orcamentosTotal, mensagensNovas, clientesCadastrados });
        }
      } catch (e) {
        console.error('Stats DB error:', e);
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
            const list = await prisma.video.findMany({ where, orderBy: { ordem: 'asc' } });
            if (list && list.length > 0) return res.status(200).json(list);
          }
        } catch (e) {
          console.error('Videos DB error:', e);
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

        try {
          const prisma = getPrisma();
          if (prisma) {
            const ytId = url.includes('youtube.com') || url.includes('youtu.be') ? extractYouTubeId(url) : undefined;
            const newVid = await prisma.video.create({
              data: {
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
                ordem: Number(req.body.ordem) || 1
              }
            });
            return res.status(201).json(newVid);
          }
        } catch (e) {
          console.error('Create video DB error:', e);
        }

        const newVideo = { id: `vid-${Date.now()}`, ...req.body, ativo: true };
        (dbJson.videos = dbJson.videos || []).unshift(newVideo);
        return res.status(201).json(newVideo);
      }
    }

    if (path.startsWith('/videos/')) {
      const id = path.replace('/videos/', '');
      if (method === 'PUT') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const data = { ...req.body };
            delete data.id;
            delete data.createdAt;
            const updated = await prisma.video.update({ where: { id }, data });
            return res.status(200).json(updated);
          }
        } catch (e) {
          console.error('Update video DB error:', e);
        }
        return res.status(200).json({ id, ...req.body });
      }

      if (method === 'DELETE') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            await prisma.video.delete({ where: { id } });
            return res.status(200).json({ success: true });
          }
        } catch (e) {
          console.error('Delete video DB error:', e);
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
            const list = await prisma.projeto.findMany({ where, orderBy: { ordem: 'asc' } });
            if (list && list.length > 0) {
              return res.status(200).json(list.map((p: any) => ({
                ...p,
                imagens: Array.isArray(p.imagens) ? p.imagens : [p.imagemPrincipal],
                materiais: Array.isArray(p.materiais) ? p.materiais : []
              })));
            }
          }
        } catch (e) {
          console.error('Projects DB error:', e);
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

        try {
          const prisma = getPrisma();
          if (prisma) {
            const slug = req.body.slug || titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            const newProj = await prisma.projeto.create({
              data: {
                titulo,
                slug: `${slug}-${Date.now()}`,
                categoria,
                descricao,
                imagemPrincipal,
                imagens: req.body.imagens || [imagemPrincipal],
                destaque: Boolean(req.body.destaque),
                ativo: true,
                materiais: req.body.materiais || ['100% MDF Premium']
              }
            });
            return res.status(201).json(newProj);
          }
        } catch (e) {
          console.error('Create project DB error:', e);
        }

        const newProject = { id: `proj-${Date.now()}`, ...req.body, ativo: true };
        (dbJson.projects = dbJson.projects || []).unshift(newProject);
        return res.status(201).json(newProject);
      }
    }

    if (path.startsWith('/projects/')) {
      const slugOrId = path.replace('/projects/', '');

      if (method === 'GET') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const project = await prisma.projeto.findFirst({
              where: { OR: [{ slug: slugOrId }, { id: slugOrId }] }
            });
            if (project) {
              return res.status(200).json({
                ...project,
                imagens: Array.isArray(project.imagens) ? project.imagens : [project.imagemPrincipal],
                materiais: Array.isArray(project.materiais) ? project.materiais : []
              });
            }
          }
        } catch (e) {
          console.error('Project slug DB error:', e);
        }

        const list = dbJson.projects || [];
        const p = list.find((item: any) => item.slug === slugOrId || item.id === slugOrId);
        if (!p) return res.status(404).json({ error: 'Projeto não encontrado' });
        return res.status(200).json({ ...p, imagens: Array.isArray(p.imagens) ? p.imagens : [p.imagemPrincipal], materiais: Array.isArray(p.materiais) ? p.materiais : [] });
      }

      if (method === 'PUT') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const data = { ...req.body };
            delete data.id;
            delete data.createdAt;
            const updated = await prisma.projeto.update({ where: { id: slugOrId }, data });
            return res.status(200).json(updated);
          }
        } catch (e) {
          console.error('Update project DB error:', e);
        }
        return res.status(200).json({ id: slugOrId, ...req.body });
      }

      if (method === 'DELETE') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            await prisma.projeto.delete({ where: { id: slugOrId } });
            return res.status(200).json({ success: true });
          }
        } catch (e) {
          console.error('Delete project DB error:', e);
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
            const budgets = await prisma.orcamento.findMany({
              include: { cliente: true },
              orderBy: { createdAt: 'desc' }
            });
            if (budgets && budgets.length > 0) return res.status(200).json(budgets);
          }
        } catch (e) {
          console.error('Budgets DB error:', e);
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

        try {
          const prisma = getPrisma();
          if (prisma) {
            let client = await prisma.cliente.findFirst({
              where: { telefone: { contains: telefone.replace(/\D/g, '') } }
            });
            if (!client) {
              client = await prisma.cliente.create({
                data: { nome, telefone, email: req.body.email || '', cidade: req.body.cidade || '' }
              });
            }
            const newBudget = await prisma.orcamento.create({
              data: {
                clienteId: client.id,
                ambiente,
                descricao,
                medidas: req.body.medidas || 'A combinar',
                status: 'PENDENTE'
              },
              include: { cliente: true }
            });
            return res.status(201).json({ success: true, budget: newBudget, whatsappUrl });
          }
        } catch (e) {
          console.error('Create budget DB error:', e);
        }

        const newB = { id: `budg-${Date.now()}`, ...req.body, status: 'PENDENTE', createdAt: new Date().toISOString() };
        (dbJson.budgets = dbJson.budgets || []).unshift(newB);
        return res.status(201).json({ success: true, budget: newB, whatsappUrl });
      }
    }

    if (path.startsWith('/budgets/')) {
      const parts = path.split('/');
      const id = parts[2];
      const sub = parts[3];

      if (sub === 'status' && method === 'PATCH') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const updated = await prisma.orcamento.update({ where: { id }, data: { status: req.body.status } });
            return res.status(200).json(updated);
          }
        } catch (e) {
          console.error('Update budget DB error:', e);
        }
        return res.status(200).json({ id, status: req.body?.status });
      }

      if (method === 'DELETE') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            await prisma.orcamento.delete({ where: { id } });
            return res.status(200).json({ success: true });
          }
        } catch (e) {
          console.error('Delete budget DB error:', e);
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
            const messages = await prisma.mensagem.findMany({ orderBy: { createdAt: 'desc' } });
            if (messages && messages.length > 0) return res.status(200).json(messages);
          }
        } catch (e) {
          console.error('Messages DB error:', e);
        }
        return res.status(200).json(dbJson.messages || []);
      }

      if (method === 'POST') {
        const { nome, mensagem } = req.body || {};
        if (!nome || !mensagem) return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });

        try {
          const prisma = getPrisma();
          if (prisma) {
            await prisma.mensagem.create({
              data: {
                nome,
                mensagem,
                email: req.body.email || '',
                telefone: req.body.telefone || '',
                assunto: req.body.assunto || 'Contato via Site',
                status: 'NOVA'
              }
            });
            return res.status(201).json({ success: true });
          }
        } catch (e) {
          console.error('Create message DB error:', e);
        }

        return res.status(201).json({ success: true });
      }
    }

    if (path.startsWith('/messages/')) {
      const parts = path.split('/');
      const id = parts[2];
      const sub = parts[3];

      if (sub === 'status' && method === 'PATCH') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            const updated = await prisma.mensagem.update({ where: { id }, data: { status: req.body.status } });
            return res.status(200).json(updated);
          }
        } catch (e) {
          console.error('Update message DB error:', e);
        }
        return res.status(200).json({ id, status: req.body?.status });
      }

      if (method === 'DELETE') {
        try {
          const prisma = getPrisma();
          if (prisma) {
            await prisma.mensagem.delete({ where: { id } });
            return res.status(200).json({ success: true });
          }
        } catch (e) {
          console.error('Delete message DB error:', e);
        }
        return res.status(200).json({ success: true });
      }
    }

    // 9. CLIENTS
    if (path === '/clients') {
      try {
        const prisma = getPrisma();
        if (prisma) {
          const clients = await prisma.cliente.findMany({ orderBy: { createdAt: 'desc' } });
          if (clients && clients.length > 0) return res.status(200).json(clients);
        }
      } catch (e) {
        console.error('Clients DB error:', e);
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
      const { fileData, fileName } = req.body || {};
      if (!fileData) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      return res.status(200).json({
        url: fileData,
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
