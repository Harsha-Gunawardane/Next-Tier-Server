const assert = require("assert");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { handleNewUser } = require("../../controllers/auth/registerController");

describe("handleNewUser", () => {
  // Run this before each test case
  beforeEach(() => {
    // Clear the users table before each test
    return prisma.users.deleteMany();
  });

  it("should register a new user", async () => {
    const req = {
      body: {
        user: "testuser",
        pwd: "Password123",
      },
    };

    const res = {
      status: (statusCode) => {
        assert.strictEqual(statusCode, 201);
        return res;
      },
      json: (response) => {
        assert.strictEqual(response.success, "New user testuser registered");
      },
    };

    await handleNewUser(req, res);

    const user = await prisma.users.findUnique({
      where: {
        username: "testuser",
      },
    });

    assert.ok(user);
  });

  it("should return an error if username is already taken", async () => {
    // Create a user with the same username
    await prisma.users.create({
      data: {
        username: "existinguser",
        roles: JSON.stringify({ User: 2001 }),
        password: await bcrypt.hash("Password123", 10),
      },
    });

    const req = {
      body: {
        user: "existinguser",
        pwd: "Password123",
      },
    };

    const res = {
      sendStatus: (statusCode) => {
        assert.strictEqual(statusCode, 409);
      },
    };

    await handleNewUser(req, res);
  });

  it("should return an error if input form data is invalid", async () => {
    const req = {
      body: {
        user: "test",
        pwd: "invalid",
      },
    };

    const res = {
      status: (statusCode) => {
        assert.strictEqual(statusCode, 400);
        return res;
      },
      json: (response) => {
        assert.strictEqual(
          response.error,
          "Password should contain at least one lowercase letter, one uppercase letter, and one digit"
        );
      },
    };

    await handleNewUser(req, res);
  });

  // Add more test cases as needed

  // Run this after all test cases have finished
  after(() => {
    // Close the Prisma client connection
    return prisma.$disconnect();
  });
});
