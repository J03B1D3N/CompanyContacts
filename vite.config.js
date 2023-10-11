import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue2";

export default defineConfig({
  base: "/CompanyContacts",
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
