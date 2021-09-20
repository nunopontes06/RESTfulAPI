const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const verAuth = require('../auth/check-auth');

//  Permite ajustar sobre como os ficheiros sao guardados

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
      }
    });

// Esta funcao permite filtrar os ficheiros carregados e apenas guarda se forem ou jpeg ou png

const fileFilter = (req, file, cb) => {
    //  Regeitar ou aceitar um ficheiro
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }      
};

const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Evento = require('../models/evento');

/*Esta funcao fica responsavel por receber requests atraves do metodo GET
No contexto em questao retorna todos os eventos introduzidos na base de dados*/ 

router.get('/', (req, res, next) =>{
    Evento.find()
    .select('name price _id eventoImagem')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length, 
            eventos: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    eventoImagem: doc.eventoImagem,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/eventos/' + doc._id
                    }
                }
            })
        };

//       if(docs.length >= 0){
            res.status(200).json(response);
//      }else{
//          res.status(404).json({
//              message: 'Nao foram encontrados registos'
//          });
//       }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

/*Esta funcao fica encarrege por receber requests atraves do metodo POST
Essencialmente permite criar os eventos atraves do metodo referido
o parametro upload é corrido e basicamente permite carregar a imagem nesta funcao e metodo POST*/ 

router.post('/', verAuth, upload.single('eventoImagem'), (req, res, next) =>{
    //console.log(req.file);
    const evento = new Evento({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        eventoImagem: req.file.path
    });
    evento
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Evento criado com sucesso',
            createdEvento: {
                name: result.name,
                price: result.price,
                _id: result.id,
                request: {
                    type: 'GET', 
                    url: 'http://localhost:3000/eventos/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

/*Obter informacao sobre apenas 1 evento
Extrai a informacao de um id em especifico ou seja o id e especial*/

router.get('/:eventoId', (req, res, next) =>{
    const id = req.params.eventoId;
    Evento.findById(id)
    .select('name price _id eventoImagem')
    .exec()
    .then(doc => {
        console.log("Obtido através da base de dados", doc);
        if (doc) {
            res.status(200).json({
                evento: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/eventos'
                }
            })
        } else{
            res.status(404).json({
                message: 'Nao existe informacao para o ID'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

/**O metodo PATCH permite alterar requests 
 * a variavel updateOps basicamente significa operacoes update
 * ou seja as operacoes sao basicamente os id escolhidos que serao posteriormente alterados
*/

router.patch('/:eventoId', verAuth, (req, res, next) =>{
  const id = req.params.eventoId;
  const updateOps = {};
  for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
  }
  Evento.update({_id: id}, {$set: updateOps})
  .exec()
  .then(result => {
      res.status(200).json({
          message: 'Evento atualizado',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/eventos/' + id
          }

      })
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});

/**O metodo DELETE permite eleminar eventos previamente criados
 * Adicionalmene mostra o que deve ser feito depois de se eleminar um evento no request
*/

router.delete('/:eventoId', verAuth, (req, res, next) =>{
  const id = req.params.eventoId;
  Evento.remove({_id: id})
  .exec()
  .then(result => {
      res.status(200).json({
          message: 'Evento eliminado',
          request: {
                type: 'POST',
                url: 'http://localhost:3000/eventos', 
                body: {name: 'String', price: 'Number'}

          }
      });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      })
  });
});

module.exports = router;