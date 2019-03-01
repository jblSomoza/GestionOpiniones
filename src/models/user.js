'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String, 
    usuario: String,
    email: String,
    password: String,
});

module.exports = mongoose.model('User', UserSchema);

