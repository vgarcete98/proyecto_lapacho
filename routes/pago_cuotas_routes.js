const Router = require( 'express' )


const {
        obtener_pagos_x_mes,
        obtener_pagos_x_socio,
        obtener_cuotas_pendientes_x_socio,
        realizar_pago_socio } = require( '../controlers/socio_pagos_controller' );
        
const validar_token = require( '../middlewares/validar_token' );
//const { validar_usuario_administrador, validar_usuario_profesor, validar_usuario_socio } = require( '../middlewares/validar_roles_usuario' )

const router_pagos = Router();


router_pagos.get( '/', [ validar_token,  ], obtener_pagos_x_mes );

router_pagos.get( '/socio', [ validar_token ], obtener_pagos_x_socio );

router_pagos.get( '/socio/pagos_pendientes', [ validar_token ], obtener_cuotas_pendientes_x_socio )

router_pagos.post( '/', [ validar_token ], realizar_pago_socio );


module.exports = router_pagos;