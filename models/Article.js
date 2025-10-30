const { kMaxLength } = require('buffer')
const mongoose = require('mongoose')

const articleSchema = mongoose.Schema(
    {
        titre: {
            type: String,
            required: [true, 'le titre est obligatoire'],
            trim: true,
            minlength: [
                3,
                'Le titre doit contenir au moins trois caractères'
            ],
            maxlength: [200, 'le titre ne peut pas dépasser 200 caractères']
        
        },

        contenu: {
            type: String,
            required: [true, 'Le contenu est obligatoire'],
            trim: true,
            minlength: [10, 'Le contenu doit contenir au moins 10 caractères']
        },

        auteur: {
            type: String,
            required: [true, 'L\'auteur est obligatoire'],
            trim: true,
            maxlength: [100, 'Le nom de l\'auteur ne peut pas dépasser 100 caractères']
        },

        publie: {
            type: Boolean,
            default: false
        },

        categorie: {
            type: String,
            trim: true,
            enum: {
                values: ['Technologie', 'Lifestyle', 'Voyage', 'Cuisine', 'Autre'],
                message: '{VALUE} n\'est pas une catégorie valide'
            }
        },

        vues: {
            type: Number,
            default: 0,
            min: [0, 'Le nombre de vues ne peut pas être négatif']
        },

        
    },
    {
        timestamps: true,
        toJSON: {
            transform: function(doc, ret) {
                delete ret.__v;
                return ret;
            }
        }
    }
)


// methods.js

articleSchema.methods.publier = function() {
    this.publie = true
    return this.save();
}

articleSchema.methods.depublier = function() {
    this.publie = false;
    return this.save()
}

articleSchema.methods.incrementerVues = function() {
    this.vues += 1;
    return this.save()
 }


//  statics.js

articleSchema.statics.findPublies = function() {
    return this.find({ publie: true }).sort({ createdAt: -1 });
};

articleSchema.statics.findByCategorie = function(categorie) {
    return this.find({ categorie, publie: true }).sort({ createdAt: -1 });
};





// virtuals.js

articleSchema.virtual('resume').get(function() {
    if (this.contenu.length <= 150) {
        return this.contenu;
    }
    return this.contenu.substring(0, 150) + '...';
});

const Article = mongoose.model('Article', articleSchema)

module.exports = Article