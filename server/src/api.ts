import { Router } from "express";
import { redis } from "./redis";

export const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
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

  const delay = Math.floor(Math.random() * 2000) + 1;

  setTimeout(() => {
    res.json({ index });
  }, delay);
});
