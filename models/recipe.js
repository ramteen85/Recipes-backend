const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');
const timezone = require('mongoose-timezone');

// recipe schema
const recipeSchema = new Schema({
    creator: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    ingredients: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
        }
    ],
    picVersion: {
        type: String,
        default: ''
    },
    picId: {
        type: String,
        default: ''
    },
    image: {
        imgId: {
            type: String,
            default: ''
        },
        imgVersion: {
            type: String,
            default: ''
        }
    },
    createdAt: {
        type: Date,
        default: moment.tz(Date.now(), 'Australia/Sydney')
    }
});


// timezone plugin
recipeSchema.plugin(timezone, { paths: ['date', 'createdAt'] });

module.exports = mongoose.model('Recipe', recipeSchema);