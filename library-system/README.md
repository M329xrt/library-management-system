# Library Management System — API

A backend project built with **NestJS**, **Prisma ORM**, and **PostgreSQL**. The Prisma data layer models library users, books, and genres, and includes migrations and sample data.

## Project structure

```text
library-system/
├── api/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── prisma/
│   │       └── prisma.service.ts
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── prisma.config.ts
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Requirements

- Node.js (LTS recommended)
- npm
- PostgreSQL database (local PostgreSQL or a hosted provider such as Neon)

## Setup

Run the following commands from the `api` directory:

```bash
cd api
npm install
```

Create your environment file by copying `.env.example` to `.env`, then replace the example connection string with your own PostgreSQL connection string:

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

Do not commit `.env` or share your database password. The `.env.example` file is safe to commit because it contains placeholders only.

Generate the Prisma Client and apply the committed migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Insert the sample records:

```bash
npx prisma db seed
```

The seed script is safe to run more than once. It uses `upsert` and creates **4 genres and 15 books** without duplicating records.

## Run the API

From the `api` directory:

```bash
npm run start:dev
```

The NestJS server listens on `http://localhost:3000` by default. The root route (`GET /`) returns a basic health message.

## Prisma commands

Run these from `api`:

| Command | Purpose |
|---|---|
| `npm run prisma:generate` | Generate Prisma Client from the schema |
| `npm run prisma:migrate` | Create and apply a development migration |
| `npm run prisma:status` | Check migration status |
| `npm run prisma:seed` | Insert the sample genres and books |
| `npm run db:setup` | Generate client, deploy migrations, and seed data |

## Database schema decisions

The database contains three main models: `User`, `Genre`, and `Book`.

- **User** stores a person's name, unique email address, role, and creation date.
- **Role** is an enum with `PATRON` and `LIBRARIAN`. New users default to `PATRON`.
- **Genre** stores each genre once. Its `name` is unique, and it can be related to many books.
- **Book** stores the title, author, unique ISBN, optional publication date, availability, and `genreId`.

### Relationship: Genre and Book

One genre can have many books, while each book belongs to one genre. This is a one-to-many relationship. The `genreId` field in `Book` is a foreign key that references `Genre.id`.

Keeping genres in a separate table avoids repeating genre names in every book record. If a genre name changes, it only needs to be updated once. The foreign key also helps prevent a book from referring to a genre that does not exist.

### Constraints and defaults

- `User.email`, `Genre.name`, and `Book.isbn` are unique.
- `User.role` defaults to `PATRON`.
- `User.createdAt` defaults to the current timestamp.
- `Book.available` defaults to `true`.
- `Book.publishedAt` is optional because a publication date may not be known.

## Migrations

The SQL migration history is committed in `api/prisma/migrations`. Use `prisma migrate deploy` to apply these migrations to a deployment database. Do not delete migration folders after they have been applied to a shared database.
