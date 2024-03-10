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
        ver_inscripciones_x_evento_no_socio } = require( '../controlers/inscripciones_controller' )



const router_inscripciones = Router();



router_inscripciones.get( '/:id_evento',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], ver_inscripciones_x_evento );

router_inscripciones.get( '/no_socio/:id_evento',[ /*validar_token,*/ /*/*validar_rol_usuario,*/  ], ver_inscripciones_x_evento_no_socio );

router_inscripciones.put( '/:id_inscripcion',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], editar_inscripcion );

router_inscripciones.put( '/no_socio/:id_inscripcion',[ /*validar_token,*/ /*/*validar_rol_usuario,*/  ], editar_inscripcion_no_socio );

router_inscripciones.put( '/no_socio/:id_socio',[ /*validar_token,*/ /*/*validar_rol_usuario,*/  ], abonar_x_inscripcion_no_socio );

router_inscripciones.put( '/:id_inscripcion',[ /*validar_token,*/ /*/*validar_rol_usuario,*/  ], abonar_x_inscripcion );

router_inscripciones.post( '/',[ /*validar_token,*/ /*/*validar_rol_usuario,*/  ], inscribirse_a_evento );

router_inscripciones.post( '/no_socio',[ /*validar_token,*/ /*/*validar_rol_usuario,*/  ], ver_inscripciones_x_evento_no_socio );


module.exports = router_inscripciones;