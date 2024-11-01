
const express = require( 'express' );

//----------------------------------------------------
const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
//const prisma = new PrismaClient();
const schedule = require('node-schedule');

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
const router_login = require( '../routes/login_routes' )
const router_accesos = require( '../routes/accesos_routes' );
const router_reservas_club = require( '../routes/reservas_club_routes' );
const router_pagos = require( '../routes/pagos_routes' );
const router_cargo_gastos = require( '../routes/gastos_club_routes' );
const router_eventos = require( '../routes/calendario_eventos_routes' );
const router_inscripciones = require( '../routes/inscripciones_route' );
const router_pases_jugadores = require('../routes/pases_jugadores_routes');
const router_profesores = require('../routes/profesores_routes');
const router_ingresos = require('../routes/ingresos_routes');
const router_egresos = require('../routes/egresos_routes');
const { router_rutas_app } = require('../routes/rutas_app_routes');
const router_tipo_cuota = require('../routes/tipo_cuota_routes');
const router_cuotas = require('../routes/cuotas_routes');
const router_clientes = require( '../routes/clientes_routes' );

//----------------------------------------------------------------------------


// MIDDLEWARES PERSONALIZADOS A NIVEL DE APLICACION
//----------------------------------------------------------------------------
const { middleware_request, } = require( '../middlewares/logs_middleware' );
const validar_token = require('../middlewares///validar_token');
const { desencriptar_body_login } = require('../middlewares/desencriptar_login');
const { validar_existe_usuario_socio } = require( '../middlewares/validar_existe_usuario' );
const { obtener_data_socio } = require('../helpers/verficar_socio_carga');
const router_agendamientos_clase = require('../routes/agendamiento_clases_routes');
const { comprobar_acceso_rol, cargar_rutas_rol } = require('../helpers/comprobar_acceso_rol');
const { router_facturacion } = require( '../routes/facturacion_route' );
//----------------------------------------------------------------------------

//CRON JOBS QUE VOY A NECESITAR
//----------------------------------------------------------------------------
const { cron_job_genera_cuotas_anio } = require( '../helpers/cron_job_genera_cuotas_anio' );
const { cron_job_genera_gastos_fijos } = require( '../helpers/cron_job_genera_cuotas_anio' );
const { cron_job_genera_venta_cuotas_vencidas } = require( '../cuotas/genera_venta_cuotas_vencidas' )
const router_caja_chica = require('../routes/caja_chica_routes');
const router_parametros = require('../routes/parametros_routes');
const router_caja = require('../routes/caja_routes');
const { router_compras } = require('../routes/compras_routes');
//----------------------------------------------------------------------------


// LA FUNCION QUE SE VA EJECUTAR PARA GENERARME LAS CUOTAS DEL AÑO
//----------------------------------------------------------------------------
const job = schedule.scheduleJob('0 1 0 1 1 *', cron_job_genera_cuotas_anio);
const job_gastos_fijos = schedule.scheduleJob('0 0 1 * * *', cron_job_genera_gastos_fijos);
//const job_cuotas_vencidas = schedule.scheduleJob( '0 0 0 0 1 *', cron_job_genera_venta_cuotas_vencidas );
//PARA TEST DEL CRON JOB
//const job = schedule.scheduleJob('40 * * * *', cron_job_genera_cuotas_anio);
const job_cuotas_vencidas = schedule.scheduleJob( '* * 5 * * *', cron_job_genera_venta_cuotas_vencidas );
//const job_gastos_fijos = schedule.scheduleJob('5 * * * * *', cron_job_genera_gastos_fijos);
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

        //this.app.use( middleware_request );

        //this.app.use( middleware_response );


        //COMENTO ESTA PARTE YA QUE DEBO DE TRABAJAR CON JSON ENCRIPTADO
        
        this.app.use(desencriptar_body_login);//desencripto el body del login
        

        this.app.use( validar_token );//comprueba el token

        this.app.use( validar_existe_usuario_socio );//ve si ese usuario es valido y existe

        //this.app.use(validar_acceso_a_ruta);//y ve si tiene la ruta habilitada

        
        //this.app.use( obtener_data_socio );
        
        //this.app.use(comprobar_acceso_rol);
        
        //this.app.use( multer )
        //this.app.use( comprobar_acceso_rol );

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

        this.app.use( rutas.Eventos.ruta, router_eventos );
        
        this.app.use( rutas.roles_club.ruta, router_rol );

        this.app.use( rutas.accesos_usuario.ruta, router_accesos );       
        
        this.app.use( rutas.Login.ruta, router_login );

        this.app.use( rutas.reserva_club.ruta, router_reservas_club );

        //this.app.use( rutas.pagos_socio.ruta, router_pagos );

        this.app.use( rutas.Gastos_club.ruta, router_cargo_gastos );

        this.app.use( rutas.calendario_eventos.ruta, router_eventos );  

        this.app.use( rutas.Inscripciones.ruta, router_inscripciones );
        
        this.app.use ( rutas.pases_socios.ruta, router_pases_jugadores );

        this.app.use( rutas.profesores.ruta, router_profesores );

        this.app.use (rutas.clases_particulares.ruta, router_agendamientos_clase );

        this.app.use( rutas.ingresos_del_club.ruta, router_ingresos );

        this.app.use( rutas.egresos_del_club.ruta, router_egresos );

        this.app.use( rutas.rutas_de_la_app.ruta, router_rutas_app );

        this.app.use( rutas.tipo_cuotas.ruta, router_tipo_cuota );

        this.app.use( rutas.cuotas_del_club.ruta, router_cuotas );

        this.app.use( rutas.caja_chica.ruta, router_caja_chica );

        this.app.use( rutas.clientes.ruta, router_clientes );

        this.app.use( rutas.parametros.ruta, router_parametros );

        this.app.use( rutas.caja.ruta,  router_caja); 
        
        this.app.use( rutas.ventas.ruta, router_pagos );

        this.app.use( rutas.compras.ruta, router_compras );    
        
        this.app.use( rutas.facturacion.ruta, router_facturacion );
    
    }

    listar_rutas (){

        listEndpoints( this.app ).forEach(function(element) {
            const { path } = element;
            console.log(path);
          });

        //console.log(getEndpoints(this.app));
    }

    cargar_accesos_rol(){

        cargar_rutas_rol();
    }

    listen(){

        //actualizar_pass_clientes();

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

        //this.listar_rutas()
    }


}








module.exports = Server ;