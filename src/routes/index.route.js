const register = require('./sub-routes/register.route');
const login = require('./sub-routes/login.route');
const index = require('../app/controllers/Index.controller');

const auth = require('../app/middlewares/auth.midlleware');

const route = function (app) {
    app.use('/register', register);
    app.use('/login', login);
    app.get('/', auth, index.main);
}
module.exports = route;