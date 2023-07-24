
const express = require( 'express' );

const rutas = require( '../routes/routes' );

const router_socio = require( '../routes/socio_routes' )

class Server {


    constructor () { 

        this.app = express();
        this.PUERTO = 8080;
        this.middlewares();
        this.routes();
    }



    middlewares (){


        this.app.use( express.static( 'public' ) );

    }

    routes () {
        this.app.use( rutas.Socio.ruta, router_socio );

    }


    listen(){


        this.app.listen( this.PUERTO, ()=>{

            console.log ( `ESCUCHANDO PUERTO  ${ this.PUERTO }` )

        } )
    }


}



module.exports = Server ;