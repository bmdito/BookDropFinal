const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');


//@route    POST api/posts
//@desc     Create a post
//@access   Private

router.post('/', [auth, [
        check('title', 'Title is required').not().isEmpty(),
        check('author', 'Author is required').not().isEmpty(),
        check('price', 'Price is Required').not().isEmpty()

    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {

            //use req.user.id to find user because we have the token. .select -password makes it so it does not send back password
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                title: req.body.title,
                author: req.body.author,
                course: req.body.course,
                description: req.body.description,
                price: req.body.price,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();
            //add post get back in response
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }


    });

//@route    GET api/posts
//@desc     Get all posts
//@access   Private

router.get('/', auth, async (req, res) => {
    try {
        const post = await Post.find().sort({
            date: -1
        });
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    GET api/posts/:id
//@desc     Get post by ID
//@access   Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                msg: 'Post not found'
            })
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post not found'
            })
        }
        res.status(500).send('Server Error')
    }
});

//@route    DELETE api/posts/:id
//@desc     Delete a post 
//@access   Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if it is correct user deleting post
        //use toString method because req.user.id is string and post.user is an object
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'User not authorized'
            });
        }
        await post.remove();

        res.json({
            msg: 'Post removed'
        });

    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post not found'
            })
        }
        res.status(500).send('Server Error')
    }
});

module.exports = router;