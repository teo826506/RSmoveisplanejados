import { Projeto, Cliente, Orcamento, Mensagem, VideoItem, SiteSettings } from '../types';

export const INITIAL_PROJECTS: Projeto[] = [
  // --- COZINHAS ---
  {
    id: 'proj-1',
    titulo: 'Cozinha Gourmet com Ilha Central & Torre Quente',
    slug: 'cozinha-gourmet-com-ilha-central-torre-quente',
    categoria: 'Cozinhas',
    descricao: 'Projeto de cozinha integrada de altíssimo padrão com bancada em ilha central com cooktop de indução, torre quente para forno e micro-ondas embutidos, armários até o teto em MDF Grafite Matt com perfis dourados e gavetões com amortecimento invisível.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 1,
    ativo: true,
    materiais: ['MDF Naval 18mm Ultra', 'Laca Grafite Matt', 'Ilha em Quartzo & MDF', 'Ferragens Blum Soft-Close'],
    detalhes: {
      ambiente: 'Cozinha & Espaço Gourmet Integrado',
      acabamento: 'Laca Matt & Alumínio Dourado Escovado',
      tempoExecucao: '25 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z'
  },
  {
    id: 'proj-2',
    titulo: 'Cozinha Linear Contemporânea com Cristaleira LED',
    slug: 'cozinha-linear-contemporanea-com-cristaleira-led',
    categoria: 'Cozinhas',
    descricao: 'Modulação linear elegante com armários aéreos com portas em vidro reflecta bronze, cristaleira iluminada por perfis de LED 3000K, puxadores cava usinados e gavetários profundos com corrediças ocultas.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 2,
    ativo: true,
    materiais: ['MDF Gianduia Acetinado', 'Vidro Reflecta Bronze', 'Perfis de Alumínio Champagne', 'LED Linear 3000K'],
    detalhes: {
      ambiente: 'Cozinha Linear',
      acabamento: 'Vidro Reflecta & MDF Acetinado',
      tempoExecucao: '20 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-11T11:00:00.000Z',
    updatedAt: '2026-08-11T11:00:00.000Z'
  },
  {
    id: 'proj-3',
    titulo: 'Cozinha Compacta Inteligente para Apartamentos',
    slug: 'cozinha-compacta-inteligente-para-apartamentos',
    categoria: 'Cozinhas',
    descricao: 'Marcenaria sob medida planejada para otimização máxima de pequenos espaços, contando com mesa retrátil embutida, despensa aramada deslizante, lixeira dupla oculta e nicho basculante com pistão a gás.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1502005229762-ee1b2da97e06?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 3,
    ativo: true,
    materiais: ['MDF Branco Diamante', 'MDF Louro Freijó', 'Pistões a Gás Häfele', 'Aramados Deslizantes Inox'],
    detalhes: {
      ambiente: 'Cozinha Compacta de Apartamento',
      acabamento: 'Madeira Clara & Branco Fosco',
      tempoExecucao: '18 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-12T09:00:00.000Z',
    updatedAt: '2026-08-12T09:00:00.000Z'
  },

  // --- QUARTOS ---
  {
    id: 'proj-4',
    titulo: 'Suíte Master com Cabeceira Ripada & Mesas Flutuantes',
    slug: 'suite-master-com-cabeceira-ripada-mesas-flutuantes',
    categoria: 'Quartos',
    descricao: 'Dormitório sofisticado com painel de cabeceira estendido do piso ao teto em MDF Louro Freijó natural com usinagem ripada em CNC, mesas de cabeceira suspensas com gavetas invisíveis e fita LED perimetral embutida.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 4,
    ativo: true,
    materiais: ['MDF Madeirado Louro Freijó', 'MDF Cinza Sagrado', 'Fita LED Dual 2700K', 'Carregador Indução Embutido'],
    detalhes: {
      ambiente: 'Suíte Casal Master',
      acabamento: 'Ripado Usinado em CNC & Laca Acetinada',
      tempoExecucao: '18 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-13T14:30:00.000Z',
    updatedAt: '2026-08-13T14:30:00.000Z'
  },
  {
    id: 'proj-5',
    titulo: 'Dormitório com Roupeiro Embutido & Portas de Correr',
    slug: 'dormitorio-com-roupeiro-embutido-portas-de-correr',
    categoria: 'Quartos',
    descricao: 'Guarda-roupa planejado até o teto com 3 portas de correr em trilhos suspensos amortecidos, ampla frente em espelho prata bisotado, divisões internas sob medida para calçados, malas e vestidos longos com iluminação interna.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 5,
    ativo: true,
    materiais: ['MDF Nogueira Cadiz', 'Espelho Cristal Prata Bisotado', 'Trilhos com Amortecimento Anti-Descarrilamento', 'Puxadores Perfil Alumínio'],
    detalhes: {
      ambiente: 'Dormitório Casal',
      acabamento: 'Nogueira Nobre & Espelho Amplo',
      tempoExecucao: '20 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-14T10:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z'
  },
  {
    id: 'proj-6',
    titulo: 'Quarto Juvenil Multifuncional com Cama Baú & Escrivaninha',
    slug: 'quarto-juvenil-multifuncional-cama-bau-escrivaninha',
    categoria: 'Quartos',
    descricao: 'Mobiliário integrado para quarto juvenil com cama baú com gavetões inferiores, escrivaninha de estudos ergonômica com passa-fios, painel decorativo e prateleiras aéreas com nichos em laca.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 6,
    ativo: true,
    materiais: ['MDF Carvalho Malva', 'Laca Fosca Verde Eucalipto', 'Pistões Baú Reforçados', 'Corrediças Ocultas'],
    detalhes: {
      ambiente: 'Quarto Juvenil / Solteiro',
      acabamento: 'Madeirado Claro & Laca Colorida',
      tempoExecucao: '16 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-15T16:00:00.000Z',
    updatedAt: '2026-08-15T16:00:00.000Z'
  },

  // --- CLOSETS ---
  {
    id: 'proj-7',
    titulo: 'Closet Walk-In de Alto Luxo com Portas Reflecta Fumê',
    slug: 'closet-walk-in-alto-luxo-portas-reflecta-fume',
    categoria: 'Closets',
    descricao: 'Closet planejado fechado com portas em perfis de alumínio anodizado preto e vidro reflecta fumê. Iluminação inteligente acionada por sensor de presença em todas as prateleiras e gavetas organizadoras com visor de veludo.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 7,
    ativo: true,
    materiais: ['MDF Carvalho Boreal 18mm', 'Vidro Fumê Temperado', 'Sensores de Proximidade', 'Corrediças Telescópicas Ocultas'],
    detalhes: {
      ambiente: 'Closet Casal Master',
      acabamento: 'Vidro Reflecta & Iluminação Interna',
      tempoExecucao: '22 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-16T09:15:00.000Z',
    updatedAt: '2026-08-16T09:15:00.000Z'
  },
  {
    id: 'proj-8',
    titulo: 'Closet Aberto Estilo Boutique com Ilha para Joias',
    slug: 'closet-aberto-estilo-boutique-com-ilha-para-joias',
    categoria: 'Closets',
    descricao: 'Conceito closet aberto com ilha central revestida em MDF Nocce California com tampo em vidro transparente de 10mm, nichos aveludados para relógios e joias, sapateiras inclinadas retroiluminadas e calceiros com amortecimento.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 8,
    ativo: true,
    materiais: ['MDF Nocce California', 'Vidro Extra Clear 10mm', 'Bandejas Forradas a Veludo', 'Fitas LED 3000K Embutidas'],
    detalhes: {
      ambiente: 'Closet Estilo Boutique',
      acabamento: 'Ilha Central com Expositor & Nichos Aveludados',
      tempoExecucao: '20 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-17T11:20:00.000Z',
    updatedAt: '2026-08-17T11:20:00.000Z'
  },
  {
    id: 'proj-9',
    titulo: 'Closet em L com Penteadeira Camarim Integrada',
    slug: 'closet-em-l-com-penteadeira-camarim-integrada',
    categoria: 'Closets',
    descricao: 'Disposição em formato L com aproveitamento inteligente de cantos, prateleiras reforçadas para malas, cabideiros duplos cromados e bancada penteadeira com espelho camarim e gaveta organizadora de maquiagem.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 9,
    ativo: true,
    materiais: ['MDF Branco Supremo Acetinado', 'Espelho Cristal com Luz Neutra 4000K', 'Gavetas Tip-On Touch', 'Ferragens Soft-Close'],
    detalhes: {
      ambiente: 'Closet em L com Toucador',
      acabamento: 'Branco Acetinado & Espelho Camarim',
      tempoExecucao: '17 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-18T14:00:00.000Z',
    updatedAt: '2026-08-18T14:00:00.000Z'
  },

  // --- SALAS ---
  {
    id: 'proj-10',
    titulo: 'Home Theater Monumental com Painel Ripado para TV 85"',
    slug: 'home-theater-monumental-com-painel-ripado-para-tv-85',
    categoria: 'Salas',
    descricao: 'Painel monumental para televisão até 85 polegadas com transição harmônica entre MDF Mármore Nero e MDF Nogal Champagne ripado, rack inferior suspenso com portas basculantes com pistão a gás e passagem oculta de fiações.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 10,
    ativo: true,
    materiais: ['MDF Nero Marquina 25mm', 'MDF Nogal Champagne', 'Fita de Borda PUR Impermeável', 'Pistões a Gás Häfele'],
    detalhes: {
      ambiente: 'Sala de Estar / Home Theater',
      acabamento: 'Efeito Mármore & Madeira Quente Ripada',
      tempoExecucao: '18 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-19T16:00:00.000Z',
    updatedAt: '2026-08-19T16:00:00.000Z'
  },
  {
    id: 'proj-11',
    titulo: 'Estante Divisória de Ambientes em MDF Vazado & Nichos',
    slug: 'estante-divisoria-ambientes-mdf-vazado-nichos',
    categoria: 'Salas',
    descricao: 'Móvel divisor arquitetônico vazado que separa sutilmente o living da sala de jantar sem barrar a luz natural. Estrutura em MDF Carvalho Nobre combinada a perfis metálicos dourados e nichos decorativos com spots em LED.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 11,
    ativo: true,
    materiais: ['MDF Carvalho 25mm', 'Perfis Metálicos com Pintura Eletrostática Ouro', 'Spots LED Embutidos', 'Nichos Assimétricos'],
    detalhes: {
      ambiente: 'Living Integrado / Divisória de Ambientes',
      acabamento: 'Vazado Arquitetônico & Iluminação Decorativa',
      tempoExecucao: '15 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'proj-12',
    titulo: 'Buffet Aparador & Cristaleira Iluminada para Sala de Jantar',
    slug: 'buffet-aparador-cristaleira-iluminada-sala-jantar',
    categoria: 'Salas',
    descricao: 'Composição de requinte para sala de jantar com cristaleira com portas em perfis slim e vidro reflecta bronze, prateleiras em vidro lapidado 8mm com iluminação perimetral e buffet inferior com gavetas organizadoras de talheres.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 12,
    ativo: true,
    materiais: ['MDF Laca Fendi Fosca', 'Vidro Reflecta Bronze', 'Divisores de Talheres em Veludo', 'Ferragens Blum Push-to-Open'],
    detalhes: {
      ambiente: 'Sala de Jantar & Bar',
      acabamento: 'Laca Fendi & Cristaleira Reflecta Bronze',
      tempoExecucao: '16 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-21T15:30:00.000Z',
    updatedAt: '2026-08-21T15:30:00.000Z'
  },

  // --- HOME OFFICE ---
  {
    id: 'proj-13',
    titulo: 'Home Office Executivo com Mesa em L & Estante Modular',
    slug: 'home-office-executivo-com-mesa-em-l-estante-modular',
    categoria: 'Home Office',
    descricao: 'Ambiente de trabalho funcional e imponente com mesa ampla em L com calha de fiação oculta e conectividade integrada, gaveteiro com fechadura e estante iluminada com nichos para livros e troféus.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 13,
    ativo: true,
    materiais: ['MDF Ébano Chess', 'MDF Cinza Sagrado', 'Conectividade Oculta no Tampo', 'Fitas LED 4000K Neutro'],
    detalhes: {
      ambiente: 'Home Office Executivo / Gabinete',
      acabamento: 'Textura Madeirada Fosca & Laca Acetinada',
      tempoExecucao: '15 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-22T11:00:00.000Z',
    updatedAt: '2026-08-22T11:00:00.000Z'
  },
  {
    id: 'proj-14',
    titulo: 'Estação de Trabalho Minimalista com Armários Flutuantes',
    slug: 'estacao-trabalho-minimalista-armarios-flutuantes',
    categoria: 'Home Office',
    descricao: 'Bancada suspensa sob medida em MDF Carvalho Hanover com estrutura em mão francesa reforçada oculta, armários aéreos basculantes com pistão a gás e gaveteiro volante com rodízios de silicone.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 14,
    ativo: true,
    materiais: ['MDF Carvalho Hanover 25mm', 'Pistões a Gás Häfele', 'Passa-Cabos Escovado', 'Rodízios em Gel'],
    detalhes: {
      ambiente: 'Home Office de Apartamento',
      acabamento: 'Madeirado Natural & Design Minimalista',
      tempoExecucao: '12 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-23T09:30:00.000Z',
    updatedAt: '2026-08-23T09:30:00.000Z'
  },

  // --- BANHEIROS ---
  {
    id: 'proj-15',
    titulo: 'Gabinete Suspenso de Banheiro com Espelheira Camarim LED',
    slug: 'gabinete-suspenso-banheiro-espelheira-camarim-led',
    categoria: 'Banheiros',
    descricao: 'Gabinete suspenso com estrutura 100% em MDF Naval Ultra resistente a umidade e vapores, gavetões com divisores acrílicos para cosméticos, toalheiro embutido e espelheira camarim com iluminação anti-embaçante.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 15,
    ativo: true,
    materiais: ['100% MDF Hidrorrepelente Ultra', 'Laca Branca PU Alto Brilho', 'Espelho Cristal Bisotado', 'Puxadores Usinados'],
    detalhes: {
      ambiente: 'Banheiro Master / Suíte',
      acabamento: '100% MDF Naval Anti-Umidade & Laca PU',
      tempoExecucao: '12 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-24T08:30:00.000Z',
    updatedAt: '2026-08-24T08:30:00.000Z'
  },
  {
    id: 'proj-16',
    titulo: 'Móvel para Lavabo de Luxo com Frente Ripada & Nicho Oculto',
    slug: 'movel-para-lavabo-luxo-frente-ripada-nicho-oculto',
    categoria: 'Banheiros',
    descricao: 'Móvel exclusivo para lavabo social executado em MDF Louro Freijó naval com frente ripada usinada, suporte para cuba de sobrepor esculpida e nicho inferior embutido com iluminação quente para toalhas e aromatizador.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 16,
    ativo: true,
    materiais: ['MDF Louro Freijó Naval 18mm', 'Usinagem Ripada Fina', 'Spot LED Integrado 3000K', 'Corrediças Ocultas Amortecidas'],
    detalhes: {
      ambiente: 'Lavabo Social de Luxo',
      acabamento: 'Ripado Nobre & Cuba Esculpida',
      tempoExecucao: '10 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-25T14:00:00.000Z',
    updatedAt: '2026-08-25T14:00:00.000Z'
  },

  // --- ESPAÇO GOURMET ---
  {
    id: 'proj-17',
    titulo: 'Bancada Gourmet com Armários de Churrasqueira & Adega',
    slug: 'bancada-gourmet-armarios-churrasqueira-adega',
    categoria: 'Espaço Gourmet',
    descricao: 'Área gourmet de lazer completa com armários inferiores projetados para área de churrasqueira com isolamento térmico, nichos adega especiais para vinhos e aéreos com vidro reflecta bronze e iluminação indireta.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 17,
    ativo: true,
    materiais: ['MDF Carbono Ultra Anti-Calor', 'MDF Cumaru Nobre', 'Vidro Reflecta Bronze', 'Trilhos Telescópicos Inox 304'],
    detalhes: {
      ambiente: 'Varanda / Área Gourmet de Churrasqueira',
      acabamento: 'Resistente a Calor & Umidade Externa',
      tempoExecucao: '20 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-26T13:00:00.000Z',
    updatedAt: '2026-08-26T13:00:00.000Z'
  },
  {
    id: 'proj-18',
    titulo: 'Balcão Bar Gourmet Ilhado com Cristaleira Aérea',
    slug: 'balcao-bar-gourmet-ilhado-cristaleira-aerea',
    categoria: 'Espaço Gourmet',
    descricao: 'Balcão ilha gourmet com acabamento em MDF Preto Matt anti-marcas de dedos, estrutura de prateleiras suspensas em serralheria dourada para copos e taças, espaço planejado para embutir chopeira e frigobar.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 18,
    ativo: true,
    materiais: ['MDF Preto Fosco Anti-Marcas', 'Prateleiras em Metal Dourado Escovado', 'Nichos para Embutir Eletros', 'Fitas LED 3000K'],
    detalhes: {
      ambiente: 'Espaço Convivência Gourmet & Bar',
      acabamento: 'MDF Anti-Marcas & Serralheria Dourada',
      tempoExecucao: '18 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-27T10:00:00.000Z',
    updatedAt: '2026-08-27T10:00:00.000Z'
  },

  // --- CORPORATIVO ---
  {
    id: 'proj-19',
    titulo: 'Balcão de Recepção Curvo Monolítico com LED Frontal',
    slug: 'balcao-recepcao-curvo-monolitico-led-frontal',
    categoria: 'Corporativo',
    descricao: 'Balcão de recepção monumental curvo monolítico para escritórios e clínicas de alto padrão, revestimento em MDF Titanium com usinagem especial contínua, logotipo com retroiluminação e tampo de atendimento com passa-cabos ocultos.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    ordem: 19,
    ativo: true,
    materiais: ['MDF Titânio Trama', 'MDF Duna Acetinado', 'Acrílico Retroiluminado', 'Usinagem CNC Especial Curva'],
    detalhes: {
      ambiente: 'Recepção / Escritório Corporativo / Clínica',
      acabamento: 'Design Curvo Monolítico & Iluminação LED Frontal',
      tempoExecucao: '25 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-28T10:00:00.000Z',
    updatedAt: '2026-08-28T10:00:00.000Z'
  },
  {
    id: 'proj-20',
    titulo: 'Mesa de Reunião Corporativa com Conectividade & Credenza',
    slug: 'mesa-reuniao-corporativa-conectividade-credenza',
    categoria: 'Corporativo',
    descricao: 'Mesa executiva de reuniões para 10 posições em MDF Nogal com bordas chanfradas a 45 graus, caixas retráteis de conectividade com tomadas, rede e HDMI, acompanhada de credenza lateral para coffee break e equipamentos.',
    imagemPrincipal: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85',
    imagens: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    ordem: 20,
    ativo: true,
    materiais: ['MDF Nogal Champagne 36mm', 'Bordas Chanfradas 45º com PUR', 'Caixas de Tomadas Retráteis', 'Credenza com Amortecimento'],
    detalhes: {
      ambiente: 'Sala de Diretoria & Reuniões',
      acabamento: 'Tampo Duplo Espesso & Conectividade Integrada',
      tempoExecucao: '18 dias úteis',
      garantia: '5 anos de garantia total'
    },
    createdAt: '2026-08-29T11:00:00.000Z',
    updatedAt: '2026-08-29T11:00:00.000Z'
  }
];

export const INITIAL_CLIENTS: Cliente[] = [
  {
    id: 'cli-1',
    nome: 'Dra. Mariana Vasconcelos',
    email: 'mariana.vasconcelos@email.com',
    telefone: '(11) 98765-4321',
    cidade: 'São Paulo - SP',
    observacoes: 'Interesse em projeto completo para apartamento de 140m².',
    createdAt: '2026-08-29T14:20:00.000Z',
    updatedAt: '2026-08-29T14:20:00.000Z'
  },
  {
    id: 'cli-2',
    nome: 'Carlos Eduardo Mendes',
    email: 'carlos.mendes@empresa.com.br',
    telefone: '(11) 97654-3210',
    cidade: 'Campinas - SP',
    observacoes: 'Solicitou orçamento de Cozinha Gourmet com ilha e cristaleira.',
    createdAt: '2026-08-30T09:10:00.000Z',
    updatedAt: '2026-08-30T09:10:00.000Z'
  },
  {
    id: 'cli-3',
    nome: 'Juliana e Roberto Silva',
    email: 'juliana.silva@gmail.com',
    telefone: '(11) 99123-8877',
    cidade: 'Alphaville - Barueri',
    observacoes: 'Deseja closet walk-in com portas reflecta e iluminação em led.',
    createdAt: '2026-08-31T17:45:00.000Z',
    updatedAt: '2026-08-31T17:45:00.000Z'
  }
];

export const INITIAL_BUDGETS: Orcamento[] = [
  {
    id: 'orc-101',
    clienteId: 'cli-1',
    cliente: INITIAL_CLIENTS[0],
    ambiente: 'Cozinha e Sala Integradas',
    descricao: 'Projeto em conceito aberto, armários até o teto em MDF Grafite Matt com perfis dourados e painel ripado para a TV.',
    medidas: 'Aprox. 32m² de área total',
    orcamentoEstimado: 'R$ 28.500 - R$ 35.000',
    status: 'EM_ANALISE',
    createdAt: '2026-08-29T14:25:00.000Z',
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'orc-102',
    clienteId: 'cli-2',
    cliente: INITIAL_CLIENTS[1],
    ambiente: 'Cozinha Gourmet',
    descricao: 'Bancada com cooktop, torre quente para forno duplo e micro-ondas, gavetões invisíveis e torre de tomadas embutida.',
    medidas: '4.20m x 2.80m',
    orcamentoEstimado: 'R$ 22.000 - R$ 26.000',
    status: 'PENDENTE',
    createdAt: '2026-08-30T09:15:00.000Z',
    updatedAt: '2026-08-30T09:15:00.000Z'
  },
  {
    id: 'orc-103',
    clienteId: 'cli-3',
    cliente: INITIAL_CLIENTS[2],
    ambiente: 'Closet Casal',
    descricao: 'Closet em formato U com ilha central para joias e relógios com tampo de vidro, sapateiras inclinadas iluminadas e espelho até o teto.',
    medidas: '3.50m x 3.00m',
    orcamentoEstimado: 'R$ 18.000 - R$ 24.000',
    status: 'EM_CONTATO',
    createdAt: '2026-08-31T17:50:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z'
  }
];

export const INITIAL_MESSAGES: Mensagem[] = [
  {
    id: 'msg-1',
    nome: 'Fernanda Albuquerque',
    email: 'fernanda.arq@studio.com',
    telefone: '(11) 98877-6655',
    assunto: 'Parceria com Escritório de Arquitetura',
    mensagem: 'Olá equipe RS Móveis! Sou arquiteta e gostaria de agendar uma reunião para apresentar projetos dos nossos clientes e firmar parceria de marcenaria de alto padrão.',
    status: 'NOVA',
    createdAt: '2026-09-01T11:30:00.000Z'
  },
  {
    id: 'msg-2',
    nome: 'Rodrigo Guimarães',
    email: 'rodrigo.g@outlook.com',
    telefone: '(11) 97766-5544',
    assunto: 'Dúvida sobre prazo de entrega',
    mensagem: 'Boa tarde, estou com as chaves do meu apartamento previstas para o próximo mês. Qual o prazo médio entre a medição e a instalação final da cozinha e dos quartos?',
    status: 'LIDA',
    createdAt: '2026-08-31T16:20:00.000Z'
  }
];

export const DEFAULT_WHATSAPP_NUMBER = '5511999998888';

export const INITIAL_SETTINGS: SiteSettings = {
  nomeEmpresa: 'RS Móveis Planejados em MDF',
  slogan: 'Em MDF, para espaços únicos como você.',
  subtitulo: 'SOFISTICAÇÃO QUE TRANSFORMA',
  heroTagline: 'SOFISTICAÇÃO QUE TRANSFORMA',
  heroTituloLinha1: 'MÓVEIS',
  heroTituloLinha2: 'PLANEJADOS',
  heroDescricao: 'Em MDF, para espaços únicos como você. Projetos sob medida de alto luxo com acabamentos nobres, ferragens com amortecedores e 5 anos de garantia.',
  heroImagemFundo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90',
  telefonePrincipal: '(11) 99999-8888',
  telefoneFixo: '(11) 3456-7890',
  whatsappNumero: '5511999998888',
  emailPrincipal: 'contato@rsplanejados.com.br',
  emailProjetos: 'orcamentos@rsplanejados.com.br',
  endereco: 'São Paulo, SP - Atendimento em toda Grande SP, Alphaville, Litoral e Interior',
  instagram: 'https://instagram.com/rsplanejados',
  facebook: 'https://facebook.com/rsplanejados',
  youtube: 'https://youtube.com/@rsplanejados',
  statProjetos: '+500',
  statClientes: '+98%',
  statAnos: '+10 ANOS',
  statAtendimento: 'PERSONALIZADO E LOCAL',
  logoTamanho: 'grande',
  brilhoOuroIntensidade: 'extremo',
  adminEmail: 'admin@rsplanejados.com.br',
  adminPassword: 'admin',
  updatedAt: new Date().toISOString()
};

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    titulo: 'Tour Completo: Cozinha Gourmet Noir & Gold com Ilha',
    descricao: 'Veja todos os detalhes dos armários em MDF Grafite Matt com perfis dourados em alumínio, gavetões invisíveis e iluminação em LED.',
    tipo: 'YOUTUBE',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    youtubeId: 'LXb3EKWsInQ',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    categoria: 'Cozinhas',
    duracao: '3:15',
    destaque: true,
    ativo: true,
    ordem: 1,
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'vid-2',
    titulo: 'Closet Walk-In de Alto Luxo com Vidro Reflecta',
    descricao: 'Apresentação do closet com portas em alumínio preto, vidro fumê reflecta e gaveteiros com divisórias aveludadas.',
    tipo: 'YOUTUBE',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnail: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1200&q=80',
    categoria: 'Closets',
    duracao: '4:20',
    destaque: true,
    ativo: true,
    ordem: 2,
    createdAt: '2026-08-22T15:00:00.000Z',
    updatedAt: '2026-08-22T15:00:00.000Z'
  },
  {
    id: 'vid-3',
    titulo: 'Processo Fabril: Tecnologia CNC e Precisão no MDF',
    descricao: 'Conheça nossos maquinários alemães de corte milimétrico, colagem de bordas PUR impermeável e controle de qualidade rigoroso.',
    tipo: 'YOUTUBE',
    url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    youtubeId: 'fJ9rUzIMcZQ',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    categoria: 'Processo Fabril',
    duracao: '2:50',
    destaque: true,
    ativo: true,
    ordem: 3,
    createdAt: '2026-08-25T11:00:00.000Z',
    updatedAt: '2026-08-25T11:00:00.000Z'
  },
  {
    id: 'vid-4',
    titulo: 'Depoimento de Cliente: Apartamento Completo 160m²',
    descricao: 'A cliente Dra. Mariana conta a experiência de fazer toda a marcenaria da sua nova residência com a RS Móveis Planejados.',
    tipo: 'YOUTUBE',
    url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeId: 'ScMzIvxBSi4',
    thumbnail: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    categoria: 'Depoimentos',
    duracao: '1:45',
    destaque: false,
    ativo: true,
    ordem: 4,
    createdAt: '2026-08-28T16:30:00.000Z',
    updatedAt: '2026-08-28T16:30:00.000Z'
  }
];
