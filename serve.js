// Importation d'express
const express = require('express');

//Initialiser mon application
const app = express();

const PORT = process.env.PORT || 3000;

//Définir un routeur pour la racine
app.get('/', (req, res) => {
    res.json({
         message: 'Hello World from Dockerized Express App!' }); $(PORT)
    });

//Lancer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});