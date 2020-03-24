const express = require('express');

const recipesController = require('../controllers/recipe');
const router = express.Router();

// save recipes
router.put('/save', recipesController.saveRecipes);

// get recipes
router.get('/get', recipesController.getRecipes);

//exports
module.exports = router;