
const express = require( 'express' );

//----------------------------------------------------
const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
//const prisma = new PrismaClient();
//----------------------------------------------------

const listEndpoints = require('express-list-endpoints')
//const getEndpoints = require('express-list-endpoints')

const bodyParser = require('body-parser');

const cors = require( 'cors' );

//const multer = require( 'multer' );

const rutas = require( '../routes/routes' );

//----------------------------------------------------------------------------
const router_socio = require( '../routes/socio_routes' )
const router_rol = require( '../routes/roles_routes' )
const router_tipo_reserva = require( '../routes/tipo_reserva_routes' )
const router_login = require( '../routes/login_routes' )
const router_usuario = require ( '../routes/usuarios_routes' );
const tipo_socio_router = require ( '../routes/tipo_socio_route' );
const router_accesos = require( '../routes/accesos_routes' );
const router_reservas_club = require( '../routes/reservas_club_routes' );
const router_pagos = require( '../routes/pago_cuotas_routes' );
const router_cargo_gastos = require( '../routes/gastos_club_routes' );
const router_eventos = require( '../routes/calendario_eventos_routes' );
const router_inscripciones = require( '../routes/inscripciones_route' );
const router_pases_jugadores = require('../routes/pases_jugadores_routes');
const router_profesores = require('../routes/profesores_routes');
const router_clases = require( '../routes/clases_routes' )

//----------------------------------------------------------------------------


// MIDDLEWARES PERSONALIZADOS A NIVEL DE APLICACION
//----------------------------------------------------------------------------
const { middleware_request, } = require( '../middlewares/logs_middleware' );
const validar_token = require('../middlewares///validar_token');
const { validar_existe_usuario, validar_existe_usuario_socio } = require('../middlewares/validar_existe_usuario');
const { validar_acceso_a_ruta } = require('../middlewares/validar_acceso_a_ruta');
const { desencriptar_body_login } = require('../middlewares/desencriptar_login');
//----------------------------------------------------------------------------


class Server {


    constructor () { 

        this.app = express();
        this.PUERTO = 8080;
        this.middlewares();
        this.routes();
    }



    middlewares (){

        //Modo de lectura de datos usando JSON
        this.app.use( express.json( ) );

        //Agregando el paquete para peticiones desde cualquier lugar
        this.app.use( cors() );

        this.app.use( bodyParser.text() );
        
        this.app.use( express.static( 'public' ) );

        this.app.use( middleware_request );

        //this.app.use( middleware_response );


        //COMENTO ESTA PARTE YA QUE DEBO DE TRABAJAR CON JSON ENCRIPTADO
        
        this.app.use(desencriptar_body_login);//desencripto el body del login
        

        this.app.use( validar_token );//comprueba el token

        this.app.use( validar_existe_usuario_socio );//ve si ese usuario es valido y existe

        this.app.use(validar_acceso_a_ruta);//y ve si tiene la ruta habilitada


        //this.app.use( multer )

        this.app.use(function( err, req , res , next ) {
            
            //console.error(err.stack);
            res.status(500).json( 
                {
                    status : false,
                    msj : `Ha ocurrido un error en la aplicacion  ${ err }` ,
                    //nuevo_tipo_socio
                }
         );
        });

    }

    routes () {

        this.app.use( rutas.Socio.ruta, router_socio );
        
        this.app.use( rutas.Usuarios.ruta, router_usuario );        
        
        this.app.use( rutas.tipo_reserva.ruta, router_tipo_reserva );

        this.app.use( rutas.Eventos.ruta, router_eventos );
        
        this.app.use( rutas.roles_club.ruta, router_rol );
        
        this.app.use( rutas.Tipo_Socio.ruta, tipo_socio_router );

        this.app.use( rutas.accesos_usuario.ruta, router_accesos );       
        
        this.app.use( rutas.Login.ruta, router_login );

        this.app.use( rutas.reserva_club.ruta, router_reservas_club );

        this.app.use( rutas.pagos_socio.ruta, router_pagos );

        this.app.use( rutas.Gastos_club.ruta, router_cargo_gastos );

        this.app.use( rutas.calendario_eventos.ruta, router_eventos );  

        this.app.use( rutas.Inscripciones.ruta, router_inscripciones );
        
        this.app.use ( rutas.pases_socios.ruta, router_pases_jugadores );

        this.app.use( rutas.profesores.ruta, router_profesores );

        this.app.use (rutas.clases_particulares.ruta, router_clases );
    }

    listar_rutas (){

        listEndpoints( this.app ).forEach(function(element) {
            const { path } = element;
            //console.log(path);
          });

        //console.log(getEndpoints(this.app));
    }


    listen(){


        this.app.listen( this.PUERTO, ()=>{

            console.log ( `BACKEND CLUB LAPACHO\n` );
            console.log('    ________');
            console.log('   /       \\');
            console.log('  |         |');
            console.log('  |         |');
            console.log('   \\_______/');
            console.log('     |   |');
            console.log('     |___|');
            console.log ( `\nEN LINEA EN PUERTO  ${ this.PUERTO }` );
        } )
    }


}



module.exports = Server ;