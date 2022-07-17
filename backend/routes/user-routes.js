const express = require('express');
const {check} = require('express-validator');

const router = express.Router();
const userControllers = require('../controllers/user-controller');

router.post(
    '/signup', 
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min : 6}),
        check('confirm_password').isLength({min : 6})
    ],
    userControllers.signup);
    
router.post('/login', userControllers.login);
router.delete('/unsubscribe', userControllers.unsubscribe);

module.exports = router;