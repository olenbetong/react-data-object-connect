/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "prettier", "react-hooks"],
  rules: {
    "react/prop-types": "off",
    "no-console": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "prefer-const": "off",
  },
  overrides: [
    {
      files: ["scripts/*"],
      rules: { "@typescript-eslint/no-var-requires": "off" },
    },
    {
      files: ["*.js", "*.jsx", "*.ts"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-inferrable-types": "warn",
        "no-var": "off",
        "prefer-rest-params": "off",
        "prefer-spread": "off",
      },
    },
    {
      files: ["*.test.ts"],
      rules: { "@typescript-eslint/ban-ts-comment": "off" },
    },
  ],
};
