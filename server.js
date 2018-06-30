//server.js
//agregando las referencias
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var port = process.env.port || 8080;
var urlLocal = 'mongodb://localhost/bd_ventas2';

//conectando a la BD MongoDB
mongoose.connect('mongodb://ejemplo-bd.documents.azure.com:10255/admin?ssl=true', {
    auth: {
      user: 'ejemplo-bd',
      password: 'X1SpFftqDnYhA88NDzWOG19eC9I5l4Gydck3cFqraBG3SnGoAKKQaDmt1Dd8HAsmgj178VVxaa27laSTsNK1tg=='
    }
  })
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

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