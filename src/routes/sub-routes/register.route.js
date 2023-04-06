const express = require('express');
const router = express.Router();

const register = require('../../app/controllers/Register.controller');

router.get('/', register.index);
router.post('/', register.register);

module.exports = router;