const Router = require( 'express' )


// VALIDADORES 
//------------------------------------------------------------------------
const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
//------------------------------------------------------------------------



const router_pases_jugadores = Router();






module.exports = router_pases_jugadores;