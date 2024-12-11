module.exports = {
  root: true,
  rules: {
    "vue/no-v-model-argument": "off"
  },
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
}
