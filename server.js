require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

require('./config/database');

const Recipe = require('./models/recipe.js');


const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/recipes/new', (req, res) => {
    res.render('recipes/new.ejs');
});

app.post('/recipes', async (req, res) => {
    await Recipe.create(req.body);
    console.log(req.body);
    res.redirect('/recipes')
});

app.get('/recipes', async (req, res) => {
    const recipes = await Recipe.find();
    res.render('recipes/index.ejs', { recipes })
});

app.get('/recipes/:recipeId', async (req, res, next) => {
    const recipes = await Recipe.findById(req.params.recipeId);
    res.render('recipes/show.ejs', { recipes });
});

app.get('/recipes/:recipeId/edit', async (req, res, next) => {
    const recipes = await Recipe.findById(req.params.recipeId);
    res.render('recipes/edit.ejs', { recipes });
});

app.put('/recipes/:recipeId', async (req, res) => {
    await Recipe.findByIdAndUpdate(req.params.recipeId, req.body);
    res.redirect(`/recipes/${req.params.recipeId}`);
});

app.delete('/recipes/:recipeId', async (req, res) => {
    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.redirect('/recipes');
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});