import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "packages/dashboard/**", // Uses oxlint
      "scratch/**",
    ],
  },
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    files: ["**/*.ts", "**/*.mjs", "**/*.js"],
    rules: {
      // TODO: Tighten these rules incrementally
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-undef": "off",
      "prefer-const": "warn",
      "no-useless-escape": "warn",
      "no-unsafe-optional-chaining": "warn"
    },
  },
  {
    files: ["scripts/**", "packages/cli/**"],
    rules: {
      "no-console": "off",
    },
  },
);
