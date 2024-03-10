const Router = require( 'express' );

const { actualizar_tipo_reserva,
        crear_tipo_reserva,
        eliminar_tipo_reserva,
        obtener_tipos_reserva } = require( '../controlers/tipo_reserva_controller' );



const router_tipo_usuario = Router();


router_tipo_usuario.get( '/',[  ], obtener_tipos_reserva );

router_tipo_usuario.put( '/:id_tipo_reserva',[  ], actualizar_tipo_reserva );

router_tipo_usuario.delete( '/:id_tipo_reserva',[  ], eliminar_tipo_reserva );

router_tipo_usuario.post( '/',[  ], crear_tipo_reserva );

module.exports = router_tipo_usuario;