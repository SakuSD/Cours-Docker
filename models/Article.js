const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
    minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],

  },
  
  contenu: {
    type: String,
    required: [true, 'Le contenu est obligatoire'],
    trim: true,
    minlength: [10, 'Le contenu doit contenir au moins 10 caractères'],
    maxlength: [2000, 'Le contenu ne peut pas dépasser 2000 caractères'],
  },

  auteur: {
    type: String,
    required: [true, 'L\'auteur est obligatoire'],
    trim: true,
  },
  publie: {
    type: Boolean,
    default: false,
  },

  categories: {
    type: String,
    trim: true,
    enum: {
      values: ['Technologie', 'Santé', 'Voyage', 'Éducation', 'Divertissement'],
      message: 'La catégorie `{VALUE}` n\'est pas valide',
    },
  },

  vue: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de vues ne peut pas être négatif'],
  },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
