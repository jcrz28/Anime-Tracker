const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Anime = require('../models/anime');
const User = require('../models/user');

const getAnimesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let userWithAnime;
    try{
        userWithAnime = await User.findById(userId).populate('animes');

    }catch (err){
        const error = new HttpError ('Fetching animes failed.', 500);
        return next(error);
    }
    if(!userWithAnime) {
        const error = new HttpError ('Could not find an anime for user ID.', 404);
        return next(error);
    }

    res.json({animes: userWithAnime.animes.map(anime => anime.toObject({getters: true}))})
}

const addAnime = async (req, res, next) => {
    const errors = validationResult(req);
    let user, existingAnime;

    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid fetch.', 422);
        return next (error);
    }
    const {title, images, creator} = req.body;
    const addedAnime = new Anime ({
        title,
        images,
        creator
    })

    try{
        user = await User.findById(creator);
    }catch (err){
        const error = new HttpError('Adding anime failed.', 500);
        return next (error);
    }

    if(!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    try{
        existingAnime = await Anime.findOne({title:title})
    }catch(err){
        const error = new HttpError('Adding anime failed', 500);
        return next (error);
    }

    if (existingAnime) {
        const error = new HttpError('Anime exists already.', 422);
        return next(error);
    }

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await addedAnime.save({session: session});
        user.animes.push(addedAnime); // 'push' establish connections between database
        await user.save({session: session}); 
        await session.commitTransaction();
    }catch (err){
        const error = new HttpError('Adding anime failed.', 500);
        return next (error);
    }
    res.status(201).json({addedAnime});
}

const deleteAnime = async (req, res, next) => {
    const animeId = req.params.aid;
    let anime;

    try{
        // populate deletes the anime id in user table
        anime = await Anime.findById(animeId).populate('creator');
    }catch (err){
        const error = new HttpError('Something went wrong. Could not delete anime.', 500);
        return next (error);
    }

    if (!anime) {
        const error = new HttpError('Could not find the anime.', 404);
        return next(error);
    }

    // anime.creator is a reference to user table in database
    // Does not allow other users to delete animes from manually using their own token.
    // Does not allow to delete anime through postman without the right token.
    if(anime.creator.id !== req.userId.userId){ // from check-auth.js
        const error =  new HttpError (' You are not allowed to delete this anime.', 403);
        return next(error);
    }

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await anime.remove({session:session});
        anime.creator.animes.pull(anime);
        await anime.creator.save({session:session});
        await session.commitTransaction();
    }catch (err){
        const error = new HttpError('Something went wrong. Could not delete anime.', 500);
        return next (error);
    }
    res.status(200).json({message: "Anime Deleted."})
}

/* 
{
    "title": "Sasuke",
    "images":{
        "jpg": {
                "image_url": "https://cdn.myanimelist.net/images/anime/13/17405.jpg"
            }
        },
        "creator": "u1"
    
}
 */
exports.getAnimesByUserId = getAnimesByUserId;
exports.addAnime = addAnime;
exports.deleteAnime = deleteAnime;