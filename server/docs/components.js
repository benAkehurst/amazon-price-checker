module.exports = {
  components: {
    schemas: {
      // User Model
      user: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            description: "User's first name.",
            example: "John",
          },
          lastName: {
            type: "string",
            description: "User's last name.",
            example: "Doe",
          },
          email: {
            type: "string",
            description: "User's email address.",
            example: "john@doe.com",
          },
          password: {
            type: "string",
            description:
              "Password for user account. password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.",
            example: "Abc123!@",
          },
          acceptedTerms: {
            type: "boolean",
            description: "Confirms the user accepts t's & c's on sign up.",
            example: "true",
          },
          createdOnDate: {
            type: "boolean",
            description:
              "A human readable format of the date the user was created.",
            example: "12/11/2021",
          },
          userUID: {
            type: "string",
            description: "A UUID for the user object.",
            example: "8eac14c0-83b4-46f7-a9ef-bef5ded8997f",
          },
          userAcquisitionLocation: {
            type: "string",
            description:
              "Defines where the user opened their account, via the sign up form or using goolge credentials.",
            example: "Manual Registration Form",
          },
          trackedItems: {
            type: "array",
            description: "Array of object ids of items the user is tracking.",
            example: "[]",
          },
          isAdmin: {
            type: "boolean",
            description: "Defines if the user is an admin.",
            example: "false",
          },
          userActive: {
            type: "boolean",
            description: "Defines if the user confirmed their email address.",
            example: "false",
          },
        },
      },
      // Item Model
      singleItem: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Item name.",
            example: "Samsung-LC32R500FHRXXU-Curved-FullHD-Monitor",
          },
          link: {
            type: "string",
            description: "Valid Amazon url of item.",
            example:
              "https://www.amazon.co.uk/Samsung-LC32R500FHRXXU-Curved-FullHD-Monitor/dp/B08WXCZT4Y",
          },
          imgUrl: {
            type: "string",
            description: "Scraped url for main image url.",
            example:
              "https://m.media-amazon.com/images/I/81kfNKhZp+L._AC_SX300_SY300_.jpg",
          },
          currentPrice: {
            type: "number",
            description:
              "Current item price rounded to the nearest whole number.",
            example: "179",
          },
          targetPrice: {
            type: "number",
            description:
              "A user defined number the user would like to pay for the item.",
            example: "175",
          },
          asin: {
            type: "string",
            description: "Amazon SKU.",
            example: "B08WXCZT4Y",
          },
          rating: {
            type: "string",
            description: "Current rating.",
            example: "4.5 out of 5 stars",
          },
          following: {
            type: "boolean",
            description:
              "Tracks if the user is tracking the price and the item price is being updated.",
            example: "true",
          },
          pastPrices: {
            type: "array",
            description:
              "Holds a record of past prices. This array is updated each time the item price is updated.",
            example: "[{time: 1636729931796, pastPrice: 179}]",
          },
        },
      },
      loginInput: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "user email",
            example: "john@doe.com",
          },
          password: {
            type: "string",
            description: "user password",
            example: "Abc123!@",
          },
          rememberMe: {
            type: "boolean",
            description: "Defines if user is to remain logged in",
            example: "true",
          },
        },
      },
      createUser: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            description: "User's first name.",
            example: "John",
          },
          lastName: {
            type: "string",
            description: "User's last name.",
            example: "Doe",
          },
          email: {
            type: "string",
            description: "User's email address.",
            example: "john@doe.com",
          },
          password: {
            type: "string",
            description:
              "Password for user account. password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.",
            example: "Abc123!@",
          },
          password2: {
            type: "string",
            description: "A repeat of the first password",
            example: "Abc123!@",
          },
          acceptedTerms: {
            type: "boolean",
            description: "Confirms the user accepts t's & c's on sign up.",
            example: "true",
          },
        },
      },
    },
  },
};
