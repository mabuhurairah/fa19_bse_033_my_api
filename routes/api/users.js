const express = require('express');
var { User } = require("../../models/user");
const validateUser = require('../../middlewares/validateUser');
let router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
var bcrypt = require('bcryptjs');
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');
const validateUserLogin = require('../../middlewares/validateUserLogin');


//get all users
router.get("/", auth, admin, async (req,res) => {
    let users = await User.find();
    return res.send(users);
});

//get single user
router.get("/:id", async (req,res) => {
    try{
        let user = await User.findById(req.params.id);
        if(!user){
            return res.status(400).send("User with given ID not present"); //when id is not present in db
        }
        return res.send(user); //when id is ok
    }
    catch(err){
        return res.status(400).send("Invalid ID"); //format of id is invalid or not correct
    }
});

//update a user
router.put("/:id", async (req,res) => {
    let user = await User.findById(req.params.id);
    user.fullName = req.body.fullName;
    user.contactNumber = req.body.contactNumber;
    user.email = req.body.email;
    await user.save();
    return res.send(user);
});

//delete a user
router.delete("/:id", async (req,res) => {
    let user = await User.findByIdAndDelete(req.params.id);
    return res.send(user);
});

//insert a user
router.post("/", async (req,res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User with given Email already exist");
    
    user = new User();
    user.fullName = req.body.fullName;
    user.contactNumber = req.body.contactNumber;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    return res.send(_.pick(user, ["fullName", "email", "contactNumber"]));
});

//insert a user
router.post("/register", validateUser, async (req,res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User with given Email already exist");

    user = new User();
    user.fullName = req.body.fullName;
    user.contactNumber = req.body.contactNumber;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    let token = jwt.sign(
        { _id: user._id, fullName: user.fullName, contactNumber: user.contactNumber, email: user.email, role: user.role },
        config.get("jwtPrivateKey")
    );

    let dataToReturn = {
        fullName: user.fullName,
        contactNumber: user.contactNumber,
        email: user.email,
        token: user.token,
    };

    // return res.send(_.pick(user, ["fullName", "email", "contactNumber"]));
    return res.send(token);
});

router.post("/login", validateUserLogin, async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User Not Registered");

    let isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(401).send("Invalid Password");

    let token = jwt.sign(
      { _id: user._id, fullName: user.fullName, contactNumber: user.contactNumber, email: user.email, role: user.role },
      config.get("jwtPrivateKey")
    );
    res.send(token);
  });


module.exports = router;