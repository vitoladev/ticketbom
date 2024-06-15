# Ticketbom
Desenvolvi uma PoC de um sistema de gerenciamento de eventos e venda de ingressos focado em festas.

Foram utilizadas as seguintes tecnologias:
- API
    -- Nest.js
    -- Drizzle ORM (PostgreSQL)
    -- AWS Cognito (Autenticação)
    -- AWS Lambda
    -- AWS API Gateway
    -- Swagger (Documentação)
    -- class-validator (Validação de dados)
    -- Mercado Pago (Gateway de Pagamentos)
    -- Jest (Testes de integração)
- Frontend
    -- Next.js
    -- ShadCN UI
    -- TailwindCSS
    -- NextAuth
    -- React Hook Form (Validação de dados)
    -- React Query

Backlog de funcionalidades:
- [ ] Cadastrar eventos com mídias usando S3
- [ ] Autenticação das rotas do backend com Cognito
- [ ] Webhooks de atualização do status de pagamento com MercadoPago

## Como executar
```bash
docker compose up -d
npm run db:migrate

# Frontend
npm run start:frontend

# Backend/API
npm run start:api
```