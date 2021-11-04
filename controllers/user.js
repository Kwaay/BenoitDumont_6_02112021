const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req,res,next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message:'Utilisateur créé'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req,res,next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect'});
            }
            res.status(200).json({
                userId : user._id,
                token: jwt.sign(
                    {userId : user._id},
                    'V6RaZg53kb%LrWft47QPXwYu48cy@peeN5DaSMLpgLHq2W*MTCp5m6LB#Y5HrMY7hPm#!C@W&fK@9P88H&vp2$FqcaGsj!&s56eebiNfKE^bpAbCbW*4gzPbU&GLnTBz',
                    {expiresIn: '24h'}
                )  
            });
        })
        .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}))
};