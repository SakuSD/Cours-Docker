const express = require('express')
const routes = express.Router()


const {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getPublishedArticles,
    publishArticle
} = require('../controllers/articleController');


routes.get('/',  getAllArticles)

routes.get('/publies', getPublishedArticles)

routes.get('/:id', getArticleById)

routes.post('/', createArticle)

routes.put('/:id', updateArticle)

routes.delete('/:id', deleteArticle)

routes.patch('/:id/publier', publishArticle)





module.exports = routes


