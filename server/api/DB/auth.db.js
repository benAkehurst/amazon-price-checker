const User = require('../models/user.model');
const Code = require('../models/code.model');

const ValidateCode = async (email) => {
  await User.updateOne(
    { email: email },
    { $set: { userStatus: 'active', userActive: true } }
  );
  await Code.deleteMany({ email: email });
  return true;
};

module.exports = {
  ValidateCode,
};
