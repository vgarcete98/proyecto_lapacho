const Router = require( 'express' )

const { validar_existe_rol_usuario } = require( '../middlewares/validar_existe_rol_usuario' )


const router_accesos = Router();

//------------------------------------------------
const { obtener_accesos,
        crear_accesos,
        eliminar_accesos,
        editar_accesos,
        asignar_accesos,
        quitar_accesos,
        crear_modulos,
        obtener_modulos,
        editar_modulos,
        eliminar_modulos,
        obtener_accesos_rol, } = require( '../controlers/accesos_controller' )
//------------------------------------------------

//---------------------------------------------------------------------------------------------------
router_accesos.get( '/obtener_accesos',[ ], obtener_accesos );

router_accesos.get( '/obtener_accesos_rol',[ ], obtener_accesos_rol );

router_accesos.post( '/crear_accesos',[ ], crear_accesos );

router_accesos.delete( '/eliminar_accesos',[], eliminar_accesos );

router_accesos.put( '/editar_accesos',[ ], editar_accesos );

router_accesos.post( '/asignar_accesos',[ ], asignar_accesos );

router_accesos.delete( '/quitar_accesos',[ ], quitar_accesos );

//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------

router_accesos.post( '/crear_modulos',[ ], crear_modulos );

router_accesos.get( '/obtener_modulos',[ ], obtener_modulos );

router_accesos.put( '/editar_modulos',[ ], editar_modulos );

router_accesos.delete( '/eliminar_modulos',[ ], eliminar_modulos );

//---------------------------------------------------------------------------------------------------

module.exports = router_accesos;