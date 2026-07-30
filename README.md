# Finanças Familiares — Desafio Técnico TI

Sistema full-stack de controle financeiro familiar com **ASP.NET Core 10**, **PostgreSQL** e **React + TypeScript**.

---

## Arquitetura

```
desafio-tecnico-TI/
├── backend/          ← ASP.NET Core 10 Web API (C#)
│   ├── Controllers/  ← Roteamento HTTP (sem lógica de negócio)
│   ├── Services/     ← Regras de negócio (validação de idade, cascade, etc.)
│   ├── Models/       ← Entidades do banco (Pessoa, Transacao)
│   ├── DTOs/         ← Objetos de entrada e saída da API
│   └── Data/         ← AppDbContext + Migrations
└── frontend/         ← React 18 + TypeScript + Vite
    └── src/
        ├── types/    ← Interfaces TypeScript fortemente tipadas
        ├── services/ ← Chamadas HTTP (Axios)
        └── pages/    ← Pessoas, Transações, Dashboard
```

---

## Como Rodar

### Pré-requisitos
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [PostgreSQL](https://www.postgresql.org/download/) (porta 5432)
- [Node.js 18+](https://nodejs.org/)

---

### 1. Configurar o Banco de Dados

Certifique-se que o PostgreSQL está rodando. Edite `backend/appsettings.json` com suas credenciais:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=financas_db;Username=postgres;Password=SUA_SENHA"
  }
}
```

O banco `financas_db` será criado **automaticamente** na primeira execução (via `db.Database.Migrate()`).

---

### 2. Rodar o Backend

```bash
cd backend
dotnet restore
dotnet run
```

A API estará disponível em: **http://localhost:5000**  
Swagger UI em: **http://localhost:5000/swagger**

---

### 3. Rodar o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

---

## Endpoints da API

### Pessoas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/pessoas` | Lista todas as pessoas |
| `POST` | `/api/pessoas` | Cria uma nova pessoa |
| `DELETE` | `/api/pessoas/{id}` | Deleta pessoa + transações (cascade) |

### Transações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/transacoes` | Lista todas as transações |
| `POST` | `/api/transacoes` | Cria uma nova transação |

### Dashboard
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/dashboard` | Resumo financeiro por pessoa e total geral |

---

## Regras de Negócio

### Módulo de Pessoas
- **Criar**, **Listar** e **Deletar**
- **Cascade Delete**: ao deletar uma pessoa, todas as suas transações são removidas automaticamente

### Módulo de Transações
- **Criar** e **Listar** (sem editar ou deletar)
- A transação só é salva se o `PessoaId` existir no banco → retorna `404`
- **Menor de 18 anos + Receita** → bloqueado com `400` e mensagem explicativa

### Dashboard
- Total de Receitas por pessoa
- Total de Despesas por pessoa  
- Saldo individual (Receitas − Despesas)
- **Rodapé**: total geral de toda a residência

---

## Boas Práticas Implementadas

| Critério | Implementação |
|----------|---------------|
| **Separação de Responsabilidades** | Controllers → Services → DbContext |
| **Tipagem Forte (TypeScript)** | `interface Pessoa`, `interface Transacao`, `type TipoTransacao` — sem `any` |
| **Comentários e Documentação** | XML docs no C#, JSDoc nos serviços TS |
| **Cascade Delete** | `DeleteBehavior.Cascade` no EF Core |
| **Validação de Menor de Idade** | Aplicada no `TransacaoService` |
| **DTO Pattern** | Entidades separadas dos objetos de entrada/saída |
| **Design Premium** | Dark mode, glassmorphism, animações CSS |

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| API | ASP.NET Core 10 |
| ORM | Entity Framework Core 8 |
| Banco | PostgreSQL (Npgsql) |
| Docs | Swagger (Swashbuckle) |
| Frontend | React 18 + TypeScript |
| Bundler | Vite |
| HTTP Client | Axios |
| Estilo | CSS Vanilla (design system próprio) |
