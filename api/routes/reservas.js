const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verAuth = require('../auth/check-auth');

const Reserva = require('../models/reserva');
const Evento = require('../models/evento');

/** Permite obter todas as reservas efetuadas que se encontram na base de dados
 * E ao fazer justamente isso apenas seleciona os campos que foram mencionados no comando select
*/
router.get('/', (req, res, next) => {
    Reserva.find()
    .select('evento quantity _id')
    .populate('evento', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            reservas: docs.map(doc => {
                return {
                    _id: doc._id,
                    evento: doc.evento,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/reservas/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

/**Permite criar as reservas... atribuindo um ID unico a cada reserva 
 * e posteriormente um ID de evento a essa reserva
*/

router.post("/", verAuth, (req, res, next) => {
   
    // Verifica se o evento existe e so depois e que cria

  Evento.findById(req.body.eventoId)
    .then(Evento => {
      if (!Evento) {
        return res.status(404).json({
          message: "Evento nao encontrado"
        });
      }
      const reserva = new Reserva({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        evento: req.body.eventoId,
      });
      return reserva.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Reserva guardada",
        createdReserva: {
          _id: result._id,
          evento: result.evento,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/reservas/" + result._id
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

/**Permite obter a informacao de uma reserva individual atraves de /reservas/id */
router.get('/:reservaId', (req, res, next) => {
    Reserva.findById(req.params.reservaId)
    .populate('evento')
    .exec()
    .then(reserva =>{
        if(!reserva){
            return res.status(404).json({
                message: 'Reserva nao encontrada'
            });
        }
        res.status(200).json({
            reserva: reserva, 
            request: {
                    type: 'GET',
                    url: 'http://localhost:3000/reservas/' 
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

/**Permite eleminar uma reserva atraves da selecao do id no url das /reservas/id */
router.delete('/:reservaId', verAuth, (req, res, next) => {
   Reserva.remove({_id: req.params.reservaId })
   .exec()
   .then(result => {
    res.status(200).json({
        message: 'Reserva eliminada',
        request: {
                type: 'POST',
                url: 'http://localhost:3000/reservas/',
                body: {
                    eventoId: 'ID', quantity: 'Number'}
        }
    });

   })
   .catch(err => {
    res.status(500).json({
        error: err
    });
});
});

module.exports = router;