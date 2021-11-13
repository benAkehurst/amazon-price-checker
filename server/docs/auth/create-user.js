module.exports = {
  post: {
    tags: ["Auth CRUD Operations"],
    description: "Creates a new user.",
    operationId: "Create new user",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/createUser",
          },
        },
      },
    },
  },
  responses: {
    400: {
      description: "Please provide all required fields",
      description: "The entered passwords do not match!",
      description:
        "Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.",
      description: "You need to accept the terms of use.",
      description: "Email address has invalid format",
      description: "Error creating user",
    },
    201: {
      description: "User created",
    },
    500: {
      description: "General Error Creating new account",
    },
  },
};
