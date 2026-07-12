import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const viteBasePath = loadEnv(mode, ".", "VITE_").VITE_BASE_PATH ?? "/";

  return {
    base: viteBasePath,
    plugins: [react()],
    test: {
      environment: "node",
    },
  };
});
