const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser(process.env.SALT_COOKIES));
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine','ejs');

module.exports = app;   