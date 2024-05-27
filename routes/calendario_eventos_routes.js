const Router = require( 'express' )

const { comprobar_disponibilidad_evento, comprobar_evento_borrado, comprobar_existe_evento } = require( '../helpers/comprobar_disponibilidad_evento' );
const { obtener_data_socio } = require( '../helpers/verficar_socio_carga' );
//-------------------------------------------------------------------------
const {
        actualizar_evento_calendario,
        asignar_evento_calendario,
        borrar_evento_calendario,
        obtener_eventos_calendario,
        obtener_eventos_x_fecha_calendario, 
        obtener_inscripciones_x_evento,
        obtener_tipos_de_evento,
        obtener_eventos_del_mes} = require( '../controlers/calendario_eventos_controller' );
//-------------------------------------------------------------------------



const router_eventos = Router();


router_eventos.get( '/eventos_annio', [ ], obtener_eventos_calendario );

router_eventos.get( '/', [ ], obtener_eventos_x_fecha_calendario );

router_eventos.get ( '/eventos_mes', [ ], obtener_eventos_del_mes )

router_eventos.get( '/obtener_tipos_evento', [ ], obtener_tipos_de_evento );

router_eventos.get( '/inscripciones_evento', [  ], obtener_inscripciones_x_evento );

router_eventos.post( '/crear_nuevo_evento', [  comprobar_disponibilidad_evento, obtener_data_socio ], asignar_evento_calendario );

router_eventos.delete( '/eliminar_evento', [ comprobar_existe_evento ,comprobar_evento_borrado, obtener_data_socio ], borrar_evento_calendario );

router_eventos.put( '/actualizar_evento', [ comprobar_existe_evento , comprobar_disponibilidad_evento, obtener_data_socio ], actualizar_evento_calendario );

module.exports = router_eventos;