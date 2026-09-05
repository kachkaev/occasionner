import { generateBaseConfigs } from "@kachkaev/eslint-config-base";
import { defineConfig } from "eslint/config";

export default defineConfig([
  generateBaseConfigs({ tsconfigRootDir: import.meta.dirname }),

  {
    ignores: [".claude/**", ".husky/**", "**/dist/**"],
  },

  {
    // Rules added in eslint-plugin-unicorn v65–v74 (via @kachkaev/eslint-config-base v2) that this
    // codebase does not adopt yet; reviewed collectively in https://github.com/kachkaev/repo-dive/issues/212.
    files: ["**/*.{ts,tsx}"],
    rules: {
      "unicorn/no-break-in-nested-loop": "off", // `continue` in a nested loop reads fine here; extracting functions for it adds noise.
      "unicorn/require-array-sort-compare": "off", // Type-unaware: it also flags string arrays, where the default sort is what we want.
      "unicorn/single-line-block-comment-style": "off", // Single-line `/** … */` doc comments are the norm here; rewriting them into three-line blocks is churn without benefit.
    },
  },

  {
    files: ["**/vitest.config.ts"],
    rules: {
      "import/no-default-export": "off", // Vitest reads the config from the file's default export
    },
  },
]);
