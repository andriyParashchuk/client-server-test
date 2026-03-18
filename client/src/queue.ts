type Task = () => Promise<void>;

type Options = {
  concurrency: number;
  ratePerSecond: number;
};

export function runQueue(tasks: Task[], options: Options) {
  const { concurrency, ratePerSecond } = options;

  let active = 0;
  let index = 0;
  let completed = 0;

  let allowed = ratePerSecond;

  return new Promise<void>((resolve) => {
    setInterval(() => {
      allowed = ratePerSecond;
      tick();
    }, 1000);

    function tick() {
      while (
        active < concurrency &&
        allowed > 0 &&
        index < tasks.length
      ) {
        const task = tasks[index++];
        active++;
        allowed--;

        task()
          .catch(() => {})
          .finally(() => {
            active--;
            completed++;

            if (completed === tasks.length) {
              resolve();
              return;
            }

            tick();
          });
      }
    }

    tick();
  });
}
