const Router = require( 'express' )


const router_accesos = Router();

const { crear_accesos, obtener_accesos } = require( '../controlers/accesos_controller' )

router_accesos.get( '/', obtener_accesos );

router_accesos.post( '/', crear_accesos );


module.exports = router_accesos;