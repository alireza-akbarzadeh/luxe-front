const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Default is 100; allow a bit more room for scoped subjects while staying one-line.
    'header-max-length': [2, 'always', 120]
  }
};

export default config;
