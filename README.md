# Sistema de Gerenciamento de Tarefas Stoix

Um sistema completo de gerenciamento de tarefas desenvolvido com **Next.js 15**, **TypeScript**, **React** e **Tailwind CSS**, implementando autenticação com tokens CSRF, APIs RESTful e interface moderna e responsiva.

## 🚀 Funcionalidades

### Backend
- ✅ **APIs RESTful** completas para operações CRUD de tarefas
- ✅ **Autenticação** com tokens de sessão e proteção CSRF
- ✅ **Middleware de segurança** para validação de tokens
- ✅ **Controle de acesso** por usuário
- ✅ **Validação de dados** robusta
- ✅ **Tratamento de erros** abrangente

### Frontend
- ✅ **Interface responsiva** com componentes React modernos
- ✅ **Dashboard interativo** com estatísticas em tempo real
- ✅ **Sistema de filtros** e busca avançada
- ✅ **Formulários dinâmicos** para criar/editar tarefas
- ✅ **Indicadores visuais** de status e prioridade
- ✅ **Autenticação integrada** com logout automático

### Segurança
- ✅ **Tokens CSRF** com validação automática e renovação
- ✅ **Autenticação Bearer** para APIs
- ✅ **Middleware de proteção** em todas as rotas
- ✅ **Validação de propriedade** de recursos por usuário
- ✅ **Sessões com expiração** automática

## 🛠️ Tecnologias Utilizadas

### Core
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React 19** - Biblioteca de interface
- **Tailwind CSS v4** - Framework de estilos

### UI/UX
- **shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones modernos
- **Radix UI** - Componentes acessíveis
- **Geist Font** - Tipografia

### Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **TypeScript Config** - Configuração de tipos

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Passo a passo

1. **Clone o repositório**
\`\`\`bash
git clone https://github.com/stoix/task-management-system.git
cd task-management-system
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. **Execute o projeto em desenvolvimento**
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

4. **Acesse o sistema**
\`\`\`
http://localhost:3000
\`\`\`

## 👥 Credenciais de Acesso

O sistema possui as seguintes credenciais para demonstração:

### Usuário Administrador (Recomendado)
- **Email:** `admin@stoix.com`
- **Senha:** `admin123`
- **Descrição:** Usuário principal com acesso completo

### Usuário Demo
- **Email:** `demo@example.com`
- **Senha:** `qualquer senha` (aceita qualquer senha para demo)
- **Descrição:** Usuário de demonstração com tarefas de exemplo

### Usuário de Teste
- **Email:** `test@example.com`
- **Senha:** `qualquer senha`
- **Descrição:** Usuário para testes com tarefas específicas

### Criando Novos Usuários
Para criar um novo usuário, simplesmente:
1. Acesse a tela de login
2. Digite qualquer email válido
3. Digite qualquer senha
4. O sistema criará automaticamente o usuário

## 🔧 Estrutura do Projeto

\`\`\`
stoix-task-manager/
├── app/                          # App Router do Next.js
│   ├── api/                      # Rotas de API
│   │   ├── csrf/                 # Endpoint para tokens CSRF
│   │   └── tasks/                # APIs de tarefas
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial
├── components/                   # Componentes React
│   ├── auth/                     # Componentes de autenticação
│   ├── providers/                # Providers React
│   ├── tasks/                    # Componentes de tarefas
│   └── ui/                       # Componentes de interface
├── hooks/                        # Hooks personalizados
├── lib/                          # Utilitários e configurações
│   ├── api-client.ts             # Cliente para APIs
│   ├── auth.ts                   # Serviços de autenticação
│   ├── database.ts               # Camada de dados mock
│   ├── storage.ts                # Utilitários de localStorage
│   ├── types.ts                  # Definições de tipos
│   └── utils.ts                  # Utilitários gerais
├── middleware.ts                 # Middleware do Next.js
├── public/                       # Arquivos estáticos
│   └── images/                   # Imagens e assets
└── README.md                     # Este arquivo
\`\`\`

## 🔌 APIs Disponíveis

### Autenticação
\`\`\`http
POST /api/csrf
# Gera novo token CSRF
\`\`\`

### Tarefas
\`\`\`http
GET /api/tasks
# Lista todas as tarefas do usuário autenticado

POST /api/tasks
# Cria nova tarefa
Content-Type: application/json
Authorization: Bearer {token}
X-CSRF-Token: {csrf-token}

PUT /api/tasks/{id}
# Atualiza tarefa existente
Content-Type: application/json
Authorization: Bearer {token}
X-CSRF-Token: {csrf-token}

DELETE /api/tasks/{id}
# Remove tarefa
Authorization: Bearer {token}
X-CSRF-Token: {csrf-token}
\`\`\`

### Exemplo de Payload
\`\`\`json
{
  "title": "Nova Tarefa",
  "description": "Descrição da tarefa",
  "status": "pending",
  "priority": "medium"
}
\`\`\`

## 🎯 Como Usar o Sistema

### 1. Login
- Acesse `http://localhost:3000`
- Use as credenciais: `admin@stoix.com` / `admin123`
- Ou use um dos outros usuários de teste
- O sistema fará login automaticamente

### 2. Gerenciar Tarefas
- **Criar:** Clique em "Nova Tarefa" e preencha o formulário
- **Visualizar:** Veja todas as tarefas na lista principal
- **Filtrar:** Use os filtros por status e prioridade
- **Buscar:** Digite no campo de busca para encontrar tarefas
- **Editar:** Clique no ícone de edição em qualquer tarefa
- **Excluir:** Clique no ícone de lixeira para remover

### 3. Dashboard
- Veja estatísticas em tempo real
- Monitore progresso das tarefas
- Acompanhe distribuição por status e prioridade

## 🔒 Segurança Implementada

### Tokens CSRF
- Geração automática de tokens únicos
- Validação em todas as operações de modificação
- Renovação automática de tokens expirados
- Limpeza de tokens antigos

### Autenticação
- Tokens de sessão com expiração
- Validação de propriedade de recursos
- Logout automático em caso de token inválido
- Proteção contra acesso não autorizado

### Middleware
- Validação de tokens em rotas protegidas
- Verificação de headers CSRF
- Tratamento de erros de autenticação
- Logs de segurança

## 🧪 Testes e Desenvolvimento

### Scripts Disponíveis
\`\`\`bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm run start

# Linting
npm run lint
\`\`\`

### Estrutura de Dados
O sistema utiliza localStorage para persistência (demo), mas está preparado para integração com bancos de dados reais:

\`\`\`typescript
interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
  userId: string
}

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}
\`\`\`

## 🚀 Deploy

### Netlify
\`\`\`bash
# Build do projeto
npm run build

# Deploy manual ou conecte o repositório
\`\`\`

### Railway
\`\`\`bash
# Conecte o repositório no Railway
# Configure as variáveis de ambiente se necessário
\`\`\`

### Outros Provedores
O projeto é compatível com qualquer provedor que suporte Next.js:
- AWS Amplify
- Heroku
- DigitalOcean App Platform

## 🔄 Próximos Passos

### Melhorias Planejadas
- [ ] Integração com banco de dados real (PostgreSQL/MongoDB)
- [ ] Sistema de notificações
- [ ] Colaboração em tarefas
- [ ] Anexos de arquivos
- [ ] Relatórios avançados
- [ ] API de webhooks
- [ ] Aplicativo mobile

### Integrações Possíveis
- [ ] Supabase para banco de dados
- [ ] Auth0 para autenticação avançada
- [ ] SendGrid para emails
- [ ] Cloudinary para uploads
- [ ] Stripe para pagamentos

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma [issue](https://github.com/stoix/task-management-system/issues)
- Entre em contato: contato@stoix.com

## 🏆 Créditos

Desenvolvido pela equipe **Stoix** com ❤️ usando as melhores práticas de desenvolvimento web moderno.

---

**Sistema de Gerenciamento de Tarefas Stoix** - Demonstrando excelência em TypeScript, React, Next.js, APIs RESTful, autenticação e segurança web.
