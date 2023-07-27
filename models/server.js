
const express = require( 'express' );

const rutas = require( '../routes/routes' );

const router_socio = require( '../routes/socio_routes' )

const router_rol = require( '../routes/roles_routes' )



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

        
        this.app.use( express.static( 'public' ) );

    }

    routes () {
        this.app.use( rutas.Socio.ruta, router_socio );
        this.app.use( rutas.roles_club.ruta, router_rol );
    }


    listen(){


        this.app.listen( this.PUERTO, ()=>{

            console.log ( `ESCUCHANDO PUERTO  ${ this.PUERTO }` )

        } )
    }


}



module.exports = Server ;