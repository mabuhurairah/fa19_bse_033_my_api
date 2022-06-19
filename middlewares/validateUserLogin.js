const { userLoginValidate } = require("../models/user");
function validateUserLogin(req, res, next) {
  let { error } = userLoginValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateUserLogin;