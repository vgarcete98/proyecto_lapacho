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
//----------------------------------------------------------------------------


router_cargo_gastos.get( '/',[  ], obtener_gastos_x_mes );

router_cargo_gastos.put( '/',[  ], editar_gasto_club );

router_cargo_gastos.post( '/',[  ], cargar_gasto_club );




module.exports = router_cargo_gastos;