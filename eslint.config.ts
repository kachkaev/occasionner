import { generateBaseConfigs } from "@kachkaev/eslint-config-base";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...generateBaseConfigs({ tsconfigRootDir: import.meta.dirname }),

  {
    ignores: [".claude/**", ".husky/**", "**/dist/**"],
  },
]);
