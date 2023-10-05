
const Router = require( 'express' )

const { actualizar_usuario,
        borrar_usuario,
        crear_usuario,
        obtener_accesos_usuario,
        obtener_usuario,
        obtener_usuarios } = require( '../controlers/usuario_controller' );

const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
const { validar_existe_usuario, comprobar_usuario_valido, comprobar_usuario_borrado }= require( '../middlewares/validar_existe_usuario' );
const router_usuario = Router();


router_usuario.get( '/',[ validar_token, validar_rol_usuario ], obtener_usuarios );

router_usuario.get( '/:id_usuario',[ validar_token, validar_rol_usuario, comprobar_usuario_valido ], obtener_usuario );

router_usuario.post( '/',[ validar_token, validar_rol_usuario, validar_existe_usuario ], crear_usuario );

router_usuario.delete( '/:id_usuario',[ validar_token, validar_rol_usuario, comprobar_usuario_valido, comprobar_usuario_borrado  ], borrar_usuario );

router_usuario.put( '/:id_usuario',[ validar_token, validar_rol_usuario, comprobar_usuario_valido ], actualizar_usuario );



module.exports = router_usuario;
