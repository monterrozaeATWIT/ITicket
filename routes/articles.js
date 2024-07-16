const express = require('express');
const Article = require('../models/article');

const router = express.Router();

// View all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Form to create a new article
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() });
});

// Create a new article
router.post('/', async (req, res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    await article.save();
    res.redirect('/articles');
  } catch (err) {
    console.error('Error creating article:', err);
    res.render('articles/new', { article, errorMessage: 'Error creating article' });
  }
});

// Search for articles
router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const articles = await Article.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { content: new RegExp(query, 'i') }
            ]
        }).sort({ createdAt: 'desc' });
        res.render('articles/index', { articles });
    } catch (err) {
        console.error('Error searching articles:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
