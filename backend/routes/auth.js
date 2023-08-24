const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Register a new user
router.post(
    '/signup',
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            user = new User({
                name,
                email,
                password,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 }, (error, token) => {
                if (error) throw error;
                res.json({ token });
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
);

// Login a user
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 }, (error, token) => {
                if (error) throw error;
                res.json({ token });
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
);

// Route for Google sign-in
router.post('/googleSignIn', async (req, res) => {
    try {
        console.log(req.body)
        res.json({ message: "Google user" });

        // const { email } = req.body; // Get the email from the request body

        // // Check if the user already exists in your database
        // let user = await User.findOne({ email });

        // // If the user doesn't exist, create a new user
        // if (!user) {
        //     user = new User({
        //         email,
        //         // Set any other necessary fields for the user
        //     });

        //     // Hash the user's password (you can generate a random password)
        //     const salt = await bcrypt.genSalt(10);
        //     user.password = await bcrypt.hash('temporary_password', salt);

        //     // Save the user to the database
        //     await user.save();
        // }

        // // Create a JWT token
        // const payload = {
        //     user: {
        //         id: user.id,
        //     },
        // };

        // jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 }, (error, token) => {
        //     if (error) throw error;
        //     res.json({ token });
        // });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
