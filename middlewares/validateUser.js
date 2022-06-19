const { userValidate } = require("../models/user");
function validateUser(req, res, next) {
  let { error } = userValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateUser;