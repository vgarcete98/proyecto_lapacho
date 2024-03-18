const Router = require( 'express' );
const { obtener_cuotas_pendientes_x_socio } = require('../controlers/cuotas_controller');


const router_cuotas = Router();


router_cuotas.get( '/', [], obtener_cuotas_pendientes_x_socio )



module.exports = router_cuotas;
