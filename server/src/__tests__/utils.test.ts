import { getRandomDelay, sleep } from "../utils/sleep";

describe("Utils Tests", () => {

  describe("getRandomDelay", () => {
    it("should return a number within the specified range", () => {
      const min = 100;
      const max = 200;
      const result = getRandomDelay(min, max);

      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max + min);
    });
  });

  describe("sleep", () => {
    it("should resolve after the specified time", async () => {
      jest.useFakeTimers();
      const sleepPromise = sleep(1000);

      jest.advanceTimersByTime(1000);

      await expect(sleepPromise).resolves.toBeUndefined();
      jest.useRealTimers();
    });
  });
});
