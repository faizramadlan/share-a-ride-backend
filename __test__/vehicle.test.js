const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const Hash = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");

let access_token = generateToken({ id: 1 });
let wrongaccesstoken = generateToken({ id: 10 });
let anotheraccesstoken = generateToken({ id: 4 });
let sampleAccessToken = "";
let sampleVehicle = {
  type: "suv",
  plateNumber: "A 5521 PLZ",
};
let sampleUser = {
  name: "Test User 1",
  email: "testuser1@mail.com",
  password: "password",
  phoneNumber: "81324759",
  photo: "https://example-photo.com",
  idCardImg: "https://example-id.com",
};

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
    //create test user with no vehicles
    const data = await User.create(sampleUser);
    let testUser = data.dataValues;
    sampleAccessToken = generateToken({ id: testUser.id });
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

describe("POST /vehicles", () => {
  describe("POST /vehicles success", () => {
    it("should response with status 201 and success message", async () => {
      const { status, body } = await request(app)
        .post("/vehicles")
        .set({ access_token: access_token })
        .send(sampleVehicle);
      expect(status).toBe(201);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("POST /vehicles fail", () => {
    it("should response with status 400 and error message if vehicle type is null", async () => {
      const { status, body } = await request(app)
        .post("/vehicles")
        .set({ access_token: sampleAccessToken })
        .send({ ...sampleVehicle, type: null });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Vehicle type is required");
    });

    it("should response with status 400 and error message if plate number is null", async () => {
      const { status, body } = await request(app)
        .post("/vehicles")
        .set({ access_token: access_token })
        .send({ ...sampleVehicle, plateNumber: null });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Vehicle plate number is required");
    });

    it("should response with status 400 and error message if vehicle type is empty", async () => {
      const { status, body } = await request(app)
        .post("/vehicles")
        .set({ access_token: access_token })
        .send({ ...sampleVehicle, type: "" });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Vehicle type is required");
    });

    it("should response with status 400 and error message if plate number is empty", async () => {
      const { status, body } = await request(app)
        .post("/vehicles")
        .set({ access_token: access_token })
        .send({ ...sampleVehicle, plateNumber: "" });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Vehicle plate number is required");
    });
  });
});

describe("PUT /vehicles/:id", () => {
  describe("PUT /vehicles/:id success", () => {
    it("should response with status 200 and success message", async () => {
      const { status, body } = await request(app)
        .put("/vehicles/4")
        .set({ access_token: anotheraccesstoken })
        .send({ type: "motorcycle", plateNumber: "G 3456 GHI" });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Edit success");
    });
  });

  describe("PUT /vehicles/:id fail", () => {
    it("should response with status 404 and error message if no vehicle with <id>", async () => {
      const { status, body } = await request(app)
        .put("/vehicles/10")
        .set({ access_token: access_token })
        .send(sampleVehicle);
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Data not found");
    });

    it("should response with status 400 and error message if different user", async () => {
      const { status, body } = await request(app)
        .put("/vehicles/4")
        .set({ access_token: wrongaccesstoken })
        .send(sampleVehicle);
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Forbidden");
    });
  });
});

describe("DELETE /vehicles/:id", () => {
  describe("DELETE /vehicles/:id success", () => {
    it("should response with status 200 and success message", async () => {
      const accesstoken2 = generateToken({ id: 2 });
      const { status, body } = await request(app)
        .delete("/vehicles/1")
        .set({ access_token: access_token });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Vehicle deleted");
    });
  });

  describe("DELETE /vehicles/:id fail", () => {
    it("should response with status 403 and error message if vehicle does not belong to current user", async () => {
      const { status, body } = await request(app)
        .delete("/vehicles/3")
        .set({ access_token: access_token });
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Forbidden");
    });

    it("should response with status 404 and error message if no vehicle with <id>", async () => {
      const { status, body } = await request(app)
        .delete("/vehicles/100")
        .set({ access_token: access_token });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Data not found");
    });
  });
});
