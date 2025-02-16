-- create_user.sql
-- Parameters:
-- $1: email (TEXT, required)
-- $2: access_token (TEXT, optional)
-- $3: item_id (TEXT, optional)

WITH new_user AS (
  INSERT INTO "User" (id, email, "createdAt", "updatedAt")
  VALUES (uuid_generate_v4(), $1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  RETURNING id, email, "createdAt", "updatedAt"
),
new_token AS (
  INSERT INTO "PlaidToken" (id, "userId", "accessToken", "itemId", "createdAt", "updatedAt")
  SELECT uuid_generate_v4(), new_user.id, $2::TEXT, $3::TEXT, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM new_user
  WHERE $2::TEXT IS NOT NULL AND $3::TEXT IS NOT NULL
  RETURNING id, "userId", "accessToken", "itemId", "createdAt", "updatedAt"
)
SELECT
  u.id, u.email, u."createdAt", u."updatedAt",
  t.id AS plaid_id, t."userId", t."accessToken", t."itemId",
  t."createdAt" AS token_createdAt, t."updatedAt" AS token_updatedAt
FROM new_user u
LEFT JOIN new_token t ON u.id = t."userId";
