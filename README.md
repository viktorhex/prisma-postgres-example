People sometimes criticize ORMs when they're trying to optimize SQL queries. They have to know SQL and then learn how to write the query again in ORM language.
The approach demonstrated in this repo reduces the need to relearn SQL in the ORM language.
- database access are written in raw `.sql` files
- typescript methods are generated based on those `.sql` files

```
// generate migrations from model
    "db:migrate": "rm -rf prisma/migrations && npx prisma migrate reset -f && npx prisma generate && npx prisma migrate dev --name init",

// generate typescript methods for .sql files
    "db:sql": "npx prisma generate --sql",

// view database in GUI
    "db:studio": "npx prisma studio"
```