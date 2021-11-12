const login = require("./login-user");

module.exports = {
  paths: {
    "/login": {
      ...login,
    },
  },
};
