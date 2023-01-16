const config = {
  transform: {},
  transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.[jt]s$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
};

module.exports = config;
