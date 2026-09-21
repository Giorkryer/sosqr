# SOSqr — Ficha Médica de Emergência

Plataforma para gestão e visualização imediata de dados vitais e contatos de emergência via QR Code em cartão físico para qualquer indivíduo.

---

## 🚀 Visão Geral

O **SOSqr** conecta cuidadores, familiares e indivíduos a um sistema ágil de resposta em emergências médicas:
- **Ficha Pública de Emergência Mobile-First**: Acesso instantâneo e sem barreiras de autenticação a dados vitais (tipo sanguíneo, alergias severas, medicamentos de alto risco, condições crônicas e contatos de socorro para discagem direta com 1 toque).
- **Cartão Físico no Padrão Oficial CR80**: Emissão e exportação em PDF vetorial de alta definição (300 DPI) para impressão gráfica em PVC ou papel plastificado com QR Code direto.
- **Isolamento e Conformidade com a LGPD**: Dados sensíveis civis (CPF, RG, CNS e notas privadas) permanecem 100% protegidos e restritos ao usuário autenticado, expondo na ficha pública estritamente os dados essenciais para o socorro médico (Art. 7º, VII e Art. 11, II, "f" da Lei nº 13.709/2018).
- **Auditoria de Escaneamentos em Tempo Real**: Registro de endereço IP, dispositivo (User-Agent) e timestamp a cada leitura do QR Code (`scan_logs`).

---

## 🛠️ Stack Tecnológica

- **Front-end**: React 18+ (compatível com 19), TypeScript, Vite, Tailwind CSS, `@clerk/clerk-react`, `qrcode.react`, `@react-pdf/renderer` e `lucide-react`.
- **Back-end**: Ruby on Rails 8 (Modo API), Ruby 3.3, PostgreSQL 16+ com extensão `pgcrypto` (UUID v4 nativo), Puma.
- **Autenticação**: Clerk Auth com validação assimétrica de tokens JWT (RS256).
- **Testes Automatizados**: Vitest + React Testing Library (Front-end) e RSpec + FactoryBot (Back-end).

---

## 📖 Documentação Técnica Completa

Para especificações arquiteturais detalhadas, contratos de endpoints, modelagem de dados e guia do Design System ("Cuidado Suave"):
- [**`BACKEND_SPEC.md`**](./backend/sosqr-api/BACKEND_SPEC.md): Especificação técnica da API Rails 8, controllers, schema PostgreSQL, telemetria e módulo administrativo planejado.
- [**`FRONTEND_SPEC.md`**](./frontend/sosqr-web/FRONTEND_SPEC.md): Especificação técnica da aplicação React/Vite, mapa de rotas, paleta de cores, acessibilidade WCAG AAA e emissão de cartões CR80.

---

## 💻 Executando o Projeto Localmente

### Pré-requisitos
- Node.js 18+ e npm
- Docker e Docker Compose (opcional para rodar stack completa)
- Ruby 3.3+ e PostgreSQL (caso execute o backend localmente)

### Com Docker Compose
```bash
docker-compose up --build
```
- Front-end disponível em: `http://localhost:5173`
- Back-end API disponível em: `http://localhost:3000`

### Front-end Manualmente
```bash
cd frontend/sosqr-web
npm install
npm run dev
npm test
```

### Back-end Manualmente
```bash
cd backend/sosqr-api
bundle install
bin/rails db:prepare
bin/rails server
```
