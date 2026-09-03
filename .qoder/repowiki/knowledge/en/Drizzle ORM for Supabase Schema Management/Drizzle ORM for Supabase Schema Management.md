---
kind: external_dependency
name: Drizzle ORM for Supabase Schema Management
slug: drizzle-orm
category: external_dependency
category_hints:
    - migration_status
scope:
    - '**'
---

Drizzle ORM (`drizzle-orm`) and its CLI (`drizzle-kit`) are used to define and migrate the Supabase Postgres schema declared in `supabase/schema.sql`. The `scripts/ingest-textbooks.ts` script uses Drizzle to load textbook chapters into the database. Migration commands referenced in the README are `npx drizzle-kit generate` and `npx drizzle-kit migrate`.