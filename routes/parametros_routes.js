
const Router = require( 'express' )



const { editar_precio_de_cuotas, obtener_precios_de_cuotas, agregar_precio_de_cuota } = require( '../controlers/parametros_controller' );

const router_parametros = Router();


router_parametros.get( '/cuotas/obtener_precio_cuotas', obtener_precios_de_cuotas);


router_parametros.put( '/cuotas/editar_precio_cuota', editar_precio_de_cuotas);


router_parametros.post( '/cuotas/agregar_precio_cuota', agregar_precio_de_cuota );


//PARA LOS PRECIOS DE RESERVAS
router_parametros.get( '/cuotas/obtener_detalle_cuotas', obtener_precios_de_cuotas);

router_parametros.post( '/cuotas/agregar_precio_cuota', agregar_precio_de_cuota );



module.exports = router_parametros;




