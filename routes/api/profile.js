const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route    GET api/profile/me
//@desc     Get current users profile
//@access   Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile for this user'
            });
        }

        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    POST api/profile
//@desc     Create or Update user profile
//@access   Private

router.post('/', [auth, [
        check('status', 'Status is required').not().isEmpty(),

    ]], async (req, res) => {
        const errors = validationResult(req);
        //if there are errors, return response with errors
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }


        const {
            user,
            university,
            fieldofstudy,
            location,
            status,
            bio
        } = req.body;

        //Build profile object
        const profileFields = {};
        //get the user from token
        profileFields.user = req.user.id;
        //build object with req.body
        if (university) profileFields.university = university;
        if (fieldofstudy) profileFields.fieldofstudy = fieldofstudy;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (bio) profileFields.bio = bio;

        try {
            //find profile by user using req.user.id from token
            let profile = await Profile.findOne({
                user: req.user.id
            });

            if (profile) {
                //update, set profile fields
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                });

                //return entire profile
                return res.json(profile);

            }

            //if not found, create it
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);


        } catch (err) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }

);

module.exports = router;