//server.js
//agregando las referencias
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var port = process.env.port || 8080;
var urlLocal = 'mongodb://localhost/bd_ventas2';

//conectando a la BD MongoDB
mongoose.connect(process.env.CUSTOMCONNSTR_MyConnectionString || urlLocal ,function(err){
    if(err){
        console.log('Error con en el servidor');
    }
    else{
        console.log('Conexion exitosa');
    }
});

//creando el esquema y el modelo
var esquemaUsuario = mongoose.Schema({
    usuario:String,
    clave:String,
});

var usuario = mongoose.model('usuarios',esquemaUsuario);

//trabajando con express
var app = express();
app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended: false}));

//manejando los ruteos
var router = express.Router();

router.route('/usuarios/listado').get(
    function(req,res){
        usuario.find(function(error,resultado){
            if(error){
                res.status(500).json({mensaje:'error al listar los usuarios'});
            }
            else{
                res.status(200).json(resultado);
            }
        });
});
router.route('/usuarios/nuevo').post(function(req,res){
    var nuevoUsuario = new usuario();
    nuevoUsuario.usuario = req.body.usuario;
    nuevoUsuario.clave = req.body.clave;
    nuevoUsuario.save(function(error,resultado){
        if(error){
            res.status(500).json({mensaje:'error al registrar al usuario'});
        }
        else{
            res.status(200).json(resultado);
        }
    });
});

router.route('/usuarios/Aunteticacion')
    .post(function (req,res){
        usuario.findOne({
            usuario:req.body.usuario ,
            clave:req.body.clave
        }, function(err,resultado){
                if(err){
                    res.status(500).json({
                        success: false,
                        mensaje: 'Error al conectar con servidor'
                    })
                }
                else{                   
                        res.status(200).json({resultado});                  
                }
            });
});

app.use('/api',router);
app.listen(port);
console.log('el puerto es ' + port);