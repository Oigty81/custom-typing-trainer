module.exports = {
  root: true,
  env: {
    node: true
  },
  "extends": [
      "plugin:vue/vue3-essential",
      "plugin:vue/vue3-recommended",
      "eslint:recommended",
    ],
  parserOptions: {
    ecmaVersion: 2022
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: [2, "always"],
    indent: 'off',
    "no-trailing-spaces": [
      2,
      {
        skipBlankLines: true
      }
    ],
    "space-before-function-paren": "off",
    "comma-dangle": "off",
    //"avoidEscape": 1,
    quotes: "off",
    "spaced-comment": "off",
    "keyword-spacing": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-extra-semi": "off",
    //"semi": "off",
    "no-unused-vars": "warn",
    "vue/no-unused-vars": "warn"
  }
};
  