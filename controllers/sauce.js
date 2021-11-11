const Sauce = require('../models/sauce');
const fs = require('fs');
const fsp = require('fs/promises');
const { deleteOne } = require('../models/sauce');

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
        let sauceObject = {}
        if(req.file) {
            sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            const sauce = await Sauce.findOne({ _id: req.params.id })
            const filename = sauce.imageUrl.split('/images/')[1];
            await fsp.unlink('./images/' + filename)
        }
        else {
           sauceObject = { ...req.body }
        }
        const updateSauce = await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id : req.params.id })
        if (updateSauce) {
            return res.status(200).json({ message : 'Objet modifié !'})
        }
    }
    catch (error) {
        res.status(400).json({error})
    }
};

exports.deleteSauce = async (req, res) => {  
    const sauce = await Sauce.findOne({ _id: req.params.id })
    .catch (() => {
        res.status(404).json({ message: 'Sauce non existante'})
    });
    const filename = sauce.imageUrl.split('/images/')[1];
    await fsp.unlink('./images/' + filename)
    const deleteSauce = await Sauce.deleteOne({_id: req.params.id})
    .catch (() => {
        res.status(400).json({error});
    });
    if(deleteSauce) {
        return res.status(200).json({ message : 'Objet supprimé avec succès'}) 
    }
};

exports.likeSauce = (req, res) => {
    
};