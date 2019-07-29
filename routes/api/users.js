const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {
    check,
    validationResult
} = require('express-validator/check');

const User = require('../../models/User');

//@route    POST api/user
//@desc     Register user
//@access   Public

router.post('/', [
        check('name', 'Name is required')
        .not()
        .isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({
            min: 6
        })
    ],
    async (req, res) => {

        const errors = validationResult(req);
        //if there are errors
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            name,
            email,
            password
        } = req.body

        try {

            let user = await User.findOne({
                email
            });

            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                });
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //creates the salt for encryption
            const salt = await bcrypt.genSalt(10);

            //takes const salt and uses to create password
            user.password = await bcrypt.hash(password, salt);

            //Saves user to the database
            await user.save();

            //Encrypt password with bcrypt

            //Return jsonwebtoken


            res.send('User Registered');

        } catch (err) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }

    });

module.exports = router;