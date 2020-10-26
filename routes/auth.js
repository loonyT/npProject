const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth'); //bringin the middleware.... 
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');

const User = require('../../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => { //here we're adding the middleware as a second parameter, then you can try the get request on postman by sending it which will send "no token auth"
    try {
        const user = await User.findById(req.user.id).select('-password'); //we take our user model to access it from anywhere + select will leave off the pwd in the datas
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error'); // in the react app were gonna constantly make a request with the token and fill the redux state of the value of the user
    }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            email,
            password
        } = req.body;

        try {
            let user = await User.findOne({ // check to see if there is not a user 
                email
            });

            if (!user) {
                return res
                    .status(400)
                    .json({
                        errors: [{
                            msg: 'Invalid Credentials' //sending an array with the message 
                        }]
                    });
            }

            const isMatch = await bcrypt.compare(password, user.password); //pwd is the plain text the user entered, user.pwd is to check if the pwd are matching wich database

            if (!isMatch) { //checking the match ... 
                return res
                    .status(400)
                    .json({
                        errors: [{
                            msg: 'Invalid Credentials'
                        }]
                    });
            }

            const payload = {
                user: {
                    id: user.id //setting the id of the user 
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'), {
                    expiresIn: '5 days'
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;