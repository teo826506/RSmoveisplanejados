import { Projeto, Cliente, Orcamento, Mensagem, VideoItem, SiteSettings } from '../types';
import dbJson from '../../data/db.json';

export const DEFAULT_WHATSAPP_NUMBER = dbJson.settings?.whatsappNumero || '5511999998888';

export const INITIAL_SETTINGS: SiteSettings = (dbJson.settings as SiteSettings) || {
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
  logoUrl: '',
  adminEmail: 'admin@rsplanejados.com.br',
  adminPassword: 'admin',
  updatedAt: new Date().toISOString()
};

export const INITIAL_PROJECTS: Projeto[] = (dbJson.projects as Projeto[]) || [];
export const INITIAL_CLIENTS: Cliente[] = (dbJson.clients as Cliente[]) || [];
export const INITIAL_BUDGETS: Orcamento[] = (dbJson.budgets as Orcamento[]) || [];
export const INITIAL_MESSAGES: Mensagem[] = (dbJson.messages as Mensagem[]) || [];
export const INITIAL_VIDEOS: VideoItem[] = (dbJson.videos as VideoItem[]) || [];
export const INITIAL_GALLERY: string[] = (dbJson.gallery as string[]) || [];
