const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  extends: ["next/core-web-vitals"],
  rules: {
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off",
  },
});