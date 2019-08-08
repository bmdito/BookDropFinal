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

//@route    GET api/profile
//@desc     Get all profiles
//@access   Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find({}).populate('user', ['name', 'avatar']);

        res.json(profiles);

    } catch (err) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

//@route    DELETE api/profile
//@desc     Delete profile, user & posts
//@access   Private

router.delete('/', auth, async (req, res) => {
    try {
        // var not needed not getting anything
        //Remove profile
        //@todo remove user posts
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        //Removes User
        await User.findOneAndRemove({
            _id: req.user.id
        });

        res.json({
            msg: 'User removed'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    GET api/profile/user/:user_id
//@desc     Get all profiles
//@access   Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({
            msg: 'There is no profile for this user'
        });

        res.json(profile);

    } catch (err) {
        console.error(err.message);

        // if equal to Object id (type of error)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not found'
            });
        }
        res.status(500).send('Server Error')
    }
});

module.exports = router;