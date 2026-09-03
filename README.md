# RS Móveis Planejados em MDF | Plataforma Fullstack de Alto Padrão

Site institucional e plataforma de orçamentos, catálogo de projetos e painel administrativo para a empresa **RS Móveis Planejados em MDF**.

---

## 💎 Identidade Visual e Arquitetura

- **Estilo:** Luxury Modern (Preto Ônix, Dourado Metálico `#D4AF37`, Tipografia Playfair Display & Inter).
- **Conceito:** Marcenaria de alto padrão sob medida, 100% MDF de primeira linha, ferragens com amortecimento suave e iluminação integrada.
- **Marca:** Exclusivamente **RS Móveis Planejados em MDF**.

---

## 🚀 Funcionalidades Principais

1. **Hero de Alto Impacto**: Réplica fiel da identidade com logo dourado em relevo, 4 pilares de diferenciais, estatísticas flutuantes (+500 Projetos, +98% Satisfação, +10 Anos de Experiência) e CTA dinâmico.
2. **Galeria Interativa de Projetos**: Filtros por ambientes (*Cozinhas, Quartos, Closets, Salas, Home Office, Banheiros, Espaço Gourmet, Corporativo*), busca em tempo real, visualizador modal de alta resolução com especificações técnicas e materiais.
3. **Simulador e Formulário de Orçamento**: Cálculo de estimativa técnica e envio persistente com abertura automática do WhatsApp pré-formatado com os detalhes do cliente.
4. **Painel Administrativo Completo (`/admin`)**:
   - **Dashboard**: Indicadores de projetos, orçamentos e mensagens.
   - **Gestão de Projetos**: Criação, edição, exclusão, reordenação e controle de destaques.
   - **Gestão de Orçamentos**: Controle de pipeline (*Pendente, Em Contato, Em Análise, Concluído*) e botão direto para WhatsApp do cliente.
   - **Caixa de Mensagens & Clientes**: Histórico de interações.
5. **Botão Flutuante de WhatsApp**: Atendimento em 1-clique com mensagem contextual.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend:** Express API, Prisma ORM, Server-side routes.
- **Banco de Dados:** Neon PostgreSQL (com fallback e persistência local `data/db.json`).
- **Armazenamento:** Preparado para Vercel Blob.
- **Deploy:** Vercel / Cloud Run.

---

## ⚙️ Variáveis de Ambiente (`.env`)

Copie o arquivo `.env.example` para `.env`:

```env
# Conexão com o banco PostgreSQL no Neon
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Armazenamento de imagens no Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_sample"

# WhatsApp da empresa (DDI + DDD + Número sem espaços)
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999998888"

# URL do site em produção
NEXT_PUBLIC_SITE_URL="https://rsplanejados.vercel.app"

# Credenciais do Administrador
ADMIN_EMAIL="admin@rsplanejados.com.br"
ADMIN_PASSWORD="admin123"
```

---

## 📦 Como Rodar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento (porta 3000):**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   - Site Público: `http://localhost:3000`
   - Painel Administrativo: Clicar no botão **Admin** no cabeçalho ou rodapé (Login padrão: `admin@rsplanejados.com.br` / `admin123`).

---

## ☁️ Deploy na Vercel & Configuração do Neon

1. **Criar Banco de Dados no Neon:**
   - Acesse [neon.tech](https://neon.tech) e crie um novo projeto PostgreSQL.
   - Copie a `DATABASE_URL` (Connection String com Pooling).

2. **Executar Migrações do Prisma:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Deploy na Vercel:**
   - Importe o repositório no dashboard da Vercel.
   - Adicione as variáveis de ambiente descritas acima.
   - Execute o build (`npm run build`).
