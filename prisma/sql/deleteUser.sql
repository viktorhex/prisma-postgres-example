-- delete_user.sql
-- Parameters:
-- $1: user_id (UUID, required)

WITH deleted_user AS (
  -- Delete the user and return their details (cascades to delete Plaid token)
  DELETE FROM "User"
  WHERE id = $1::TEXT
  RETURNING id, email, "createdAt", "updatedAt"
),
deleted_token AS (
  -- Select the Plaid token that was deleted (via CASCADE)
  SELECT id, "userId", "accessToken", "itemId", "createdAt", "updatedAt"
  FROM "PlaidToken"
  WHERE "userId" = $1::TEXT
)
SELECT
  u.id, u.email, u."createdAt", u."updatedAt",
  t.id AS plaid_id, t."userId", t."accessToken", t."itemId",
  t."createdAt" AS token_createdAt, t."updatedAt" AS token_updatedAt
FROM deleted_user u
LEFT JOIN deleted_token t ON u.id::TEXT = t."userId";
