
const express = require( 'express' );

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

    }


    listen(){


        this.app.listen( ()=>{

            console.log ( `ESCUCHANDO PUERTO  ${ this.PUERTO } ` )

        } )
    }


}



module.exports = Server ;