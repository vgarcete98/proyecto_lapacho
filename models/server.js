
const express = require( 'express' );
const jwt = require('jsonwebtoken');
//PARA ENCRIPTADO Y DESENCRIPTADO 
//----------------------------------------------------
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
//----------------------------------------------------

//----------------------------------------------------
const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();
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
const { middleware_request, } = require( '../middlewares/logs_middleware' )
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

        //COMENTO ESTA PARTE YA QUE DEBO DE TRABAJAR CON JSON ENCRIPTADO
        
        this.app.use(function(req , res , next ) {
            
            try {
                
                //HAY QUE DESENCRYPTAR EL BODY DE LA REQUEST QUE ESTA VINIENDO
                
                const {data} = req.body;
                if (data === undefined ){
                    //QUIERE DECIR QUE ES UNA CONSULTA NADA MAS 
                    next()
                }else {
                    // CASO CONTRARIO PARA OPERACIONES DE INSERT, DELETE, UPDATE 
                    var bytes  = AES.decrypt(data, process.env.ENCRYPTS3CR3TEDK3Y);
                    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    req.body = decryptedData
                    next()                    
                }

            } catch (error) {
                res.status(500).json( 
                    {
                        status : false,
                        msj : `Ha ocurrido un error al desencriptar  ${ error }` ,
                        //nuevo_tipo_socio
                    }
                );                
            }

        });
        

        this.app.use(async function(req , res , next ) {

            try {
                //console.log( req.path );
                if (req.path === '/auth/login') {
                    next()
                } else {

                    const { x_token } = req.headers;
                    //console.log( x_token );
                    const payload = jwt.verify( x_token,process.env.SECRET0RPR1VAT3K3Y );
                    //console.log ( payload );
                    req.token_trad = payload;

                    const { token_trad } = req;

                    const { id_usuario } = token_trad;                
                    
                    const resultado = await prisma.$queryRaw`SELECT D.PATH_RUTA AS ruta
                                                                FROM ACCESOS_USUARIO A JOIN roles_usuario B ON B.id_rol_usuario = A.id_rol_usuario
                                                                JOIN RUTAS_HABILITADAS_ROL F ON F.id_rol_usuario = B.id_rol_usuario
                                                                JOIN RUTAS_APP D ON D.id_ruta_app = F.id_ruta_app
                                                                JOIN tipos_ruta_app C ON C.id_tipo_ruta_app = D.id_tipo_ruta_app
                                                                JOIN socio G on G.id_acceso_socio = A.id_acceso
                                                            WHERE G.id_socio = ${ id_usuario } `;

                    var comprobado = false;
                    resultado.forEach(element => {
                        const { ruta } = element;
                        //console.log( ruta );
                        if ( ruta === req.path ){
                            comprobado = true;
                        }

                    });
                    if (!comprobado) throw new Error( "El usuario no tiene el acceso a ese recurso" )
                
                    next()                                 
                }
  
        
            } catch (error) {
                res.status(500).json( 
                    {
                        status : false,
                        msj : `Ha ocurrido un error al comprobar las rutas del usuario :  ${ error }` ,
                        //nuevo_tipo_socio
                    }
                );                
            }

        });


        //this.app.use( multer )

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