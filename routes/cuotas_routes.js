const Router = require( 'express' );
const { obtener_cuotas_pendientes_del_mes,
        obtener_grilla_de_cuotas, 
        obtener_cuotas_x_socio,
        obtener_excel_cuotas_pagadas,
        obtener_cuotas_pendientes_x_socio_a_la_fecha,
        obtener_cuotas_pendientes_a_la_fecha} = require('../controlers/cuotas_controller');
const { verificar_vista_usuario } = require('../helpers/verficar_socio_carga');


const router_cuotas = Router();

router_cuotas.get( '/cuotas_reporte', [], obtener_excel_cuotas_pagadas );
router_cuotas.get( '/cuota_socio', [ verificar_vista_usuario ], obtener_cuotas_x_socio );
router_cuotas.get( '/grilla_cuotas', [ verificar_vista_usuario ], obtener_grilla_de_cuotas );
router_cuotas.get( '/cuotas_pendientes_mes', [  ], obtener_cuotas_pendientes_del_mes);


router_cuotas.get( '/cuotas_pendientes_a_la_fecha_x_socio', [  ], obtener_cuotas_pendientes_x_socio_a_la_fecha);

router_cuotas.get( '/cuotas_pendientes_a_la_fecha', [  ], obtener_cuotas_pendientes_a_la_fecha);


module.exports = router_cuotas;
