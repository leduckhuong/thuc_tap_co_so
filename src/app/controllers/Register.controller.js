const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const User = require('../models/User.model');

class Register {
    // [GET] /register 
    index(req, res) {
        res.render('index', {
            isRegister: true
        });
    }
    // [POST] /register
    async register(req, res, next) {
        try {
            // Get user input
            const { account, password } = req.body;
        
            // Validate user input
            if (!(account && password )) {
                res.status(400).send("All input is required");
            }
        
            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await User.findOne({ account });
        
            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }
            // Create user in our database
            const user = await User.create({
                account: account.toLowerCase(), // sanitize: convert email to lowercase
                password
            });
        
            // Create token
            const access_token = jwt.sign({ user_id: user._id, account },process.env.ACCESSTOKEN_SECRET_KEY,{
                expiresIn: "30s",
            });
            const refresh_token = jwt.sign({ user_id: user._id },process.env.REFRESHTOKEN_SECRET_KEY,{
                expiresIn: "1d",
            });
            res.status(201)
            .cookie('access_token', access_token, {
                expires: new Date(Date.now() + 3600000), 
                signed: true,
                httpOnly: true
            })
            .cookie('refresh_token', refresh_token, { 
                expires: new Date(Date.now() + 25*3600000),
                signed: true,
                httpOnly: true
            })
            .redirect('/');
        } catch (err) {
            console.log(err);
        }
        // Our register logic ends here
    };
}

module.exports = new Register();