const Router = require( 'express' );
const { obtener_cuotas_pendientes_del_mes,
        obtener_grilla_de_cuotas, 
        obtener_cuotas_x_socio,
        obtener_excel_cuotas_pagadas} = require('../controlers/cuotas_controller');
const { verificar_vista_usuario } = require('../helpers/verficar_socio_carga');


const router_cuotas = Router();

router_cuotas.get( '/cuotas_reporte', [], obtener_excel_cuotas_pagadas );
router_cuotas.get( '/cuota_socio', [ verificar_vista_usuario ], obtener_cuotas_x_socio );
router_cuotas.get( '/grilla_cuotas', [ verificar_vista_usuario ], obtener_grilla_de_cuotas );
router_cuotas.get( '/cuotas_pendientes_mes', [  ], obtener_cuotas_pendientes_del_mes);





module.exports = router_cuotas;
