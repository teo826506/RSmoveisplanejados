import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// In CommonJS/ESM mixed env, __dirname can be tricky.
// Since seed runs via tsx, we can use process.cwd()
const dbPath = path.join(process.cwd(), 'data', 'db.json');

async function main() {
  console.log('--- Iniciando Migração para RS Móveis Planejados em MDF ---');
  
  if (!fs.existsSync(dbPath)) {
    console.error('db.json não encontrado!');
    return;
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // 1. Clientes & Orçamentos
  console.log(`Migrando ${db.clients?.length || 0} clientes...`);
  for (const client of db.clients || []) {
    await prisma.cliente.upsert({
      where: { id: client.id },
      update: {},
      create: {
        id: client.id,
        nome: client.nome,
        email: client.email,
        telefone: client.telefone,
        cidade: client.cidade,
        observacoes: client.observacoes,
        createdAt: new Date(client.createdAt || Date.now()),
        updatedAt: new Date(client.updatedAt || Date.now())
      }
    });
  }

  console.log(`Migrando ${db.budgets?.length || 0} orçamentos...`);
  for (const budget of db.budgets || []) {
    await prisma.orcamento.upsert({
      where: { id: budget.id },
      update: {},
      create: {
        id: budget.id,
        clienteId: budget.clienteId,
        ambiente: budget.ambiente,
        descricao: budget.descricao,
        medidas: budget.medidas,
        orcamentoEstimado: budget.orcamentoEstimado,
        status: budget.status,
        createdAt: new Date(budget.createdAt || Date.now()),
        updatedAt: new Date(budget.updatedAt || Date.now())
      }
    });
  }

  // 2. Projetos
  console.log(`Migrando ${db.projects?.length || 0} projetos...`);
  for (const proj of db.projects || []) {
    const slug = proj.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + proj.id;
    await prisma.projeto.upsert({
      where: { id: proj.id },
      update: {},
      create: {
        id: proj.id,
        titulo: proj.titulo,
        slug: slug,
        descricao: proj.descricao,
        categoria: proj.categoria,
        imagemPrincipal: proj.imagemPrincipal,
        imagens: proj.imagens || [],
        destaque: proj.destaque,
        ordem: proj.ordem || 0,
        ativo: proj.ativo,
        materiais: proj.materiais || [],
        createdAt: new Date(proj.createdAt || Date.now()),
        updatedAt: new Date(proj.updatedAt || Date.now())
      }
    });
  }

  // 3. Vídeos
  console.log(`Migrando ${db.videos?.length || 0} vídeos...`);
  for (const vid of db.videos || []) {
    await prisma.video.upsert({
      where: { id: vid.id },
      update: {},
      create: {
        id: vid.id,
        titulo: vid.titulo,
        descricao: vid.descricao,
        tipo: vid.tipo,
        url: vid.url,
        youtubeId: vid.youtubeId,
        thumbnail: vid.thumbnail,
        categoria: vid.categoria,
        duracao: vid.duracao,
        destaque: vid.destaque,
        ativo: vid.ativo,
        ordem: vid.ordem || 0,
        createdAt: new Date(vid.createdAt || Date.now()),
        updatedAt: new Date(vid.updatedAt || Date.now())
      }
    });
  }

  // 4. Mensagens
  console.log(`Migrando ${db.messages?.length || 0} mensagens...`);
  for (const msg of db.messages || []) {
    await prisma.mensagem.upsert({
      where: { id: msg.id },
      update: {},
      create: {
        id: msg.id,
        nome: msg.nome,
        email: msg.email,
        telefone: msg.telefone,
        assunto: msg.assunto,
        mensagem: msg.mensagem,
        status: msg.status,
        createdAt: new Date(msg.createdAt || Date.now())
      }
    });
  }

  // 5. Site Settings
  if (db.settings) {
    console.log(`Migrando configurações do site...`);
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        nomeEmpresa: db.settings.nomeEmpresa || '',
        slogan: db.settings.slogan || '',
        subtitulo: db.settings.subtitulo || '',
        heroTagline: db.settings.heroTagline || '',
        heroTituloLinha1: db.settings.heroTituloLinha1 || '',
        heroTituloLinha2: db.settings.heroTituloLinha2 || '',
        heroDescricao: db.settings.heroDescricao || '',
        heroImagemFundo: db.settings.heroImagemFundo || '',
        heroVideoFundo: db.settings.heroVideoFundo,
        telefonePrincipal: db.settings.telefonePrincipal || '',
        telefoneFixo: db.settings.telefoneFixo || '',
        whatsappNumero: db.settings.whatsappNumero || '',
        emailPrincipal: db.settings.emailPrincipal || '',
        emailProjetos: db.settings.emailProjetos || '',
        endereco: db.settings.endereco || '',
        instagram: db.settings.instagram || '',
        facebook: db.settings.facebook || '',
        youtube: db.settings.youtube || '',
        statProjetos: db.settings.statProjetos || '',
        statClientes: db.settings.statClientes || '',
        statAnos: db.settings.statAnos || '',
        statAtendimento: db.settings.statAtendimento || '',
        logoTamanho: db.settings.logoTamanho || 'normal',
        brilhoOuroIntensidade: db.settings.brilhoOuroIntensidade || 'alto',
        adminEmail: db.settings.adminEmail,
        adminPassword: db.settings.adminPassword,
        updatedAt: new Date()
      }
    });
  }

  // 6. Galeria
  console.log(`Migrando ${db.gallery?.length || 0} imagens da galeria...`);
  for (const url of db.gallery || []) {
    await prisma.galeria.upsert({
      where: { url },
      update: {},
      create: { url }
    });
  }

  console.log('--- Migração finalizada com sucesso! ---');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
