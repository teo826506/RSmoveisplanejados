export type StatusOrcamento = 'PENDENTE' | 'EM_CONTATO' | 'EM_ANALISE' | 'CONCLUIDO' | 'CANCELADO';
export type StatusMensagem = 'NOVA' | 'LIDA' | 'RESPONDIDA';

export type CategoriaProjeto = 
  | 'Todas'
  | 'Cozinhas'
  | 'Quartos'
  | 'Closets'
  | 'Salas'
  | 'Home Office'
  | 'Banheiros'
  | 'Corporativo'
  | 'Espaço Gourmet';

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  cidade?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Orcamento {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  ambiente: string;
  descricao: string;
  medidas?: string;
  orcamentoEstimado?: string;
  status: StatusOrcamento;
  createdAt: string;
  updatedAt: string;
}

export interface Projeto {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  categoria: string;
  imagemPrincipal: string;
  imagens: string[];
  videoUrl?: string;
  destaque: boolean;
  ordem: number;
  ativo: boolean;
  materiais?: string[];
  detalhes?: {
    ambiente: string;
    acabamento: string;
    tempoExecucao: string;
    garantia: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VideoItem {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'YOUTUBE' | 'MP4' | 'VIMEO';
  url: string;
  youtubeId?: string;
  thumbnail: string;
  categoria: string;
  duracao?: string;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  nomeEmpresa: string;
  slogan: string;
  subtitulo: string;
  heroTagline: string;
  heroTituloLinha1: string;
  heroTituloLinha2: string;
  heroDescricao: string;
  heroImagemFundo: string;
  heroVideoFundo?: string;
  telefonePrincipal: string;
  telefoneFixo: string;
  whatsappNumero: string;
  emailPrincipal: string;
  emailProjetos: string;
  endereco: string;
  instagram: string;
  facebook: string;
  youtube: string;
  statProjetos: string;
  statClientes: string;
  statAnos: string;
  statAtendimento: string;
  logoTamanho: 'normal' | 'grande' | 'monumental';
  brilhoOuroIntensidade: 'alto' | 'extremo' | 'ouro-puro';
  adminEmail?: string;
  adminPassword?: string;
  updatedAt?: string;
}

export interface Mensagem {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  assunto?: string;
  mensagem: string;
  status: StatusMensagem;
  createdAt: string;
}

export interface Administrador {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalProjetos: number;
  projetosDestaque: number;
  totalVideos: number;
  orcamentosPendentes: number;
  orcamentosTotal: number;
  mensagensNovas: number;
  clientesCadastrados: number;
}

