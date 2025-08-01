const Router = require( 'express' );



const { agregar_permiso_a_usuario, 
        obtener_rutas_aplicacion,
        obtener_rutas_de_usuario,
        quitar_permiso_a_usuario, 
        obtener_rutas_de_usuario_faltantes} = require( '../controlers/rutas_app_controller' )


const router_rutas_app = Router();


router_rutas_app.get( '/', [], obtener_rutas_aplicacion );
router_rutas_app.get( '/rutas_usuario/:id_usuario', [], obtener_rutas_de_usuario );
router_rutas_app.get( '/rutas_usuario/rutas_faltantes/:id_usuario', [], obtener_rutas_de_usuario_faltantes );
router_rutas_app.post( '/rutas_usuario/agregar_permiso/:id_usuario', [], agregar_permiso_a_usuario );
//router_rutas_app//.put( [],  )
router_rutas_app.delete( '/rutas_usuario/quitar_permiso/:id_usuario', [], quitar_permiso_a_usuario );



module.exports = {router_rutas_app}