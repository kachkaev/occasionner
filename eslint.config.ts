import { generateBaseConfigs } from "@kachkaev/eslint-config-base";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...generateBaseConfigs({ tsconfigRootDir: import.meta.dirname }),

  {
    ignores: [".claude/**", ".husky/**", "**/dist/**"],
  },

  {
    files: ["**/vitest.config.ts"],
    rules: {
      "import/no-default-export": "off", // Vitest reads the config from the file's default export
    },
  },
]);
