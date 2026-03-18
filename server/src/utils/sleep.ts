export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRandomDelay = (min = 1, max = 2000) => 
  Math.floor(Math.random() * max) + min;
