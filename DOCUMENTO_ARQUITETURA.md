Resumo
Visão proposta para o sistema de gestão de membros, comunicação, geração de negócios, acompanhamento e financeiro. Stack sugerida: Next.js (React + TypeScript) para frontend e API, Node.js/TypeScript, PostgreSQL com Prisma. Armazenamento de arquivos e mídias com Cloudinary (storage gerenciado). Autenticação administrativa simples para o escopo do teste (ADMIN_SECRET); em produção, usar OAuth/JWT.

1) Diagrama da Arquitetura
flowchart LR
  subgraph Frontend
    A["Next.js App (React + TS)"]
  end

  subgraph Backend
    B["Next.js API Routes / Node.js (TypeScript)"]
    C["Workers / Cron Jobs (background)"]
  end

  subgraph Infra
    D["Postgres (Prisma)"]
    E["Cloudinary (imagens, anexos)"]
    F["SMTP / Email Service"]
    G["Redis (cache, opcional)"]
  end

  A -->|HTTPS / REST| B
  B -->|Prisma Client| D
  B -->|Upload/Download| E
  B -->|Send e-mail| F
  B -->|Cache/Lock| G
  C -->|jobs: emails, faturas, relatórios| B
  C --> D


Observações

Next.js unifica frontend e backend (API routes / app router) e facilita deploy (Vercel, Railway, Render).

Workers executam envio de e-mails em lote, geração de faturas e relatórios periódicos.

Redis opcional para cache de dashboards e locks de jobs.

2) Modelo de Dados (Postgres + Prisma)

Justificativa do Banco
PostgreSQL é a escolha por ser relacional, forte em integridade referencial e consultas agregadas (dashboards, relatórios), o que atende bem a reuniões, indicações, pagamentos e histórico. Prisma facilita produtividade e tipagem TypeScript.



3) Estrutura de Componentes (Frontend — Next.js + TypeScript)
Organização de pastas (sugestão com app router)
/src
  /app
    /intencao
      page.tsx
      IntentionForm.tsx
    /convite
      /[token]
        page.tsx
        InviteRegistrationForm.tsx
    /admin
      page.tsx
      /intencoes
        IntentionList.tsx
        IntentionRow.tsx
      /notices
        NoticeList.tsx
        NoticeEditor.tsx
      /members
        MembersList.tsx
  /components
    Header.tsx
    Footer.tsx
    Button.tsx
    Input.tsx
    Table.tsx
    Modal.tsx
  /hooks
    useCurrentMember.ts
    useAdminAuth.ts
  /lib
    prisma.ts
    apiClient.ts
  /styles
  /utils

Estratégia de estado e reutilização

Componentes UI atômicos: Button, Input, Table para reutilização.

Estado local com useState para formulários/UX.

Cache e sincronização: React Query (ou SWR) para chamadas HTTP, revalidação automática (útil para admin lists).

Autenticação admin: validação server-side (getServerSideProps/middleware) usando ADMIN_SECRET (não enviar secret ao cliente).

Preview Markdown para avisos (client-side).

4) Definição da API — Endpoints principais (REST)

Formato JSON; admin-protected endpoints exigem header x-admin-secret: <ADMIN_SECRET> (documentar no README). Em produção, migrar para JWT/OAuth.

A) Gestão de Intenções (Fluxo obrigatório)

POST /api/intencoes

Descrição: criar intenção pública.

Body:

{ "nome": "string", "email": "string", "telefone": "string?", "mensagem": "string?" }


Response 201:

{ "id": "uuid", "status": "pending", "createdAt": "ISODate" }


GET /api/admin/intencoes?page=1&limit=20

Protegido por x-admin-secret.

Response 200:

{
  "data": [
    { "id": "uuid", "nome": "string", "email": "string", "status": "pending", "createdAt": "ISODate" }
  ],
  "meta": { "page": 1, "total": 42 }
}


POST /api/admin/intencoes/:id/approve

Protegido. Gera Invitation com token e expiresAt.

Body opcional: { "expiresInDays": 7 }

Response 200:

{ "invitationUrl": "https://seusite/convite/<token>", "token": "..." }


POST /api/admin/intencoes/:id/reject

Marca como rejected. Body opcional { "reason": "..." }. Response 200 com intenção atualizada.

GET /api/invites/:token

Valida token (exists, not used, not expired).

Response 200:

{ "token": "xxx", "intention": { "nome": "...", "email": "..." }, "expiresAt": "ISODate" }


POST /api/invites/complete

Completa cadastro do membro a partir do token. Body:

{ "token": "string", "nome": "string", "email": "string", "telefone": "string", "empresa": "string", "cargo": "string" }


Action: valid token -> criar member, marcar invitation.used = true, vincular se desejar.

Response 201: { "member": { "id":"uuid", "nome":"...", "email":"..." } }

B) Geração de Negócios (Indicações)

POST /api/referrals

Criar indicação. Body:

{ "referrerId": "uuid", "referee_name": "string", "referee_contact": "string", "description":"string", "value": 1000.00 }


Response 201: { "id":"uuid", "status":"new", "createdAt":"ISODate" }

GET /api/referrals/:id

Retorna detalhes + referral_updates.

Response 200: {"id":..., "status":..., "updates":[...], ...}

POST /api/referrals/:id/update

Adiciona etapa/status. Body:

{ "status": "in_progress", "note": "contato feito", "updated_by": "uuid" }


Response 200: { "updateId": "uuid" }

POST /api/referrals/:id/thank

Cria um thank_you_post quando negócio fechado. Body:

{ "author_id": "uuid", "message": "Obrigado fulano pela indicação!" }


Response 201: { "id":"uuid", "createdAt":"ISODate" }

C) Financeiro (Mensalidades)

POST /api/payments/generate (admin/cron)

Gera faturas para período. Body: { "periodStart": "YYYY-MM-DD", "periodEnd":"YYYY-MM-DD" }

Response 200: { "createdInvoices": [ { "id":"uuid", "member_id":"uuid", "amount":100 } ] }

GET /api/members/:id/payments

Lista pagamentos do membro.

Response 200: [ { "id":"uuid", "period_start":"2025-10-01", "amount":100, "status":"pending" } ]

POST /api/payments/:id/mark-paid

Marca pagamento como pago (webhook do gateway ou manual). Body: { "paidAt": "ISODate", "gatewayId": "..." }

Response 200: pagamento atualizado.

5) Fluxos importantes e decisões de design

Fluxo de admissão: intenção pública → admin aprova → invitation (token) → usuário preenche cadastro completo → member criado. Token tem expiração e used flag.

Avisos / comunicados: notices com visibilidade (public/members/admin) e suporte a Markdown + preview.

Presença/check-in: cada meeting tem participantes; check-in registra checkin_at e status. Usar QR code ou botão no front (mobile) para check-in.

Indicações: cada referral tem lifecycle com updates (logs) e possibilidade de criar public thank-you posts quando negócio for won.

Dashboards/Relatórios: endpoints agregadores (backend) que retornam métricas (reuniões realizadas, indicações, receita) por período; front gera gráficos (Chart.js / Recharts).

Pagamentos: geração de invoices por job/cron; integração opcional com gateway (Stripe, Pagar.me); aceitar webhooks para confirmação automática.

6) Segurança, escalabilidade e observabilidade

Autenticação / Autorização: admin via ADMIN_SECRET para o teste; em produção usar SSO / OAuth2 e RBAC. Members autenticados via JWT ou sessão.

Validação: server-side com zod (ou Joi) para validar e transformar payloads.

Rate limiting / anti-spam: aplicar em endpoints públicos (POST /api/intencoes).

Proteção de tokens: armazenar token com hashing é ideal; para simplicidade do teste token em texto é aceitável, porém documente o trade-off.

Escalabilidade: isolar jobs (workers), usar cache (Redis) para dashboards pesados, read-replicas para Postgres quando necessário.

Backups: backups diários do Postgres; usar migrations (Prisma Migrate).

7) Entregáveis mínimos e próximos passos (ordenados)

Validar este documento com o time / avaliador.

Gerar schema.prisma (baseado no modelo acima) e executar prisma migrate dev.

Implementar endpoints essenciais: POST /api/intencoes, GET /api/admin/intencoes, POST /api/admin/intencoes/:id/approve, GET /api/invites/:token, POST /api/invites/complete.

Implementar páginas Next.js: /intencao, /admin/intencoes (list + approve/reject), /convite/[token].

Adicionar testes básicos (integration) para o fluxo de admissão.

Implementar módulos extras (referrals, meetings, payments) conforme tempo.

Observação final

O documento acima cobre explicitamente: diagrama da arquitetura, modelo de dados com justificativa (Postgres), estrutura de componentes Next.js e especificação dos endpoints para pelo menos 3 funcionalidades (intencões, indicações, financeiro).