const Router = require( 'express' )

const { validar_existe_rol_usuario } = require( '../middlewares/validar_existe_rol_usuario' )


const router_accesos = Router();

const { crear_accesos, obtener_accesos, } = require( '../controlers/accesos_controller' )

router_accesos.get( '/',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_accesos );

//router_accesos.get( '/accesos_usuarios',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_accesos_usuarios );


//router_accesos.get( '/accesos_usuarios/:id_usuario',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_acceso_usuario );

router_accesos.post( '/',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ validar_existe_rol_usuario ], crear_accesos );


module.exports = router_accesos;