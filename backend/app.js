const express = require('express');

const app = express();

app.use((req, res) => {
    res.json({ message: 'votre requête à bient été prise en compte' });
});

module.exports = app;