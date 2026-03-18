import request from "supertest";
import express from "express";
import { apiRouter } from "../api";
import { redis } from "../config/redis";
import * as utils from "../utils/sleep";

jest.mock("../config/redis", () => {
  const Redis = require("ioredis-mock");
  return { redis: new Redis() };
});

jest.spyOn(utils, "sleep").mockImplementation(() => Promise.resolve());
jest.spyOn(utils, "getRandomDelay").mockReturnValue(10);

const app = express();
app.use(express.json());
app.use("/", apiRouter);

describe("GET /", () => {
  beforeEach(async () => {
    await redis.flushall();
  });

  it("should return 200 and request index", async () => {
    const response = await request(app).get("/?i=42");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ index: 42 });
  });

  it("should return 429 if rate limit is exceeded (50 requests)", async () => {
    for (let i = 0; i < 50; i++) {
      await request(app).get("/?i=1");
    }

    const response = await request(app).get("/?i=51");

    expect(response.status).toBe(429);
    expect(response.body.error).toBe("Too many requests");
  });

  it("should return 500 if Redis error occurs", async () => {
    jest.spyOn(redis, "incr").mockRejectedValueOnce(new Error("Redis failed"));

    const response = await request(app).get("/?i=1");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });
});
