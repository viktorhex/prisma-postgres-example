psql -h localhost -U postgres

CREATE DATABASE myapp;

CREATE USER myappuser WITH PASSWORD 'PASS_GOOD';

GRANT ALL PRIVILEGES ON DATABASE myapp TO myappuser;

\c myapp
GRANT ALL ON SCHEMA public TO myappuser;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\q

pnpm run db:migrate

