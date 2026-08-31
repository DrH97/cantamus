export default {
  // Biome has no Markdown support, so *.md is deliberately absent here — it
  // would leave Biome with zero files and a hard error on a docs-only commit.
  // --no-errors-on-unmatched covers the same case for staged files that sit in
  // a path Biome ignores.
  "*.{js,ts,jsx,tsx,json,css}": [
    "biome check --write --no-errors-on-unmatched",
  ],
  "*.{ts,tsx}": () => "tsc --noEmit",
};
