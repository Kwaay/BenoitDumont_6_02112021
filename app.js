const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://kwaay:RCptiDpAszhEbEaO@p6-piiquante.jwozi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('✅ Connexion à MongoDB '))
  .catch(() => console.log('❌ Connexion à MongoDB '));

app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
next();
});
app.use(express.json());

app.use((req,res) => {
    res.json({ message : "Votre requête a bien été reçue"})
})
module.exports = app;