const Router = require( 'express' )

const { check } = require( 'express-validator' );
const router_cargo_gastos = Router();

const { multer_instance2, multer_instance1 } = require( '../models/multer_config' )


// VALIDADORES 
//------------------------------------------------------------------------
//const //validar_token = require( '../middlewares///validar_token' );
//const /*/*validar_rol_usuario,*/ = require('../middlewares//*/*validar_rol_usuario,*/*/');
//------------------------------------------------------------------------

//CONTROLADORES
//----------------------------------------------------------------------------
const {
    cargar_gasto_club,
    editar_gasto_club,
    obtener_gastos_x_mes, 
    borrar_gasto, 
    obtener_comprobante_gasto } = require( '../controlers/gastos_controller' );

const { comprobar_gasto_cargado } = require('../helpers/comprobar_gasto_cargado');
//----------------------------------------------------------------------------
const upload2 = multer_instance2;

router_cargo_gastos.get( '/',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_gastos_x_mes );

router_cargo_gastos.put( '/:id_gasto',
                                    [ 
                                        /*validar_token,*/ 
                                        /*/*validar_rol_usuario,*/
                                    ], 
                                    upload2.single( 'archivo' ), editar_gasto_club );

router_cargo_gastos.post( '/', upload2.single( 'archivo' ), 
                                [ /*validar_token,*/ 
                                    /*/*validar_rol_usuario,*/ 
                                    //check( 'nroFactura' ).isEmpty() , 
                                    comprobar_gasto_cargado 
                                ], cargar_gasto_club );

router_cargo_gastos.delete( '/:id_gasto',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], borrar_gasto );


router_cargo_gastos.get( '/comprobante_gasto/:id_gasto', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_comprobante_gasto  )

module.exports = router_cargo_gastos;