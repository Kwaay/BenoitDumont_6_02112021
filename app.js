const express = require('express');
const mongoose = require('mongoose');

const UserRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://kwaay:RCptiDpAszhEbEaO@p6-piiquante.jwozi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('✅ Connexion à MongoDB '))
  .catch(() => console.log('❌ Connexion à MongoDB '));

const app = express();

app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
next();
});
app.use(express.json());

app.use('/api/auth', UserRoutes)
module.exports = app;