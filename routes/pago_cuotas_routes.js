const Router = require( 'express' )


const {
        realizar_pago_socio,
        obtener_comprobante_pago_cuota } = require( '../controlers/socio_pagos_controller' );
        
const { comprobar_pago_cuota_socio } = require( '../helpers/comprobar_pago_cuota' );
//const { validar_usuario_administrador, validar_usuario_profesor, validar_usuario_socio } = require( '../middlewares/validar_roles_usuario' )

const router_pagos = Router();


router_pagos.get( '/socio/comprobante_pago/:id_cuota', [  ], obtener_comprobante_pago_cuota );

router_pagos.post( '/socio/pagar_cuota/:id_socio', [ comprobar_pago_cuota_socio ], realizar_pago_socio );










module.exports = router_pagos;