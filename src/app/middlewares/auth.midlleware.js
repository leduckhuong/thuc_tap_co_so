const jwt = require('jsonwebtoken');
const util = require('util');
const { response } = require('../../app');
const User = require('../models/User.model');

const verifyToken = util.promisify(jwt.verify);

const checkToken = async (req, res, next) => {
    try {
        console.log('passing check token')
        const token = req.signedCookies.access_token;
        if (!token) {
            console.log('0');
            return res.status(401).redirect('/login');
        }
        const decoded = await verifyToken(token, process.env.ACCESSTOKEN_SECRET_KEY);
        req.user_id = decoded.user_id;
        next();
    } catch (err) {
        console.log('56')
        if (err.name === 'TokenExpiredError') {
            console.log('2');
            // AccessToken has expired
            // Try to refresh the token
            const refreshToken = req.signedCookies.refresh_token; 
            if (!refreshToken) { return res.status(401).redirect('/login'); }
            try {
                console.log('3')
                const decoded = await verifyToken(refreshToken, process.env.REFRESHTOKEN_SECRET_KEY);
                console.log(decoded);
                // Generate new access token
                const user = await User.findById(decoded.user_id);
                if(user) {
                    const newAccessToken = jwt.sign({ user_id: decoded.user_id, account: user._id }, process.env.ACCESSTOKEN_SECRET_KEY, { expiresIn: '30s' });
                    // Send new token in response
                    console.log('is passed')
                    req.user_id = user._id;
                    console.log('user_id2: ', user._id);
                    res.status(201)
                    .cookie('access_token', newAccessToken, {
                        expires: new Date(Date.now() + 3600000), 
                        signed: true,
                        httpOnly: true
                    });
                    next();
                }
                else res.status(400).send("Invalid Credentials");
            } catch (err) {
                return res.status(401).redirect('/login');
            }
        } else {
            return res.status(401).redirect('/login');
        }
    }
};
module.exports = checkToken;