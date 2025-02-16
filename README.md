```
// generate migrations from model
    "db:migrate": "rm -rf prisma/migrations && npx prisma migrate reset -f && npx prisma generate && npx prisma migrate dev --name init",

// generate typescript methods for .sql files
    "db:sql": "npx prisma generate --sql",

// view database in GUI
    "db:studio": "npx prisma studio"
```