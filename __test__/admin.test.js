const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const Hash = require("../helpers/bcrypt");

let user1 = {
  name: "Test User 1",
  email: "testuser1@mail.com",
  password: "password",
};

let userLogin = {
  email: "testuser1@mail.com",
  password: "password",
};

let access_token = "";

beforeAll(async () => {
  await sequelize.queryInterface.bulkDelete(
    "Admins",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
  try {
    // seed users
    await sequelize.queryInterface.bulkInsert(
      "Users",
      require("../db/user.json").map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        el.password = Hash.create(el.password);
        return el;
      })
    );
    // seed vehicles
    await sequelize.queryInterface.bulkInsert(
      "Vehicles",
      require("../db/vehicle.json").map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      })
    );
    // seed rides
    await sequelize.queryInterface.bulkInsert(
      "Rides",
      require("../db/ride.json").map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      })
    );
    // seed userRides
    await sequelize.queryInterface.bulkInsert(
      "UserRides",
      require("../db/userRide.json").map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      })
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete(
    "Admins",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
  await sequelize.queryInterface.bulkDelete(
    "UserRides",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
  await sequelize.queryInterface.bulkDelete(
    "Vehicles",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
  await sequelize.queryInterface.bulkDelete(
    "Admins",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
  await sequelize.queryInterface.bulkDelete(
    "Users",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
});

describe("POST /admin/register", () => {
  describe("POST /admin/register success", () => {
    it("should response with status 201 and return success message", async () => {
      const response = await request(app).post("/admin/register").send(user1);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body.message).toBe(
        "Admin Test User 1 has succesfully registered"
      );
    });
  });

  describe("POST /admin/register fail", () => {
    it("should response with status 400 and return error message if email is null", async () => {
      const response = await request(app)
        .post("/admin/register")
        .send({ ...user1, email: null });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });

    it("should response with status 400 and return error message if password is null", async () => {
      const response = await request(app)
        .post("/admin/register")
        .send({ ...user1, password: null });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password is required");
    });

    it("should response with status 400 and return error message if name is null", async () => {
      const response = await request(app)
        .post("/admin/register")
        .send({ ...user1, name: null });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Name is required");
    });

    it("should response with status 400 and return error message if email is empty string", async () => {
      const response = await request(app)
        .post("/admin/register")
        .send({ ...user1, email: "" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });

    it("should response with status 400 and return error message if password is empty string", async () => {
      const response = await request(app)
        .post("/admin/register")
        .send({ ...user1, password: "" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Password must be at least 8 characters"
      );
    });

    it("should response with status 400 and return error message if name is empty string", async () => {
      const response = await request(app)
        .post("/admin/register")
        .send({ ...user1, name: "" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Name is required");
    });

    it("should response with status 400 and return error message if email is registered", async () => {
      const response = await request(app).post("/admin/register").send(user1);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email must be unique");
    });

    it("should response with status 400 and return error message if email format is invalid", async () => {
      const response = await request(app)
        .post("/admin/register")
        .send({ ...user1, email: "test@test" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid email format");
    });
  });
});

describe("POST /admin/login", () => {
  describe("POST /admin/login success", () => {
    it("should response with status 200 and access token if login is success", async () => {
      const response = await request(app).post("/admin/login").send(userLogin);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      access_token = response.body.access_token;
    });
  });

  describe("POST /admin/login fail", () => {
    it("should response with status 400 and error message if email is not given", async () => {
      const response = await request(app)
        .post("/admin/login")
        .send({ ...userLogin, email: null });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });

    it("should response with status 400 and error message if password is not given", async () => {
      const response = await request(app)
        .post("/admin/login")
        .send({ ...userLogin, password: null });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password is required");
    });

    it("should response with status 401 and error message if wrong password is given", async () => {
      const response = await request(app)
        .post("/admin/login")
        .send({ ...userLogin, password: "wrongpassword" });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email / Password is wrong");
    });

    it("should response with status 401 and error message if unregistered email is given", async () => {
      const response = await request(app)
        .post("/admin/login")
        .send({ ...userLogin, email: "unregisteredemail@mail.com" });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email / Password is wrong");
    });
  });
});

describe("GET /admin/users", () => {
  describe("GET /admin/users success", () => {
    it("should response with status 200 and array of users", async () => {
      const { status, body } = await request(app)
        .get("/admin/users")
        .set({ access_token: access_token });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body[0]).toHaveProperty("id", expect.any(Number));
      expect(body[0]).toHaveProperty("name", expect.any(String));
      expect(body[0]).toHaveProperty("email", expect.any(String));
      expect(body[0]).toHaveProperty("phoneNumber", expect.any(String));
      expect(body[0]).toHaveProperty("photo", expect.any(String));
      expect(body[0]).toHaveProperty("idCardImg", expect.any(String));
      expect(body[0]).toHaveProperty("rating", expect.any(Number));
      expect(body[0]).toHaveProperty("status", expect.any(String));
    });
  });

  describe("GET /admin/users fail", () => {
    it("should response with status 400 and error message if access token is not given", async () => {
      const { status, body } = await request(app).get("/admin/users");
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Access Token Missing");
    });

    it("should response with status 403 and error message if access token is invalid", async () => {
      const { status, body } = await request(app)
        .get("/admin/users")
        .set({ access_token: "wrongaccesstoken" });
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Forbidden");
    });
  });
});

describe("GET /admin/users/:id", () => {
  describe("GET /admin/users/:id success", () => {
    it("should response with status 200 and object user", async () => {
      const { status, body } = await request(app)
        .get("/admin/users/1")
        .set({ access_token: access_token });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("name", expect.any(String));
      expect(body).toHaveProperty("email", expect.any(String));
      expect(body).toHaveProperty("phoneNumber", expect.any(String));
      expect(body).toHaveProperty("photo", expect.any(String));
      expect(body).toHaveProperty("idCardImg", expect.any(String));
      expect(body).toHaveProperty("rating", expect.any(Number));
      expect(body).toHaveProperty("status", expect.any(String));
      expect(body).toHaveProperty("Vehicle");
      expect(body.Vehicle).toBeInstanceOf(Object);
    });
  });

  describe("GET /admin/users/:userId fail", () => {
    it("should response with status 404 and error message if user with <userId> not found", async () => {
      const { status, body } = await request(app)
        .get("/admin/users/100")
        .set({ access_token: access_token });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Data not found");
    });
  });
});

describe("PATCH /admin/users/:userId", () => {
  describe("PATCH /admin/users/:userId success", () => {
    it("should response with status 200 and success message", async () => {
      const { status, body } = await request(app)
        .patch("/admin/users/1")
        .set({ access_token: access_token })
        .send({ status: "verified" });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("PATCH /admin/users/:userId fail", () => {
    it("should response with status 404 and error message if user with <userId> not found", async () => {
      const { status, body } = await request(app)
        .patch("/admin/users/100")
        .set({ access_token: access_token })
        .send({ status: "verified" });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Data not found");
    });

    it("should response with status 400 and error message if status is same", async () => {
      const { status, body } = await request(app)
        .patch("/admin/users/1")
        .set({ access_token: access_token })
        .send({ status: "verified" });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("No changes has been made");
    });
  });
});

describe("GET /admin/rides", () => {
  describe("GET /admin/rides success", () => {
    it("should response with status 200 and array of rides with creator data", async () => {
      const { status, body } = await request(app)
        .get("/admin/rides")
        .set({ access_token: access_token });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body[0]).toHaveProperty("id", expect.any(Number));
      expect(body[0]).toHaveProperty("startLocation", expect.any(String));
      expect(body[0]).toHaveProperty("destination", expect.any(String));
      expect(body[0]).toHaveProperty("departureTime", expect.any(String));
      expect(body[0]).toHaveProperty("arrivalTime", expect.any(String));
      expect(body[0]).toHaveProperty("price", expect.any(Number));
      expect(body[0]).toHaveProperty("seats", expect.any(Number));
      expect(body[0]).toHaveProperty("createdBy", expect.any(Number));
      expect(body[0]).toHaveProperty("VehicleId", expect.any(Number));
    });
  });
});

describe("DELETE /admin/rides/:id", () => {
  describe("DELETE /admin/rides/:id success", () => {
    it("should response with status 200 and success message", async () => {
      const { status, body } = await request(app)
        .delete("/admin/rides/1")
        .set({ access_token: access_token });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("DELETE /admin/rides/:id fail", () => {
    it("should response with status 404 and error message if ride with <id> not found", async () => {
      const { status, body } = await request(app)
        .delete("/admin/rides/100")
        .set({ access_token: access_token });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Data not found");
    });
  });
});
