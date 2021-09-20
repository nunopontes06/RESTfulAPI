//  Dependencias

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//  Constantes que vao conter o path para a pasta que contem os scripts para os ficheiros reservas e eventos

const eventosRoutes = require('./api/routes/eventos');
const reservasRoutes = require('./api/routes/reservas');
const utilizadorRoutes = require('./api/routes/utilizadores');

mongoose.connect('mongodb+srv://novouser:' + process.env.MONGO_ATLAS_PW + '@cluster0-bxcmf.mongodb.net/test?retryWrites=true&w=majority',
    {
        //useMongoClient: true
        useNewUrlParser: true
    }
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Extrai os dados json e fa-los mais faceis de ler
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Ajuda a prevenier erros CORS 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//  Os routes responsaveis por lidar com requests 

app.use('/eventos', eventosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/utilizadores', utilizadorRoutes);

//  Retornar um erro sempre que for introduzido um caminho desconhecido no url onde eventos e reservas nao se aplicam

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

// Esta funcao lida com todo o tipo de erros

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;