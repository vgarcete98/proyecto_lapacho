const Router = require( 'express' );
const { obtener_cuotas_pendientes_x_socio,
        obtener_cuotas_atrasadas_del_mes,
        obtener_cuotas_pagadas_del_mes, 
        obtener_cuotas_pendientes_del_mes,
        obtener_grilla_de_cuotas, 
        obtener_cuotas_pagadas_x_socio,
        obtener_excel_cuotas_pagadas} = require('../controlers/cuotas_controller');


const router_cuotas = Router();


router_cuotas.get( '/cuota_socio', [], obtener_cuotas_pendientes_x_socio );
router_cuotas.get( '/cuotas_reporte', [], obtener_excel_cuotas_pagadas );
router_cuotas.get( '/cuota_socio/pagadas', [], obtener_cuotas_pagadas_x_socio );
router_cuotas.get( '/grilla_cuotas', [], obtener_grilla_de_cuotas );
router_cuotas.get( '/cuotas_atrasadas_mes', [], obtener_cuotas_atrasadas_del_mes);
router_cuotas.get( '/cuotas_pagadas_mes', [], obtener_cuotas_pagadas_del_mes);
router_cuotas.get( '/cuotas_pendientes_mes', [], obtener_cuotas_pendientes_del_mes);





module.exports = router_cuotas;
