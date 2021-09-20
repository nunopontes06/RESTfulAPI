const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');

const Utilizador = require('../models/utilizador');

//  Funcao encarregue do registo de utilizadores

router.post('/signup', (req, res, next) => {

    Utilizador.find({email: req.body.email})
    .exec()
    .then(utilizador => {
        if (utilizador.length >= 1) {
            return res.status(409).json({
                message: 'E-mail já existe'
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else{
                    const utilizador = new Utilizador({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        //  Permite adicionar uma string ao hash da password essencialmente torna a password dificil de descobrir
                        password: hash
                    });
                    utilizador
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Utilizador criado'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                          error: err
                        });
                    });
                }
            }); 
        }
    })

    
});

//  Responsavel pelo login dos utilizadores | Essencialmente verifica se o email e password corresponde com algum utilizador na BD caso contrario erro

router.post('/login', (req, res, next) => {
    Utilizador.find({email: req.body.email})
    .exec()
    .then(utilizador => {
        if(utilizador.length < 1){
            return res.status(401).json({
                message: 'Autenticacao falhou'
            });
        }

        bcrypt.compare(req.body.password, utilizador[0].password, (err, result) =>{
                if(err ){
                    return res.status(401).json({
                        message: 'Autenticacao falhou'
                    });
                }

                if (result){
                    const tk = token.sign({
                        email: utilizador[0].email,
                        utilizadorId: utilizador[0]._id
                    }, 
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "1h"

                    }                     
                );
                    return res.status(200).json({
                        message: 'Autenticacao com sucesso',
                        tk: tk
                    });
                }
                res.status(401).json({
                    message: 'Autenticacao falhou'
                });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//  Permite eliminar utilizador por Id

router.delete('/:utilizadorId', (req, res, next) =>{
    Utilizador.remove({_id: req.params.utilizadorId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Utilizador eliminado'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;