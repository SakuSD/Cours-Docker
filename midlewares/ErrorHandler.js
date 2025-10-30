const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }   

    next();
};


function handleCastError(err) {
    const message = ` ${err.path} invalide: ${err.value}.`;
    return new AppError(message, 400);
}


function handleValidationError(err) {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Donnée Invalides. ${errors.join('. ')}`;
    return new AppError(message, 400);
}



function handleDuplicateFieldsError(err) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Donnée dupliquée : ${value}. Veuillez utiliser une autre valeur !`;
    return new AppError(message, 400);
}

function sendErrorDev(err, res) {
    res.status(err.statusCode).json({
        sucess: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        details: err.errors || null
    });

}

function sendErrorProd(err) {

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message || 'Une erreur est survenue. Veuillez réessayer plus tard.'
    });

}

function errorHandler(){

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //Environnement de développement
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;

        // Erreurs spécifiques de Mongoose
        if (error.name === 'CastError') error = handleCastError(error);
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if (error.code === 11000) error = handleDuplicateFieldsError(error);
        sendErrorProd(error, res);
    }

}function notFound(req, res, next){
    const error = new AppError(`La ressource ${req.originalUrl} n'a pas été trouvée sur ce serveur.`, 404);
    next(error);
}

function catchAsync(fn){
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }   
}

