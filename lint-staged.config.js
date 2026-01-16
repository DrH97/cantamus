export default {
  "*.{js,ts,jsx,tsx,json,css,md}": ["biome check --write"],
  "*.{ts,tsx}": () => "tsc --noEmit",
};
