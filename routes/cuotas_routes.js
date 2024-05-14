const Router = require( 'express' );
const { obtener_cuotas_pendientes_del_mes,
        obtener_grilla_de_cuotas, 
        obtener_cuotas_x_socio,
        obtener_excel_cuotas_pagadas} = require('../controlers/cuotas_controller');


const router_cuotas = Router();

router_cuotas.get( '/cuotas_reporte', [], obtener_excel_cuotas_pagadas );
router_cuotas.get( '/cuota_socio', [], obtener_cuotas_x_socio );
router_cuotas.get( '/grilla_cuotas', [], obtener_grilla_de_cuotas );
router_cuotas.get( '/cuotas_pendientes_mes', [], obtener_cuotas_pendientes_del_mes);





module.exports = router_cuotas;
