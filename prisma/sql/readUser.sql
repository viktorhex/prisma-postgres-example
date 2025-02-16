-- read_user.sql
-- Parameters:
-- $1: email (TEXT, required)

SELECT
  u.id, u.email, u."createdAt", u."updatedAt",
  t.id AS plaid_id, t."userId", t."accessToken", t."itemId",
  t."createdAt" AS token_createdAt, t."updatedAt" AS token_updatedAt
FROM "User" u
LEFT JOIN "PlaidToken" t ON u.id::TEXT = t."userId"
WHERE u.email = $1::TEXT;