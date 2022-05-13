const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const cryptoJs = require('crypto-js');

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//login

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if(!user) {
            res.status(401).json("wrong crendentials!");
            return;
        }

        const hasedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const originalPassword = hasedPassword.toString(cryptoJs.enc.Utf8);

        if(originalPassword !== req.body.password) {
            res.status(401).json("wrong crendentials!");
            return;
        }
           

        const {password, ...others} = user._doc;

        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;