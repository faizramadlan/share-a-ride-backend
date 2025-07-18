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
let sampleRide = {
  startLocation: "Bandung",
  destination: "Jakarta",
  departureTime: "2023-05-10 10:00:00",
  arrivalTime: "2023-05-10 13:00:00",
  price: 70000,
  seats: 3,
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

describe("GET /rides", () => {
  describe("GET /rides success", () => {
    it("should response with status 200 and array of rides with creator data", async () => {
      const { status, body } = await request(app)
        .get("/rides")
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
      expect(body[0].UserRides).toBeInstanceOf(Object);
      expect(body[0].UserRides).toHaveLength(1);
      expect(body[0].UserRides[0].status).toBe("creator");
      expect(body[0].UserRides[0].User).toBeInstanceOf(Object);
    });
  });
});

describe("GET /rides/:id", () => {
  describe("GET /rides/:id success", () => {
    it("should response with status 200 and ride data with users", async () => {
      const { status, body } = await request(app)
        .get("/rides/1")
        .set({ access_token: access_token });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("startLocation", expect.any(String));
      expect(body).toHaveProperty("destination", expect.any(String));
      expect(body).toHaveProperty("departureTime", expect.any(String));
      expect(body).toHaveProperty("arrivalTime", expect.any(String));
      expect(body).toHaveProperty("price", expect.any(Number));
      expect(body).toHaveProperty("seats", expect.any(Number));
      expect(body).toHaveProperty("createdBy", expect.any(Number));
      expect(body).toHaveProperty("VehicleId", expect.any(Number));
      expect(body.UserRides).toBeInstanceOf(Object);
      expect(body.UserRides[0].User).toBeInstanceOf(Object);
    });
  });

  describe("GET /rides/:id fail", () => {
    it("should response with status 404 and error message if ride with <id> not found", async () => {
      const { status, body } = await request(app)
        .get("/rides/100")
        .set({ access_token: access_token });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Data not found");
    });
  });
});

describe("DELETE /rides/:id", () => {
  describe("DELETE /rides/:id success", () => {
    it("should response with status 200 and success message", async () => {
      const { status, body } = await request(app)
        .delete("/rides/1")
        .set({ access_token: access_token });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("DELETE /rides/:id fail", () => {
    it("should response with status 404 and error message if ride with <id> not found", async () => {
      const { status, body } = await request(app)
        .delete("/rides/100")
        .set({ access_token: access_token });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Data not found");
    });

    it("should response with status 403 and error message if current user is not ride creator", async () => {
      const { status, body } = await request(app)
        .delete("/rides/1")
        .set({ access_token: wrongaccesstoken });
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Forbidden");
    });
  });
});

describe("POST /rides", () => {
  describe("POST /rides success", () => {
    it("should response with status 201 and success message", async () => {
      const { status, body } = await request(app)
        .post("/rides")
        .set({ access_token: access_token })
        .send(sampleRide);
      expect(status).toBe(201);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("POST /rides fail", () => {
    it("should response with status 400 and error message if user do not have registered vehicle", async () => {
      const { status, body } = await request(app)
        .post("/rides")
        .set({ access_token: sampleAccessToken })
        .send(sampleRide);
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe(
        "You need to register a vehicle to create ride"
      );
    });

    it("should response with status 400 and error message if seat < 1", async () => {
      const { status, body } = await request(app)
        .post("/rides")
        .set({ access_token: access_token })
        .send({ ...sampleRide, seats: 0 });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Minimum seat number is 1");
    });

    it("should response with status 400 and error message if start location is null", async () => {
      const { status, body } = await request(app)
        .post("/rides")
        .set({ access_token: access_token })
        .send({ ...sampleRide, startLocation: null });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Start location is required");
    });

    it("should response with status 400 and error message if destination is null", async () => {
      const { status, body } = await request(app)
        .post("/rides")
        .set({ access_token: access_token })
        .send({ ...sampleRide, destination: null });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Destination point is required");
    });

    it("should response with status 400 and error message if departure time is null", async () => {
      const { status, body } = await request(app)
        .post("/rides")
        .set({ access_token: access_token })
        .send({ ...sampleRide, departureTime: null });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Departure time is required");
    });

    it("should response with status 400 and error message if arrival time is null", async () => {
      const { status, body } = await request(app)
        .post("/rides")
        .set({ access_token: access_token })
        .send({ ...sampleRide, arrivalTime: null });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Estimation of arrival time is required");
    });

    it("should response with status 400 and error message if price is null", async () => {
      const { status, body } = await request(app)
        .post("/rides")
        .set({ access_token: access_token })
        .send({ ...sampleRide, price: null });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Price is required");
    });
  });
});

describe("PUT /rides/:id", () => {
  describe("PUT /rides/:id success", () => {
    it("should response with status 200 and success message", async () => {
      const accesstoken2 = generateToken({ id: 2 });
      const { status, body } = await request(app)
        .put("/rides/2")
        .set({ access_token: accesstoken2 })
        .send(sampleRide);
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("PUT /rides/:id fail", () => {
    it("should response with status 404 and error message if no ride with <id>", async () => {
      const { status, body } = await request(app)
        .put("/rides/10")
        .set({ access_token: access_token })
        .send(sampleRide);
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Data not found");
    });

    it("should response with status 400 and error message if different user", async () => {
      const { status, body } = await request(app)
        .put("/rides/5")
        .set({ access_token: wrongaccesstoken })
        .send(sampleRide);
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body.message).toBe("Forbidden");
    });
  });
});

describe("POST /rides/generate-midtrans-token", () => {
  describe("POST /rides/generate-midtrans-token success", () => {
    it("should response with status 200 and midtrans token and url", async () => {
      const { status, body } = await request(app)
        .post("/rides/generate-midtrans-token")
        .set({ access_token: anotheraccesstoken });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("token", expect.any(String));
      expect(body).toHaveProperty("redirect_url", expect.any(String));
    });
  });

  describe("POST /rides/generate-midtrans-token fail", () => {
    it("should response with status 400 and error message if boking is already paid", async () => {
      const { status, body } = await request(app)
        .post("/rides/generate-midtrans-token")
        .set({ access_token: anotheraccesstoken });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("You have paid for this booking");
    });
  });
});

describe("POST /rides/order/:id", () => {
  describe("POST /rides/order/:id success", () => {
    it("should response with status 201 and success message", async () => {
      const { status, body } = await request(app)
        .post("/rides/order/3")
        .set({ access_token: access_token });
      expect(status).toBe(201);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Order received");
    });
  });

  describe("POST /rides/order/:id fail", () => {
    it("should response with status 400 and error message if you already order this ride before", async () => {
      const { status, body } = await request(app)
        .post("/rides/order/3")
        .set({ access_token: access_token });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("You have ordered this ride");
    });

    it("should response with status 400 and error message if the ride is fully booked", async () => {
      const { status, body } = await request(app)
        .post("/rides/order/5")
        .set({ access_token: anotheraccesstoken });
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("The ride is fully booked");
    });

    it("should response with status 404 and error message if no ride with <id>", async () => {
      const { status, body } = await request(app)
        .post("/rides/order/100")
        .set({ access_token: access_token });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Data not found");
    });
  });
});

describe("PATCH /rides/order/:id", () => {
  describe("PATCH /rides/order/:id success", () => {
    it("should response with status 200 and success message", async () => {
      const { status, body } = await request(app)
        .patch("/rides/order/8")
        .set({ access_token: access_token })
        .send({ status: "accepted" });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Order request is accepted");
    });
  });

  describe("PATCH /rides/order/:id fail", () => {
    it("should response with status 403 and error message if ride does not belong to current user", async () => {
      const { status, body } = await request(app)
        .patch("/rides/order/6")
        .set({ access_token: access_token })
        .send({ status: "accepted" });
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Forbidden");
    });

    it("should response with status 404 and error message if no order with <id>", async () => {
      const { status, body } = await request(app)
        .patch("/rides/order/100")
        .set({ access_token: access_token })
        .send({ status: "accepted" });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Data not found");
    });
  });
});

describe("DELETE /rides/order/:id", () => {
  describe("DELETE /rides/order/:id success", () => {
    it("should response with status 200 and success message", async () => {
      const { status, body } = await request(app)
        .delete("/rides/order/8")
        .set({ access_token: access_token });
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Order is cancelled");
    });
  });

  describe("DELETE /rides/order/:id fail", () => {
    it("should response with status 403 and error message if ride does not belong to current user", async () => {
      const { status, body } = await request(app)
        .delete("/rides/order/3")
        .set({ access_token: anotheraccesstoken });
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Forbidden");
    });

    it("should response with status 404 and error message if no ride with <id>", async () => {
      const { status, body } = await request(app)
        .delete("/rides/order/100")
        .set({ access_token: access_token });
      expect(status).toBe(404);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toBe("Data not found");
    });
  });
});
