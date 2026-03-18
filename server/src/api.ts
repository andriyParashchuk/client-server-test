import { Router } from "express";
import { redis } from "./config/redis";
import { sleep, getRandomDelay } from "./utils/sleep";

export const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
  try {
    const index = Number(req.query.i);

    const currentSecond = Math.floor(Date.now() / 1000);
    const key = `requests:${currentSecond}`;

    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 1);
    }

    if (count > 50) {
      return res.status(429).json({ error: "Too many requests" });
    }

    const delay = getRandomDelay();
    await sleep(delay);

    res.json({ index });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
