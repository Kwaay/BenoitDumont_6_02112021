const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauces = async (_req, res) => {
    try {
        const findAllSauces = await Sauce.find()
        if(findAllSauces) {
             return res.status(200).json(findAllSauces);
        }
    }
    catch (error) {
        res.status(400).json({error});
    }
};

exports.getOneSauce = async (req, res) => {
    try {
        const findOne = await Sauce.findOne({ _id: req.params.id })
        if (findOne) {
            return res.status(200).json(findOne);
        }
    }
    catch (error) {
        res.status(404).json({error});
    }
};

exports.createSauce = async (req, res) => {
    try {
        const sauceObject = await JSON.parse(req.body.sauce)
        delete sauceObject._id;
        const sauce = await new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        const saveSauce = await sauce.save()
        if (saveSauce) {
            return res.status(201).json({message: 'Objet enregistré'});
        }
    }
    catch (error) {
        res.status(400).json({error})
    }
};


exports.modifySauce = async (req,res) => {
    try {
        const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body}
        console.log(sauceObject);
        const updateSauce = await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id : req.params.id })
        if (updateSauce) {
            return res.status(200).json({ message : 'Objet modifié !'})
        }
    }
    catch (error) {
        res.status(400).json({message: 'Erreur de modification'})
    }
};

exports.deleteSauce = (req, res) => {
    
};

exports.likeSauce = (req, res) => {
    
};