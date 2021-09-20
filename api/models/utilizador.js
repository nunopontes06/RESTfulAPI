const mongoose = require('mongoose');

//  Encarrege da criacao de utilizadores


const utilizadorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
    type: String, 
    required: true, 
    unique: true, 

    // Assegura-se de que o email introduzido é valido
    
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 
 },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Utilizador', utilizadorSchema);