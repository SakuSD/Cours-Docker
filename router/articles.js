const express = require('express');
const router = express.Router();
const ArticleControlleurs = require('../controllers/ArticleControlleurs');

router.post('/', ArticleControlleurs.creerArticle);
router.get('/', ArticleControlleurs.getAllArticles);
router.get('/:id', ArticleControlleurs.getArticleById);

module.exports = router;
