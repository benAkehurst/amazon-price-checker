module.exports = {
  post: {
    tags: ["Auth CRUD Operations"],
    description: "Login to app and create session.",
    operationId: "login",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/loginInput",
          },
        },
      },
    },
  },
  responses: {
    400: {
      description: "The provided email is not registered.",
      description: "Email and password do not match.",
    },
    200: {
      description: "Successfully logged in",
    },
    500: {
      description: "Something went wrong.",
    },
  },
};
