```
    "db:migrate": "rm -rf prisma/migrations && npx prisma migrate reset -f && npx prisma generate && npx prisma migrate dev --name init",
    "db:sql": "npx prisma generate --sql",
    "db:studio": "npx prisma studio"
```