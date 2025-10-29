const { config } = require('dotenv');
const Article = require('../models/Article');

// Créer un nouvel article

async function creerArticle(req, res) {
  try {
    const { titre, contenu, auteur, categories } = req.body;

    const nouvelArticle = new Article({
      titre,
      contenu,
      auteur,
      categories,
    });
    const articleEnregistre = await nouvelArticle.save();

    res.status(201).json({
        success: true,
        message: 'Article créé avec succès',
        data: articleEnregistre
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: Object.values(error.errors).map(err => err.message)
      });   
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
}
  return this.contenu.substring(0, 100) + '...';

async function getAllArticles(req, res) {
  try {
    const articles = await Article.find();
    res.status(200).json({
      success: true,
      count : articles.length,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de la récupération des articles',
    });
  }
}

async function getArticleById(req, res) {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        data: article
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'article',
      });
    }
}

  module.exports = {
    creerArticle,
    getAllArticles,
    getArticleById
  };