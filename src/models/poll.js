'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

var PollSchema = Schema({
    descripcion: String, 
    usuario: { type: Schema.ObjectId, ref: "User" },
    opiniones: {
        Si: {type: Number, default: 0},
        No: {type: Number, default: 0},
        TalVez: {type: Number, default: 0}
    }
});

module.exports = mongoose.model('Polls', PollSchema);