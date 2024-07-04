const Router = require( 'express' )


// VALIDADORES 
//------------------------------------------------------------------------
//------------------------------------------------------------------------


const { 
        abonar_x_inscripcion,
        editar_inscripcion,
        inscribirse_a_evento,
        abonar_x_inscripcion_no_socio,
        editar_inscripcion_no_socio,
        inscribirse_a_evento_no_socios,
        ver_inscripciones_x_evento,
        ver_inscripciones_x_evento_no_socio, 
        obtener_cantidad_inscriptos_x_evento,
        obtener_grafico_inscriptos_x_evento_categoria,
        obtener_ganancias_gastos_x_evento,
        ver_todas_las_inscripciones_x_evento} = require( '../controlers/inscripciones_controller' );
const { obtener_data_socio } = require('../helpers/verficar_socio_carga');



const router_inscripciones = Router();



//PARA LOS QUE SON SOCIOS 

router_inscripciones.get( '/ver_inscripciones_x_evento',[ obtener_data_socio ], ver_inscripciones_x_evento );

router_inscripciones.get( '/obtener_cantidad_inscriptos',[ obtener_data_socio ], obtener_cantidad_inscriptos_x_evento );

router_inscripciones.get( '/obtener_grafico_inscriptos',[ obtener_data_socio ], obtener_grafico_inscriptos_x_evento_categoria );

router_inscripciones.get( '/obtener_ganancias_gastos_x_evento',[ obtener_data_socio ], obtener_ganancias_gastos_x_evento );

router_inscripciones.put( '/editar_inscripcion',[ obtener_data_socio ], editar_inscripcion );

router_inscripciones.put( '/abonar_x_inscripcion',[ obtener_data_socio  ], abonar_x_inscripcion );

router_inscripciones.post( '/inscribirse_a_evento',[ obtener_data_socio ], inscribirse_a_evento );

//PARA LOS QUE SON NO SOCIOS
router_inscripciones.get( '/no_socio/ver_inscripciones_x_evento_no_socio',[  ], ver_inscripciones_x_evento_no_socio );

router_inscripciones.put( '/no_socio/abonar_x_inscripcion_no_socio',[ ], abonar_x_inscripcion_no_socio );

router_inscripciones.put( '/no_socio/editar_inscripcion_no_socio',[ ], editar_inscripcion_no_socio );

router_inscripciones.post( '/no_socio/inscribirse_a_evento_no_socios',[ ], inscribirse_a_evento_no_socios );



router_inscripciones.get( '/ver_todas_inscripciones_x_evento',[  ], ver_todas_las_inscripciones_x_evento );



module.exports = router_inscripciones;