export async function fetchItem(index: number): Promise<{ index: number }> {
  const res = await fetch(`http://localhost:3001/api?i=${index}`);

  if (res.status === 429) {
    throw new Error("RATE_LIMIT");
  }

  if (!res.ok) {
    throw new Error("OTHER_ERROR");
  }

  return res.json();
}
