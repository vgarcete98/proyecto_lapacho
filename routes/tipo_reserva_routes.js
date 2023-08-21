const Router = require( 'express' );

const { actualizar_tipo_reserva,
        crear_tipo_reserva,
        eliminar_tipo_reserva,
        obtener_tipos_reserva } = require( '../controlers/tipo_reserva_controller' );

const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');



const router_tipo_usuario = Router();


router_tipo_usuario.get( '/',[ validar_token, validar_rol_usuario ], obtener_tipos_reserva );

router_tipo_usuario.put( '/:id_tipo_reserva',[ validar_token, validar_rol_usuario ], actualizar_tipo_reserva );

router_tipo_usuario.delete( '/:id_tipo_reserva',[ validar_token, validar_rol_usuario ], eliminar_tipo_reserva );

router_tipo_usuario.post( '/',[ validar_token, validar_rol_usuario ], crear_tipo_reserva );

module.exports = router_tipo_usuario;