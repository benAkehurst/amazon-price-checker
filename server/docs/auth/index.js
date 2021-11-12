const login = require("./login-user");
const createUser = require("./create-user");

module.exports = {
  paths: {
    "/login": {
      ...login,
    },
    "/create-new-user": {
      ...createUser,
    },
  },
};
