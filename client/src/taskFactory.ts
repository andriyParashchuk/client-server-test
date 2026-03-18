import { fetchItem } from "./api";

export function createTask(
  index: number,
  onSuccess: (index: number) => void
) {
  return async function task() {
    let attempts = 0;

    while (attempts < 5) {
      try {
        const data = await fetchItem(index);
        onSuccess(data.index);
        return;
      } catch (e: any) {
        if (e.message === "RATE_LIMIT") {
          await sleep(200);
          attempts++;
        } else {
          return;
        }
      }
    }
  };
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
