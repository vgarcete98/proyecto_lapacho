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
        obtener_pases_pendientes, 
        obtener_clubes_disponibles,
        obtener_todos_los_clubes} = require( '../controlers/pases_jugadores_controller' );
const comprobar_traspaso_activo = require('../helpers/comprobar_traspaso_activo');




const router_pases_jugadores = Router();


router_pases_jugadores.get ( '/pases_abonados', [ validar_token, validar_rol_usuario ], obtener_pases_completados );

router_pases_jugadores.get ( '/pases_pendientes', [ validar_token, validar_rol_usuario ], obtener_pases_pendientes );

router_pases_jugadores.post ( '/', [ validar_token, validar_rol_usuario, comprobar_traspaso_activo ], generar_pase_jugador );

router_pases_jugadores.put ( '/abonar_pase/:id_pase', [ validar_token, validar_rol_usuario ], abonar_pase_jugador );

router_pases_jugadores.get ( '/clubes_disponibles', [ validar_token, validar_rol_usuario ], obtener_clubes_disponibles );


router_pases_jugadores.post ( '/todos_los_clubes', [ validar_token, validar_rol_usuario ], obtener_todos_los_clubes );


router_pases_jugadores.delete ( '/todos_los_clubes/:id_club', [ validar_token, validar_rol_usuario ], obtener_todos_los_clubes );

module.exports = router_pases_jugadores;