// imports

const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');


// spin up server
const server = require('http').createServer(app);

// routes
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');

// extra headers
app.use(helmet());

// file compression
app.use(compression());

// port
const PORT = process.env.PORT || 8080;

// parsers
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'})); // x-www-form-urlencoded
app.use(bodyParser.json({limit: '50mb'})); // application/json

// cors
app.use(cors());

// route files
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

// error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ATLAS_SERVER}/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.then(result => {
    server.listen(PORT, () => {
        console.log('Server started...');
    });
}).catch(err => {
    console.log(err);
});