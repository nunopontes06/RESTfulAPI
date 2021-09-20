// Inclui a dependencia para jsonwebtoken

const tok = require('jsonwebtoken');

//  Verifica se o utilizar esta autenticado ou nao

module.exports = (req, res, next) => {
    try {

        //  Permite colar o token de login no header do request
        const tokk = req.headers.authorization.split(" ")[1];
        
        const decoded = tok.verify(tokk, process.env.TOKEN_KEY);
        req.utilzadorData = decoded;
        next();
     } catch (error) {
         return res.status (401).json({
             message: 'Autenticacao falhou'
         });
     }

};