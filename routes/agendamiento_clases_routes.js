const Router = require( 'express' )


const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');

const { abonar_una_clase,
        agendar_una_clase,
        editar_una_clase,
        eliminar_clase_con_profesor,
        obtener_clases_del_dia,
        obtener_clases_x_profesor_dia } = require( '../controlers/agendamiento_clases_controller' )

const router_agendamientos_clase = Router();


router_eventos.get( '/', [ validar_token, validar_rol_usuario ], obtener_clases_del_dia );

router_eventos.get( '/:id_profesor', [ validar_token, validar_rol_usuario ], obtener_clases_x_profesor_dia );

router_eventos.post( '/', [ validar_token, validar_rol_usuario ], agendar_una_clase );

router_eventos.delete( '/:id_clase', [ validar_token, validar_rol_usuario ], eliminar_clase_con_profesor );

router_eventos.put( '/:id_clase', [ validar_token, validar_rol_usuario ], abonar_una_clase );

router_eventos.put( '/:id_clase', [ validar_token, validar_rol_usuario ], editar_una_clase );


module.exports = router_agendamientos_clase;





