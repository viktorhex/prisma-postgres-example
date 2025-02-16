import { afterAll, beforeAll, test, expect, beforeEach, afterEach } from "vitest";
import { createUser, readUser, deleteUser } from "@prisma/client/sql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up the database before each test
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
});

afterEach(async () => {
  // Clean up after each test
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
});

test("createUser creates a user without a Plaid token", async () => {
  const email = "test@example.com";
  const accessToken = "access-token-123";
  const itemId = "item-123";
  const result = await prisma.$queryRawTyped(createUser(email, accessToken, itemId));

  expect(result).toHaveLength(1);
  const user = result[0];
  expect(user.email).toBe(email);
  expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  expect(user.plaid_id).exist
});

test("createUser creates a user with a Plaid token", async () => {
  const email = "test@example.com";
  const accessToken = "access-token-123";
  const itemId = "item-123";
  const result = await prisma.$queryRawTyped(createUser(email, accessToken, itemId));

  expect(result).toHaveLength(1);
  const user = result[0];
  expect(user.email).toBe(email);
  expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  expect(user.plaid_id).not.toBeNull();
  expect(user.accessToken).toBe(accessToken);
  expect(user.itemId).toBe(itemId);
});

test("readUser retrieves a user by email", async () => {
  const email = "test@example.com";
  const accessToken = "access-token-123";
  const itemId = "item-123";
  await prisma.$queryRawTyped(createUser(email, accessToken, itemId));

  const readResult = await prisma.$queryRawTyped(readUser(email));
  expect(readResult).toHaveLength(1);
  const user = readResult[0];
  expect(user.email).toBe(email);
  expect(user.plaid_id).exist;
});

test("readUser retrieves a user with Plaid token by email", async () => {
  const email = "test@example.com";
  const accessToken = "access-token-123";
  const itemId = "item-123";
  await prisma.$queryRawTyped(createUser(email, accessToken, itemId));

  const readResult = await prisma.$queryRawTyped(readUser(email));
  expect(readResult).toHaveLength(1);
  const user = readResult[0];
  expect(user.email).toBe(email);
  expect(user.plaid_id).not.toBeNull();
  expect(user.accessToken).toBe(accessToken);
  expect(user.itemId).toBe(itemId);
});

test("readUser returns no results for non-existent email", async () => {
  const readResult = await prisma.$queryRawTyped(readUser("non-existent@example.com"));
  expect(readResult).toHaveLength(0);
});

test("deleteUser deletes a user and their Plaid token", async () => {
  const email = "test@example.com";
  const accessToken = "access-token-123";
  const itemId = "item-123";
  const createResult = await prisma.$queryRawTyped(createUser(email, accessToken, itemId));
  const userId = createResult[0].id;
  const plaid_id = createResult[0].plaid_id;

  const deleteResult = await prisma.$queryRawTyped(deleteUser(userId));
  expect(deleteResult).toHaveLength(1);
  const deletedUser = deleteResult[0];
  expect(deletedUser.id).toBe(userId);
  expect(deletedUser.email).toBe(email);
  expect(deletedUser.plaid_id).toBe(plaid_id)
  expect(deletedUser.accessToken).toBe(accessToken);
  expect(deletedUser.itemId).toBe(itemId);

  // Verify the user and Plaid token are deleted
  const readResult = await prisma.$queryRawTyped(readUser(email));
  expect(readResult).toHaveLength(0);
});

test("deleteUser handles non-existent user gracefully", async () => {
  const deleteResult = await prisma.$queryRawTyped(deleteUser("non-existent-id"));
  expect(deleteResult).toHaveLength(0);
});