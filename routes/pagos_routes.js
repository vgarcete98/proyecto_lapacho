const Router = require( 'express' )


const {
        realizar_pago_socio, 
        anular_pagos_cliente, 
        generar_venta_cuota_socio
        } = require( '../controlers/clientes_pagos_controller' );
        
const { comprobar_pago_cuota_socio, comprobar_pago_cuota_socio_varios } = require( '../helpers/comprobar_pago_cuota' );
//const { validar_usuario_administrador, validar_usuario_profesor, validar_usuario_socio } = require( '../middlewares/validar_roles_usuario' )

const router_pagos = Router();


router_pagos.post( '/socio/pagar_cuota', [ comprobar_pago_cuota_socio ], realizar_pago_socio );



router_pagos.post( '/socio/generar_venta_cuota_varias', [ comprobar_pago_cuota_socio_varios ], generar_venta_cuota_socio );







router_pagos.delete( '/cliente/anular_pagos', [ ], anular_pagos_cliente );








module.exports = router_pagos;