const Router = require( 'express' );



const { agregar_permiso_a_usuario, 
        obtener_rutas_aplicacion,
        obtener_rutas_de_usuario } = require( '../controlers/rutas_accesos_controller' )


const router_rutas_app = Router();



router_rutas_app.route( '/' )
                .get( [], obtener_rutas_aplicacion )
                .get( '/rutas_usuario/:id_usuario', obtener_rutas_de_usuario )
                .post( [], agregar_permiso_a_usuario )
                //.put( [],  )
                .delete( [],  );



module.exports = {router_rutas_app}