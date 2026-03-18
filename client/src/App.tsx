import React, { useState } from "react";
import { runQueue } from "./queue";
import { createTask } from "./taskFactory";

function App() {
  const [value, setValue] = useState(10);
  const [results, setResults] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStart = async () => {
    setStarted(true);
    setResults([]);
    setProgress(0);

    const total = 1000;

    const tasks = Array.from({ length: total }, (_, i) =>
      createTask(i + 1, (index) => {
        setResults((prev) => [...prev, index]);
        setProgress((p) => p + 1);
      })
    );

    await runQueue(tasks, {
      concurrency: value,
      ratePerSecond: value,
    });

    console.log("ALL DONE");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Task</h1>

      <input
        type="number"
        min={1}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />

      <button onClick={handleStart} disabled={started}>
        Start
      </button>

      <p>
        Progress: {progress} / 1000
      </p>

      <ul style={{ maxHeight: 300, overflow: "auto" }}>
        {results.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
