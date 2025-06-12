const Router = require( 'express' )


const {
                realizar_pago_socio, 
                anular_pagos_cliente, 
                generar_venta_cuota_socio
        } = require( '../controlers/clientes_pagos_controller' );


const {
        actualizar_venta_servicios,
        eliminar_venta_servicios,
        generar_venta_servicios,
        obtener_venta_servicios
} = require( '../controlers/ventas_controller' )
        
const { comprobar_pago_cuota_socio, comprobar_pago_cuota_socio_varios } = require( '../helpers/comprobar_pago_cuota' );
const { comprueba_pago_cuotas_consec } = require('../middlewares/comprueba_pago_cuotas_consec');
const { comprueba_pago_cuotas_socio_y_dep } = require('../middlewares/comprueba_cuotas_socio_y_dep');
const { verifica_cuota_pendiente_pago } = require('../middlewares/verifica_cuota_pendiente_pago');
const { verificar_servicio_en_venta } = require('../helpers/verificar_servicio_en_venta');


const router_pagos = Router();


router_pagos.post( '/socio/pagar_cuota', [ comprobar_pago_cuota_socio ], realizar_pago_socio );

router_pagos.post( '/cliente/generar_venta_servicios', [  ], generar_venta_servicios );




router_pagos.get( '/cliente/obtener_venta_clientes', [  ], obtener_venta_servicios );

router_pagos.put( '/cliente/cancelar_venta_servicios', [  ], eliminar_venta_servicios );

router_pagos.put( '/cliente/actualizar_venta_servicios', [  ], actualizar_venta_servicios )

router_pagos.post( '/socio/generar_venta_cuota_varias', [ comprueba_pago_cuotas_socio_y_dep,
                                                                verifica_cuota_pendiente_pago, 
                                                                comprobar_pago_cuota_socio_varios, 
                                                                comprueba_pago_cuotas_consec,
                                                                verificar_servicio_en_venta 
                                                        ], generar_venta_cuota_socio );


router_pagos.post( '/cliente/generar_venta_reserva', [  ], generar_venta_servicios );



router_pagos.delete( '/cliente/anular_pagos', [ ], anular_pagos_cliente );








module.exports = router_pagos;