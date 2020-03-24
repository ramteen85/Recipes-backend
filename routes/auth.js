const express = require('express');

const authController = require('../controllers/auth');
const router = express.Router();

// login
router.post('/login', authController.login);

// register
router.post('/register', authController.register);

//exports
module.exports = router;