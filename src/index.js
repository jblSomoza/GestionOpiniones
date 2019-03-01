'use strict'    

const mongoose = require("mongoose"); 
const app = require("./app");

mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost:27017/Opiniones', {useNewUrlParser: true}).then(()=>{
    console.log('Se encuentra conectado a la base de datos');

    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'), ()=>{
        console.log(`El servidor esta corriendo en el puerto: '${app.get('port')}'`);  //comillas invertidas dejan crear una variable dentro dle mensaje
    });
}).catch(err => console.log(err));
