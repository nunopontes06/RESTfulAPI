const mongoose = require('mongoose');

//  Criei a relacao necessaria 'ref' para relacionar os eventos com as reservas


const reservaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento', required: true},
    quantity: { type: Number, default: 1 }

});

module.exports = mongoose.model('Reserva', reservaSchema);