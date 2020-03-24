const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');
const timezone = require('mongoose-timezone');


// recipe schema
const userSchema = new Schema({
    nickname: {
        type: String,
        default: 'Anonymous Chef',
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    recipeList: [
        {
            recipeId: {type: Schema.ObjectId, ref: "Recipe"},
            imageUrl: { type: String },
            recipeName: { type: String },
            recipeDescription: { type: String },
            ingredients: [
                {
                    name: { type: String },
                    amount: { type: Number },
                }
            ],
            createdAt: { type: Date, default: moment.tz(Date.now(), "Australia/Sydney") }
        },
    ],
    createdAt: {
        type: Date,
        default: moment.tz(Date.now(), "Australia/Sydney")
    }
});

// timezone plugin
userSchema.plugin(timezone, { paths: ['date', 'createdAt'] });

module.exports = mongoose.model('User', userSchema);