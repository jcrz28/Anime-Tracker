const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const animeSchema = new Schema ({
    title:{type: String, required: true, unique: true},
    images: {
        jpg:{
            image_url:{type: String, required: true}
        }
    },
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})
animeSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Anime', animeSchema);