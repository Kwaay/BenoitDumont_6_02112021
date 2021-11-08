const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken =  jwt.verify(token, 'V6RaZg53kb%LrWft47QPXwYu48cy@peeN5DaSMLpgLHq2W*MTCp5m6LB#Y5HrMY7hPm#!C@W&fK@9P88H&vp2$FqcaGsj!&s56eebiNfKE^bpAbCbW*4gzPbU&GLnTBz');
        const userId =  decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
   } catch (error) {
       res.status(401).json({ error: error | 'Requête non authentifiée !'});
   }
}