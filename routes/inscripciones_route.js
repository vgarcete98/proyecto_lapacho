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
        ver_inscripciones_x_evento_no_socio } = require( '../controlers/inscripciones_controller' );
const { obtener_data_socio } = require('../helpers/verficar_socio_carga');



const router_inscripciones = Router();



//PARA LOS QUE SON SOCIOS 

router_inscripciones.get( '/ver_inscripciones_x_evento',[ obtener_data_socio ], ver_inscripciones_x_evento );

router_inscripciones.put( '/editar_inscripcion',[ obtener_data_socio ], editar_inscripcion );

router_inscripciones.put( '/abonar_x_inscripcion',[ obtener_data_socio  ], abonar_x_inscripcion );

router_inscripciones.post( '/inscribirse_a_evento',[ obtener_data_socio ], inscribirse_a_evento );

//PARA LOS QUE SON NO SOCIOS
router_inscripciones.get( '/no_socio/ver_inscripciones_x_evento_no_socio',[  ], ver_inscripciones_x_evento_no_socio );

router_inscripciones.put( '/no_socio/abonar_x_inscripcion_no_socio',[ ], abonar_x_inscripcion_no_socio );

router_inscripciones.put( '/no_socio/editar_inscripcion_no_socio',[ ], editar_inscripcion_no_socio );

router_inscripciones.post( '/no_socio/inscribirse_a_evento_no_socios',[ ], inscribirse_a_evento_no_socios );

module.exports = router_inscripciones;