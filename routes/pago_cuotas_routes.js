const Router = require( 'express' )


const {
        obtener_pagos_x_mes,
        obtener_pagos_x_socio,
        realizar_pago_socio } = require( '../controlers/socio_pagos_controller' );
        
const validar_token = require( '../middlewares/validar_token' );

const router_pagos = Router();


router_pagos.get( '/', [ validar_token ], obtener_pagos_x_mes );

router_pagos.get( '/', [ validar_token ], obtener_pagos_x_socio );

router_pagos.post( '/', [ validar_token ], realizar_pago_socio );


module.exports = router_pagos;