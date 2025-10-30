const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        contenu: {
            type: String,
            required: [true, 'Le contenu du commentaire est obligatoire'],
            trim: true,
            minlength: [2, 'Le contenu doit contenir au moins 2 caractères'],
            maxlength: [500, 'Le contenu ne peut pas dépasser 500 caractères']

        },

        auteur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Le contenu du commentaire est obligatoire'],
            minlength: [2, 'Le contenu doit contenir au moins 2 caractères'],
            maxlength: [500, 'Le contenu ne peut pas dépasser 500 caractères']

        },

        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: [true, 'Le commentaire doit être associé à un article']
        },

        email: {
            type: String,
            required: [true, 'L\'email est obligatoire'],
            trim: true,
            lowercase: true,
            match: [/.+\@.+\..+/, 'Veuillez fournir une adresse email valide']
        },

        approuve: {
            type: Boolean,
            default: false
        },

        signale: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        toJSON: {
           virtual: true,
            }
        }
    
);

commentSchema.methode.approuver = function() {
    this.approuve = true;
    return this.save();
};

commentSchema.methode.signaler = function() {
    this.signale = true;
    return this.save();
};

commentSchema.methode.desapprouver = function() {
    this.approuve = false;
    return this.save();
}

commentSchema.methode.designaler = function() {
    this.signale = false;
    return this.save();
};


module.exports = mongoose.model('Comment', commentSchema);
