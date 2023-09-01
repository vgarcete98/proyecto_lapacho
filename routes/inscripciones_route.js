const Router = require( 'express' )


// VALIDADORES 
//------------------------------------------------------------------------
const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
//------------------------------------------------------------------------


const { 
        abonar_x_inscripcion,
        editar_inscripcion,
        inscribirse_a_evento } = require( '../controlers/inscripciones_controller' )



const router_inscripciones = Router();



router_inscripciones.put( '/',[  ], editar_inscripcion );

router_inscripciones.put( '/',[  ], abonar_x_inscripcion );

router_inscripciones.post( '/',[  ], inscribirse_a_evento );




module.exports = router_inscripciones;