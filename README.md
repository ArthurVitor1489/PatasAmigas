# Plataforma ONG Patas Amigas (Full-Stack Next.js 15 & Supabase)

Esta é a plataforma completa da **ONG Patas Amigas**, desenvolvida com tecnologias de ponta para atender a todos os requisitos de gestão de adoções, recebimento de doações, apadrinhamento de animais e e-commerce pet solidário com controle administrativo total.

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS v4, Lucide Icons, Framer Motion.
- **Backend/Database:** Supabase, PostgreSQL.
- **Integração de Pagamentos:** Mercado Pago SDK (PIX QR Code, Boleto e Checkout Transparente de Cartão).
- **Hospedagem Recomendada:** Vercel.

---

## 🚀 Como Iniciar o Projeto Localmente

### 1. Clonar ou Acessar a Pasta do Projeto
Abra a pasta do projeto no seu editor de código (como VS Code):
```bash
cd ong-patas-fullstack
```

### 2. Instalar as Dependências
Execute o comando abaixo para instalar as bibliotecas necessárias:
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto e configure as credenciais do Supabase e do Mercado Pago:
```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_mercado_pago
```
> **Nota de Fallback:** Se as variáveis de ambiente do Supabase não forem configuradas, o sistema **ativará automaticamente o modo de simulação via LocalStorage**, permitindo rodar a aplicação com dados realistas pré-cadastrados imediatamente.

### 4. Rodar o Servidor de Desenvolvimento
Inicie o servidor localmente:
```bash
npm run dev
```
Abra o navegador e acesse: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

Fornecemos o script de criação do banco de dados pronto para produção em:
👉 [supabase/schema.sql](file:///C:/Users/arthu/.gemini/antigravity/scratch/ong-patas-fullstack/supabase/schema.sql)

### Como Configurar no Supabase:
1. Crie um projeto gratuito no [Supabase](https://supabase.com/).
2. No painel do seu projeto, acesse a aba **SQL Editor**.
3. Crie uma nova query, copie o conteúdo de `supabase/schema.sql` e execute-o.
4. Isso criará todas as tabelas (users, products, orders, animals, donations, etc.), configurará os triggers de controle de estoque automático e as regras de segurança RLS (Row Level Security).

---

## ⚙️ Acesso Administrativo e Testes

Para testar todos os fluxos de ponta a ponta sem cadastrar credenciais complexas:
1. Vá até a **Área do Cliente** (`/cliente`).
2. Clique no atalho **Acesso Rápido de Testes** ou insira o e-mail:
   - **Administrador:** `admin@patas.org` (Senha livre)
   - **Cliente:** qualquer outro e-mail válido.
3. Como **Administrador**, você poderá acessar o **Painel Admin** (`/admin`) para:
   - Cadastrar, editar ou remover produtos da Loja (e vê-los aparecer em `/loja` instantaneamente).
   - Cadastrar animais (e vê-los no catálogo `/adocao`).
   - Aprovar ou rejeitar solicitações de adoção recebidas (o status do animal mudará automaticamente para "Adotado" quando aprovado!).
   - Ver relatórios financeiros dinâmicos e histórico de doações.

---

## 🛡️ Segurança e LGPD

- **Segurança (Supabase Auth):** Implementa tokens JWT e controle RLS no PostgreSQL garantindo privacidade.
- **LGPD:** A etapa final de checkout exige o consentimento explícito do usuário sobre a guarda e tratamento de dados de contato e endereço para faturamento e envio física do produto.
