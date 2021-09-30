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

const UpdatePassword = async (email, password, code) => {
  await User.updateOne({ email: email }, { $set: { password: password } });
  await Code.deleteOne({ code: code });
  return true;
};

module.exports = {
  ValidateCode,
  UpdatePassword,
};
