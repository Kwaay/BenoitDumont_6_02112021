const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
const regexPassword = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;
// password must contain 1 number (0-9), 1 uppercase letters, 1 lowercase letters, 1 non-alpha numeric number, 8-16 characters with no space



exports.signup = async (req,res,next) => {
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        return res.status(409).json({ message: 'Email déjà utilisé'});
    }
    else if (!regexEmail.test(req.body.email) && (!regexPassword.test(req.body.password))) {
        return res.status(400).json({ message: "Email ou Password n'ont pas le format requis"});
    }
    else {
        try {
            const hash = await bcrypt.hash(req.body.password, 10)
            const user = await new User({
                email: req.body.email,
                password: hash
            });
            await user.save();
            res.status(201).json({ message:'Utilisateur créé'})
        }
        catch (error) {
            res.status(400).json({error});
        };
    };
};   

exports.login = async (req,res,next) => {
    if (!regexEmail.test(req.body.email) && (!regexPassword.test(req.body.password))) {
        return res.status(400).json({ error: "Email ou Password n'ont pas le format requis" });
    }
    else {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé'});
            }
            const valid = await bcrypt.compare(req.body.password, user.password)
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect'});
            }
            else {
                res.status(200).json({
                    userId : user._id,
                    token: jwt.sign(
                        {userId : user._id},
                        'V6RaZg53kb%LrWft47QPXwYu48cy@peeN5DaSMLpgLHq2W*MTCp5m6LB#Y5HrMY7hPm#!C@W&fK@9P88H&vp2$FqcaGsj!&s56eebiNfKE^bpAbCbW*4gzPbU&GLnTBz',
                        {expiresIn: '24h'}
                    )  
                });
            }
        }
        catch (error) {
            res.status(500).json({error})
        }
    }
};