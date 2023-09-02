const Router = require( 'express' )


// VALIDADORES 
//------------------------------------------------------------------------
const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
//------------------------------------------------------------------------


const {
        abonar_pase_jugador,
        generar_pase_jugador,
        obtener_pases_completados,
        obtener_pases_pendientes } = require( '../controlers/pases_jugadores_controller' );




const router_pases_jugadores = Router();


router_pases_jugadores.get ( '/', [ validar_token, validar_rol_usuario ], obtener_pases_completados );

router_pases_jugadores.get ( '/', [ validar_token, validar_rol_usuario ], obtener_pases_pendientes );

router_pases_jugadores.post ( '/', [ validar_token, validar_rol_usuario ], generar_pase_jugador );

router_pases_jugadores.put ( '/', [ validar_token, validar_rol_usuario ], abonar_pase_jugador );

module.exports = router_pases_jugadores;