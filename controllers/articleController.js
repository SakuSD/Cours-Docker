const Article = require('../models/Article')
const QueryFeatures = require('../utils/queryFeatures')


// CREATE
async function createArticle(req, res) {
    try {
        // Je récupère le contenu de ma requête
        const {titre, contenu, auteur, categorie} = req.body;

        // J'instancie mon article
        const article = new Article({
            titre,
            contenu,
            auteur,
            categorie,
        })

        articleSauvegarde = await article.save()

        res.status(201).json({
            success: true,
            message: 'Article créé avec success',
            data: articleSauvegarde
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            })
        }

        res.status(500).json({
            success: false,
            message: 'Erreur coté serveur',
            error: error.message
        })}

}

// READ
const getAllArticles = async (req, res) => {
    try {
        // Récupérer tous les articles, triés par date de création (plus récent en premier)
        // const articles = await Article.find().sort({ createdAt: -1 });
        const totalCount = await Article.countDocuments()

        const features = new QueryFeatures(Article.find(), req.query)
            .filter()
            .search()
            .sort()
            .limitFields()
            .paginate();

        const articles = await features.query

        const paginationInfo = features.getPaginationInfo(totalCount)

        const response = {
            success: true,
            count: articles.length,
            totalCount: totalCount,
            data: articles,
            // pagination?
        }

        if (paginationInfo) {
            response.pagination = paginationInfo
        }

        // Retourner les articles avec leur nombre
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des articles',
            error: error.message
        });
    }
};


const getArticleById = async (req, res) => {
    try {
        // Récupérer l'ID depuis les paramètres de l'URL
        const { id } = req.params;

        // Chercher l'article par ID
        const article = await Article.findById(id);

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        // Incrémenter le nombre de vues
        await article.incrementerVues();

        // Retourner l'article
        res.status(200).json({
            success: true,
            data: article
        });

    } catch (error) {
        // Erreur si l'ID n'est pas au bon format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID d\'article invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'article',
            error: error.message
        });
    }
};


// UPDATE
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Chercher et mettre à jour l'article
        // { new: true } retourne le document mis à jour
        // { runValidators: true } exécute les validations du schéma
        const article = await Article.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,              // Retourne le document modifié
                runValidators: true     // Exécute les validations
            }
        );

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article mis à jour avec succès',
            data: article
        });

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID d\'article invalide'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error.message
        });
    }
};
// DELETE

const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Chercher et supprimer l'article
        const article = await Article.findByIdAndDelete(id);

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article supprimé avec succès',
            data: article
        });

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID d\'article invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
            error: error.message
        });
    }
};



const getPublishedArticles = async (req, res) => {
    try {
        // Utiliser la méthode statique du modèle
        const articles = await Article.findPublies();

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des articles publiés',
            error: error.message
        });
    }
};


const publishArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Trouver l'article
        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        // Utiliser la méthode d'instance pour publier
        await article.publier();

        res.status(200).json({
            success: true,
            message: 'Article publié avec succès',
            data: article
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la publication',
            error: error.message
        });
    }
};






module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getPublishedArticles,
    publishArticle
};

