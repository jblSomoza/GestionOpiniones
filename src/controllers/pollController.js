'use strict'

var Poll = require('../models/poll');

function crearEncuesta(req, res) {
    var poll = new Poll();
    var params = req.body;

    if (params.descripcion && params.usuario) {
        poll.descripcion = params.descripcion;
        poll.usuario = params.usuario;
        poll.opiniones = params.opiniones;

        Poll.find({ $or:[
            {usuario: poll.usuario}
        ]}).exec((err, polls) =>{
            if(err) return res.status(500).send({message: 'Error en la peticion'});

            if(polls && polls.length >= 1){
                return res.status(500).send({message: 'La encuesta ya existe en el sistema'});
            }else{
                poll.save((err, encuestaGuardada)=>{
                    if(err) return res.status(500).send({message: 'Error al guardar la encuesta'});

                    if(encuestaGuardada){
                        res.status(200).send({poll: encuestaGuardada});
                    }else{
                        res.status(404).send({message: 'No se a podido registrar la encuesta'});
                    }
                })
            }
        })
    }else{
        res.status(200).send({
            message: 'Rellene todos los campos necesarios'
        });
    }
}

function editarVotacion(req, res) {
    if(!req.user.sub){
        return res.status(404).send({message: 'Usted no puede editar esta encuesta'});
    }else{
        var encuestaId = req.params.encuestaId;
        var update = req.body;

        Poll.findOneAndUpdate(encuestaId, update, (err, encuestaActualizada)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'});

            if(!encuestaActualizada) return res.status(404).send({message: 'No se a podido actualizar'});

            res.status(200).send({ poll: encuestaActualizada});
        })
    }
}

function borrarEncuesta(req, res) {
    if(!req.user.sub){
        return res.status(404).send({message: 'Usted no puede borrar esta encuesta'});
    }else{
        var encuestaId = req.params.encuestaId;
        
        Poll.findByIdAndDelete(encuestaId, (err, encuestaBorrada)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'});

            if(!encuestaBorrada) return res.status(404).send({message: 'No se a podido borrar'});
            
            if(err) return next(err);

            res.status(200).send({message: 'Se logro eliminar la votacion correctamente'});
        });
    }
}

function registrarVotacion(req, res) {
    var params = req.body;
    var idEncuesta = req.params.id;

    if (params.opiniones.toUpperCase() == 'SI') {
        
        Poll.findByIdAndUpdate(idEncuesta, { new: true }, (err, resultado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!resultado) return res.status(500).send({ message: 'No se ha podido votar' });
            var si = resultado.opiniones.Si + 1;

            resultado.opiniones.Si = si;
            resultado.save();

            return res.status(500).send({ Encuesta: resultado });

        });
    } else {

        if (params.opiniones.toUpperCase() == 'NO') {

            Encuesta.findByIdAndUpdate(idEncuesta, { new: true }, (err, encuestaActualizada) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                if (!encuestaActualizada) return res.status(500).send({ message: 'No se ha podido votar' });
                var no = encuestaActualizada.opiniones.No + 1;

                encuestaActualizada.opiniones.No = no;
                encuestaActualizada.save();

                return res.status(500).send({ Encuesta: encuestaActualizada });

            });

        }else{
            if(params.opiniones.toUpperCase()== 'TALVEZ'){
                Encuesta.findByIdAndUpdate(idEncuesta, {new: true}, (err, encuestaActualizada)=>{
                    if(err) return res.status(500).send({ message: 'Error en la peticion' });
                    if(!encuestaActualizada) res.status(500).send({ message: 'No entran los parametros' });

                    var talvez = encuestaActualizada.opiniones.TalVez + 1;

                    encuestaActualizada.opiniones.TalVez = talvez;
                    encuestaActualizada.save();

                    return res.status(500).send({Encuesta: encuestaActualizada});
                });
            }else{
                if(params.opiniones.toUpperCase() != 'TALVEZ' || params.opiniones.toUpperCase() != 'SI' || params.opiniones.toUpperCase() != 'NO'){
                    return res.status(500).send({message: 'Los votos validos son talvez, si o no'});
                }
            }
        }
    }
}

module.exports = {
    crearEncuesta,
    editarVotacion,
    borrarEncuesta,
    registrarVotacion
}