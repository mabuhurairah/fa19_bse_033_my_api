var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    fullName:String,
    contactNumber:String,
    email:String,
    password:String,
    role: {
        type: String,
        default: "user",
    },
});

userSchema.methods.generateHashedPassword = async function () {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
};

var User = mongoose.model("User", userSchema);

function validateUser(data) {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(30).required(),
        contactNumber: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().min(3).max(30).required(),
        password: Joi.string().min(3).max(30).required(),
    });
    return schema.validate(data, { abortEarly: false });
}

function validateUserLogin(data) {
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(30).required(),
        password: Joi.string().min(3).max(30).required(),
    });
    return schema.validate(data, { abortEarly: false });
}

module.exports.User = User;
module.exports.userValidate = validateUser;  //Validation for registration.
module.exports.userLoginValidate = validateUserLogin;    //Validation for login.