const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");


// Register
router.post("/register", async(req, res)=>{
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body?.password,salt);

        // genereate new user
        const user = await new User({
            username: req.body?.username,
            email: req.body?.email,
            password: hashedPassword
        });

        // save user to database
        const savedUser = await user.save();

        // send response to frontend
        res.status(200).json(savedUser);
        
    } catch (error) {
        console.warn(error);
        res.status(500).json(error);
    }
});

// Login

router.post("/login", async(req, res)=>{
    try {
        const user = await User.findOne({email: req.body?.email});
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body?.password, user.password);
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(user);
    } catch (error) {
        console.warn(error);
        res.status(500).json(error);
    }
});

module.exports = router;