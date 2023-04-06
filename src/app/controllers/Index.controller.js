const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');
const User = require('../models/User.model');

class Index {
    main(req, res) {
        console.log('is passed index');
        console.log(req.signedCookies.access_token);
        console.log(req.user_id);
        console.log('1')
        User.findById(req.user_id)
            .then(user => {
                const password = user.password;
                const hashCodeMd5 = cryptojs.MD5(password).toString();
                const hashCodeSha1 = cryptojs.SHA1(password).toString();
                const hashCodeSha256 = cryptojs.SHA256(password).toString();
                const hashCodeSha512 = cryptojs.SHA512(password).toString();
                const hashCodeSha3 = cryptojs.SHA3(password, { outputLength: 512 }).toString();
                res.render('index', {
                    isHome: true,
                    password,
                    hashCodeMd5,
                    hashCodeSha1,
                    hashCodeSha256,
                    hashCodeSha512,
                    hashCodeSha3
                });
            })
            .catch(err => {
                res.send('Invalid token!')
            });
    }    
}
module.exports = new Index();