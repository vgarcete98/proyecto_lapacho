const Router = require( 'express' )


const router_cargo_gastos = Router();


// VALIDADORES 
//------------------------------------------------------------------------
const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
//------------------------------------------------------------------------

//CONTROLADORES
//----------------------------------------------------------------------------
const {
    cargar_gasto_club,
    editar_gasto_club,
    obtener_gastos_x_mes } = require( '../controlers/gastos_controller' );
const { comprobar_gasto_cargado } = require('../helpers/comprobar_gasto_cargado');
//----------------------------------------------------------------------------


router_cargo_gastos.get( '/',[ validar_token, validar_rol_usuario ], obtener_gastos_x_mes );

router_cargo_gastos.put( '/',[ validar_token, validar_rol_usuario ], editar_gasto_club );

router_cargo_gastos.post( '/',[ validar_token, validar_rol_usuario, comprobar_gasto_cargado ], cargar_gasto_club );




module.exports = router_cargo_gastos;