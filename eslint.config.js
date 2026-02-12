import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
      },
    },
    rules: {
      // Customize rules as needed
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console.log in development
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
