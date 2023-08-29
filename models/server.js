
const express = require( 'express' );

const cors = require( 'cors' );

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
        this.app.use( express.json() );

        //Agregando el paquete para peticiones desde cualquier lugar
        this.app.use( cors() );
        
        this.app.use( express.static( 'public' ) );

    }

    routes () {

        this.app.use( rutas.Socio.ruta, router_socio );
        
        this.app.use( rutas.Usuarios.ruta, router_usuario );        
        
        this.app.use( rutas.tipo_reserva.ruta, router_tipo_reserva );
        
        this.app.use( rutas.roles_club.ruta, router_rol );
        
        this.app.use( rutas.Tipo_Socio.ruta, tipo_socio_router );

        this.app.use( rutas.accesos_usuario.ruta, router_accesos );       
        
        this.app.use( rutas.Login.ruta, router_login );

        this.app.use( rutas.reserva_club.ruta, router_reservas_club );

        this.app.use( rutas.pagos_socio.ruta, router_pagos );

        this.app.use( rutas.Gastos_club.ruta, router_cargo_gastos );
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