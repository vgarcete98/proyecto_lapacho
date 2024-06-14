const Router = require( 'express' )


const {
        realizar_pago_socio, 
        anular_pago_socio, 
        realizar_pago_socio_varios} = require( '../controlers/socio_pagos_controller' );
        
const { comprobar_pago_cuota_socio, comprobar_pago_cuota_socio_varios } = require( '../helpers/comprobar_pago_cuota' );
//const { validar_usuario_administrador, validar_usuario_profesor, validar_usuario_socio } = require( '../middlewares/validar_roles_usuario' )

const router_pagos = Router();


router_pagos.post( '/socio/pagar_cuota', [ comprobar_pago_cuota_socio ], realizar_pago_socio );

router_pagos.post( '/socio/pagar_cuota_varias', [ comprobar_pago_cuota_socio_varios ], realizar_pago_socio_varios );

router_pagos.delete( '/socio/anular_pago/:id_cuota', [ ], anular_pago_socio );








module.exports = router_pagos;