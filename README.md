```
    "db:migrate": "rm -rf prisma/migrations && npx prisma migrate reset -f && npx prisma generate && npx prisma migrate dev --name init",
    "db:sql": "npx prisma generate --sql",
    "db:seed": "node --import tsx prisma/seeds/seed.ts",
    "db:backup": "sqlite3 prisma/database/example.db .dump > prisma/database/backup.sql",
    "db:restore": "rm prisma/database/example.db && sqlite3 prisma/database/example.db < prisma/database/backup.sql",
    "db:studio": "npx prisma studio"
```