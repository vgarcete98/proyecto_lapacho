const Router = require( 'express' );

const {
    cerrar_caja,
    crear_caja,
    eliminar_caja,
    reabrir_caja,
    actualizar_caja,
    obtener_detalle_movimiento_de_caja,
    obtener_movimientos_de_caja,
    crear_tipo_pago,
    obtener_tipo_pagos,
    generar_movimientos_de_caja
} = require( '../controlers/caja_controller' );


const router_caja = Router();

router_caja.get( '/obtener_movimientos_caja', [  ],  obtener_movimientos_de_caja);

router_caja.post( '/generar_movimientos_de_caja', [  ], generar_movimientos_de_caja );



router_caja.get( '/obtener_movimientos_caja/detalle_movimiento', [  ],  obtener_detalle_movimiento_de_caja);



router_caja.post( '/crear_caja', [  ],  crear_caja);

router_caja.put( '/actualizar_caja', [  ],  actualizar_caja);

router_caja.put( '/reabrir_caja', [  ],  reabrir_caja);

router_caja.put( '/cerrar_caja', [  ],  cerrar_caja);

router_caja.get( '/obtener_tipos_pago', [], obtener_tipo_pagos );

router_caja.post( '/crear_tipo_pago', [ ], crear_tipo_pago );



module.exports = router_caja;


