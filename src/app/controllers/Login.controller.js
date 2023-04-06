const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

class Login {
    // [GET] /login 
    index(req, res) {
        res.render('index', {
            isLogin: true
        });
    }
    // [POST] /login
    async login(req, res, next) {
        // Our login logic starts here
        try {
            // Get user input
            const { account, password } = req.body;

            // Validate user input
            if (!(account && password)) {
                res.status(400).send("All input is required");
            }
            console.log('123');
            // Validate if user exist in our database
            const user = await User.findOne({ account });
            if (user && password === user.password) {
                // Create token
                const access_token = jwt.sign({ user_id: user._id, account },process.env.ACCESSTOKEN_SECRET_KEY,{
                    expiresIn: "30s",
                });
                const refresh_token = jwt.sign({ user_id: user._id },process.env.REFRESHTOKEN_SECRET_KEY,{
                    expiresIn: "1d",
                });
                console.log('12444');
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
            }
            else res.status(400).send("Invalid Credentials");
        } catch (err) {
            console.log(err);
        }
        // Our register logic ends here
    };
}
module.exports = new Login();