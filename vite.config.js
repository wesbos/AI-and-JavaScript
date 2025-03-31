import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: "ES2022",
    outDir: "docs",
    base: "/AI-and-JavaScript/",
  },
});
