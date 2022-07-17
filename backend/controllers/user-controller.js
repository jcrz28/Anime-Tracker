require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/user');
const Anime = require('../models/anime');
const HttpError = require('../models/http-error');

// http://localhost:5000/auth/signup
const signup = async (req, res, next) =>{
    const errors = validationResult(req);
    let existingUser, hashedPassword, token;

    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs. Please check your data.', 500);
        return next(error);
    }

    const {email, password, confirm_password} = req.body;
    
    if (password !== confirm_password) {
        const error = new HttpError('Password did not match. Please try again.', 401);
        return next (error);
    }
    try{
        existingUser = await User.findOne({email:email})
    }catch(err){
        const error = new HttpError('Signing up failed. Please try again later', 500);
        return next (error);
    }

    if (existingUser) {
        const error = new HttpError('User exists already. Please login instead', 422);
        return next(error);
    }

    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        const error = new HttpError('Could not create user. Please try again', 500);
        return next(error);
    }
    // second parameter salts the length of hash password
    const createdUser = new User({
        email,
        password: hashedPassword
    })

    try{
        await createdUser.save();
    }catch (err){
        const error = new HttpError('Signing up failed', 500);
        return next (error);
    }

    try{
        token = jwt.sign(
            {userId: createdUser.id}, 
            process.env.SECRET_KEY, 
            {expiresIn: '1h'});
    }catch (err){
        const error = new HttpError('Signing up failed', 500);
        return next (error);
    }
    
    res.status(201).json({
        userId: createdUser.id,
        email:createdUser.email,
        token: token});
}

// http://localhost:5000/auth/login
const login = async (req, res, next) =>{
    const {email, password} = req.body;
    let existingUser, token;
    let isValidPassword = false;

    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again later.',500);
        return next(error);
    }

    if(!existingUser){
        const error = new HttpError('Invalid credentials.', 401);
        return next(error);
    }

    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    }catch (err){
        const error = new HttpError('Could not log you in. Please check your credentials and try again.', 500);
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError('Invalid credentials.', 401);
        return next(error);
    }

    try{
        token = jwt.sign(
            {userId: existingUser.id}, 
            process.env.SECRET_KEY, 
            {expiresIn: '1h'});
    }catch (err){
        const error = new HttpError('Logging in failed', 500);
        return next (error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    })
}

const unsubscribe = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser, anime;
    let isValidPassword = false;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Unsubscribing failed. Please try again later.',500);
        return next(error);
    }

    if(!existingUser){
        const error = new HttpError('Invalid credentials.', 401);
        return next(error);
    }

    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    }catch (err){
        const error = new HttpError('Unsubscribing failed. Please try again later.',500);
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError('Invalid credentials.', 401);
        return next(error);
    }

    // Deletes all anime lists by the user
    try {
        anime = await Anime.find({creator: existingUser}).deleteMany();
    }catch (err) {
        const error = new HttpError('Could not fetch anime lists. Please try again later.',500);
        return next(error);
    }
    
    // Deletes the user 
    try{
        existingUser.remove();
    }catch (err){
        const error = new HttpError('Could not unsubscribe user. Please try again later.',500);
        return next(error);
    }
    res.status(200).json({message: "User Deleted."})
}

exports.signup = signup;
exports.login = login;
exports.unsubscribe = unsubscribe;