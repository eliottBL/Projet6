const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://eliott:eliott@clustermvg.yghy6ec.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMVG',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res) => {
    res.json({ message: 'votre requête à bient été prise en compte' });
});

module.exports = app;