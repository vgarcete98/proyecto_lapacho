const Router = require( 'express' );
const { obtener_cuotas_pendientes_x_socio,
        obtener_cuotas_atrasadas_del_mes,
        obtener_cuotas_pagadas_del_mes, 
        obtener_cuotas_pendientes_del_mes } = require('../controlers/cuotas_controller');


const router_cuotas = Router();


router_cuotas.get( '/cuota_socio', [], obtener_cuotas_pendientes_x_socio );
router_cuotas.get( '/cuotas_atrasadas_mes', [], obtener_cuotas_atrasadas_del_mes);
router_cuotas.get( '/cuotas_pagadas_mes', [], obtener_cuotas_pagadas_del_mes);
router_cuotas.get( '/cuotas_pendientes_mes', [], obtener_cuotas_pendientes_del_mes);





module.exports = router_cuotas;
