
const Router = require( 'express' )

const { actualizar_usuario,
        borrar_usuario,
        crear_usuario,
        obtener_accesos_usuario,
        obtener_usuario,
        obtener_usuarios } = require( '../controlers/usuario_controller' );

const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
const router_usuario = Router();


router_usuario.get( '/',[ validar_token, validar_rol_usuario ], obtener_usuarios );
router_usuario.get( '/:id',[ validar_token, validar_rol_usuario ], obtener_usuario );
router_usuario.get( '/accesos',[ validar_token, validar_rol_usuario ], obtener_accesos_usuario );

router_usuario.post( '/',[ validar_token, validar_rol_usuario ], crear_usuario );

router_usuario.delete( '/:id',[ validar_token, validar_rol_usuario ], borrar_usuario );

router_usuario.put( '/:id',[ validar_token, validar_rol_usuario ], actualizar_usuario );



module.exports = router_usuario;
