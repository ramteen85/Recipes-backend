const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

verifyToken = (token, key) => {
    try {
        return jwt.verify(token, key);
    } catch (e) {
        return e;
    }
}

exports.register = async(req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const nickname = req.body.nickname;
        if(nickname === '') {
            nickname = 'Anonymous Chef'
        }


        // make sure user does not exist
        let check = await User.findOne({email:email});

        if(check) {
            const error = new Error('User already exists!');
            error.message = 'User already exists!';
            error.statusCode = 400;
            throw error;
        }

        // hash the password
        const hashedPw = await bcrypt.hash(password, 12);


        // create new user
        const user = new User({
            email: email,
            password: hashedPw,
            nickname: nickname,
            recipeList: [],
            createdAt: moment.tz(Date.now(), 'Australia/Sydney')
        });


        // save new user
        await user.save();


        // create auth token
        const token = jwt.sign({
            email: user.email,
            nickname: user.nickname,
            userId: user._id.toString()
        },
            `${process.env.SECRET_KEY}`,
            { expiresIn: '24h' }
        );


        // send the token back to the user with id
        res.status(201).json({
            message: 'User created!',
            email: user.email,
            userId: user._id.toString(),
            nickname: user.nickname,
            token: token
        });
    } catch(err) {
        next(err);
    }
}

exports.login = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    try {
        let user = await User.findOne({email:email});

        if(!user) {
            const error = new Error('Invalid Username / Password');
            error.statusCode = 401;
            throw error;
        }

        loadedUser = user;

        let isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            const error = new Error('Invalid Username / Password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            email: loadedUser.email,
            nickname: loadedUser.nickname,
            userId: loadedUser._id.toString()
        },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token: token,
            userId: loadedUser._id.toString(),
            email: loadedUser.email,
            nickname: loadedUser.nickname
        });


    }
    catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
}
