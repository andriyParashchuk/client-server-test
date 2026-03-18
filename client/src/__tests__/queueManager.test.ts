import { describe, test, expect, jest } from "@jest/globals";
import { runQueue } from "../utils/queueManager";

type Task = () => Promise<void>;

function createTask(delay = 0, fn = jest.fn()): Task {
  return () =>
    new Promise((resolve) => {
      fn();
      setTimeout(resolve, delay);
    });
}

describe("runQueue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("runs all tasks", async () => {
    const spy = jest.fn();

    const tasks = Array.from({ length: 5 }, () =>
      createTask(0, spy)
    );

    await runQueue(tasks, { concurrency: 2, ratePerSecond: 5 });

    expect(spy).toHaveBeenCalledTimes(5);
  });

  test("respects concurrency limit", async () => {
    let active = 0;
    let maxActive = 0;

    const tasks: Task[] = Array.from({ length: 5 }, () => async () => {
      active++;
      maxActive = Math.max(maxActive, active);

      await new Promise((r) => setTimeout(r, 50));

      active--;
    });

    await runQueue(tasks, { concurrency: 2, ratePerSecond: 5 });

    expect(maxActive).toBeLessThanOrEqual(2);
  });

  test("resolves after all tasks complete", async () => {
    const tasks = [
      createTask(10),
      createTask(20),
      createTask(30),
    ];

    await expect(
      runQueue(tasks, {
        concurrency: 2,
        ratePerSecond: 10,
      })
    ).resolves.toBeUndefined();
  });

  test("continues even if task fails", async () => {
    const good = jest.fn();

    const tasks: Task[] = [
      () => Promise.reject(new Error("fail")),
      createTask(0, good),
    ];

    await runQueue(tasks, {
      concurrency: 1,
      ratePerSecond: 2,
    });

    expect(good).toHaveBeenCalled();
  });

  test("handles empty task list", async () => {
    await expect(
      runQueue([], { concurrency: 2, ratePerSecond: 2 })
    ).resolves.toBeUndefined();
  });

  test("handles concurrency greater than tasks count", async () => {
    const spy = jest.fn();

    const tasks = Array.from({ length: 2 }, () =>
      createTask(0, spy)
    );

    await runQueue(tasks, {
      concurrency: 10,
      ratePerSecond: 10,
    });

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
