'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var PollController = require('../controllers/pollController');
var md_auth  = require('../middlewares/authenticated');

var api = express.Router();


//Rutas del usuario
api.post('/registrar', UserController.registrar)
api.post('/login', UserController.login);


//Rutas de las encuestas
api.post('/registrar-encuesta', md_auth.ensureAuth, PollController.crearEncuesta);
api.post('/registrar-votacion/:id', md_auth.ensureAuth, PollController.registrarVotacion);

api.put('/editar-votacion/:id', md_auth.ensureAuth, PollController.editarVotacion);

api.delete('/eliminar-votacion/:id', md_auth.ensureAuth, PollController.borrarEncuesta);

module.exports = api;