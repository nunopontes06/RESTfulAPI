const mongoose = require('mongoose');

//  Basicamente é o design que pretendo que cada evento tenha e posteriormente o required apenas permite que a request seja feita
// se as condicoes expressas forem cumpridas

const eventoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    eventoImagem: { type: String, required: true}

});

module.exports = mongoose.model('Evento', eventoSchema);