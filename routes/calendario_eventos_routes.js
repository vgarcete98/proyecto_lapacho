const Router = require( 'express' )

const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
const { comprobar_disponibilidad_evento, comprobar_evento_borrado, comprobar_existe_evento } = require( '../helpers/comprobar_disponibilidad_evento' )

//-------------------------------------------------------------------------
const {
        actualizar_evento_calendario,
        asignar_evento_calendario,
        borrar_evento_calendario,
        obtener_eventos_calendario,
        obtener_eventos_x_fecha_calendario } = require( '../controlers/calendario_eventos_controller' );
//-------------------------------------------------------------------------

const router_eventos = Router();


router_eventos.get( '/eventos_annio', [ validar_token, validar_rol_usuario ], obtener_eventos_calendario );

router_eventos.get( '/', [ validar_token, validar_rol_usuario ], obtener_eventos_x_fecha_calendario );

router_eventos.post( '/', [ validar_token, validar_rol_usuario, comprobar_disponibilidad_evento ], asignar_evento_calendario );

router_eventos.delete( '/:id_evento', [ validar_token, validar_rol_usuario, comprobar_existe_evento ,comprobar_evento_borrado ], borrar_evento_calendario );

router_eventos.put( '/:id_evento', [ validar_token, validar_rol_usuario, comprobar_existe_evento , comprobar_disponibilidad_evento ], actualizar_evento_calendario );

module.exports = router_eventos;