const Router = require( 'express' )


const router_accesos = Router();

const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
const { crear_accesos, obtener_accesos, obtener_accesos_usuarios, obtener_acceso_usuario } = require( '../controlers/accesos_controller' )

router_accesos.get( '/',[ validar_token, validar_rol_usuario ], obtener_accesos );

router_accesos.get( '/accesos_usuarios',[ validar_token, validar_rol_usuario ], obtener_accesos_usuarios );


router_accesos.get( '/accesos_usuarios/:id_usuario',[ validar_token, validar_rol_usuario ], obtener_acceso_usuario );

router_accesos.post( '/',[ validar_token, validar_rol_usuario ], crear_accesos );


module.exports = router_accesos;