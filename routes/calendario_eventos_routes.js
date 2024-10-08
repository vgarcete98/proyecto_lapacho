const Router = require( 'express' )

const { comprobar_disponibilidad_evento, comprobar_evento_borrado, comprobar_existe_evento } = require( '../helpers/comprobar_disponibilidad_evento' );
const { obtener_data_socio, verificar_vista_usuario } = require( '../helpers/verficar_socio_carga' );
//-------------------------------------------------------------------------
const {
        actualizar_evento_calendario,
        asignar_evento_calendario,
        borrar_evento_calendario,
        obtener_eventos_calendario,
        obtener_eventos_x_fecha_calendario, 
        obtener_inscripciones_x_evento,
        obtener_tipos_de_evento,
        obtener_eventos_del_mes,
        obtener_todos_los_eventos_calendario,
        obtener_categorias_x_evento,
        crear_categorias_x_evento,
        editar_categorias_x_evento,
        eliminar_categorias_x_evento,
        obtener_requerimientos_x_evento,
        crear_requerimientos_x_evento,
        editar_requerimientos_x_evento,
        eliminar_requerimientos_x_evento} = require( '../controlers/calendario_eventos_controller' );
const { obtener_ganancias_gastos_x_evento, obtener_grafico_inscriptos_x_evento_categoria, obtener_cantidad_inscriptos_x_evento } = require('../controlers/inscripciones_controller');
//-------------------------------------------------------------------------



const router_eventos = Router();


router_eventos.get( '/eventos_annio', [ ], obtener_eventos_calendario );

router_eventos.get( '/', [ ], obtener_eventos_x_fecha_calendario );

router_eventos.get ( '/eventos_con_categoria', [ ], obtener_eventos_del_mes );

router_eventos.post ( '/eventos_mes_todos', [ verificar_vista_usuario ], obtener_todos_los_eventos_calendario );


router_eventos.get( '/obtener_tipos_evento', [ ], obtener_tipos_de_evento );

router_eventos.get( '/inscripciones_evento', [  ], obtener_inscripciones_x_evento );

router_eventos.post( '/crear_nuevo_evento', [  comprobar_disponibilidad_evento, verificar_vista_usuario ], asignar_evento_calendario );

router_eventos.delete( '/eliminar_evento', [ comprobar_existe_evento ,comprobar_evento_borrado, verificar_vista_usuario ], borrar_evento_calendario );

router_eventos.put( '/actualizar_evento', [ comprobar_existe_evento , comprobar_disponibilidad_evento, verificar_vista_usuario ], actualizar_evento_calendario );



router_eventos.get( '/obtener_categorias_evento', [ ], obtener_categorias_x_evento );

router_eventos.post( '/crear_categorias_evento', [ ], crear_categorias_x_evento );

router_eventos.put( '/editar_categorias_evento', [ ], editar_categorias_x_evento );

router_eventos.delete( '/eliminar_categorias_evento', [ ], eliminar_categorias_x_evento );



router_eventos.get( '/obtener_requerimientos_evento', [ ], obtener_requerimientos_x_evento );

router_eventos.post( '/crear_requerimientos_evento', [ ], crear_requerimientos_x_evento );

router_eventos.put( '/editar_requerimientos_evento', [ ], editar_requerimientos_x_evento );

router_eventos.delete( '/eliminar_requerimientos_evento', [ ], eliminar_requerimientos_x_evento );



router_eventos.get( '/ganancias_gastos_x_evento', [ ], obtener_ganancias_gastos_x_evento );

router_eventos.get( '/grafico_torta_inscriptos_x_evento', [ ], obtener_grafico_inscriptos_x_evento_categoria );

router_eventos.get( '/total_inscriptos_evento', [ ], obtener_cantidad_inscriptos_x_evento );




module.exports = router_eventos;