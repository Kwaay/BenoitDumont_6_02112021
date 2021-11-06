const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const regexEmail = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
const regexPassword = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;

exports.signup = async (req,res,next) => {
    const emailExist = User.findOne({ email: req.body.email })
    if (emailExist) {
        return res.status(400).json({ error: 'Email déjà utilisé'});
    }
    else if (!regexEmail.test(req.body.email) && (!regexPassword.test(req.body.password))) {
        return res.status(400).json({ error: 'Email ou Password non valide'});
    }
    else {
        try {
            const hash = await bcrypt.hash(password, 10)
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
        return res.status(400).json({ error: 'Email ou Password non valide'});
    }
    else {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé'});
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