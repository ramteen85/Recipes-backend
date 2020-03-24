// imports
// need to create and declare recipe model
const moment = require('moment-timezone');
const Recipe = require('../models/recipe');

exports.saveRecipes = async(req, res, next) => {
    try {

        // delete all records
        await Recipe.deleteMany({});

        // grab each recipe from the body
        let recipe;
        for(let x = 0; x < req.body.length; x++) {
            console.log(req.body[x]);
            // save it into the database

            // create new recipe records
            recipe = new Recipe({
                name: req.body[x].name,
                description: req.body[x].description,
                imagePath: req.body[x].imagePath,
                ingredients: req.body[x].ingredients,
                createdAt: moment.tz(Date.now(), 'Australia/Sydney')
            });

            await recipe.save();

        }

        res.status(200).json({
            message: 'recipes saved successfully!'
        });

    }
    catch(err) {
        console.log(err);
        err.message = 'unable to save recipes...';
        err.statusCode = 500;
        next(err);
    }
}

exports.getRecipes = async(req, res, next) => {
    try {

        // fetch token from header
        // console.log(req.headers.token);

        // get all recipes
        let recipes = await Recipe.find({});

        // return recipes
        res.status(200).json({
            recipes: recipes
        });

    }
    catch(err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'could not get recipes...';
        next(err);
    }
}