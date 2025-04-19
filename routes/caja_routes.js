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
    generar_movimientos_de_caja_ventas,
    generar_movimientos_de_caja_compras,
    obtener_detalles_caja,
    obtener_movimientos_de_caja_al_cierre,
    obtener_resumen_de_caja_al_cierre
} = require( '../controlers/caja_controller' );
const { verificar_existe_caja_abierta, verificar_existe_caja_vigente } = require('../middlewares/verificar_existe_caja_abierta');

const {  
    verificar_compras_a_caja,
    verificar_ventas_a_caja,
    verificar_ventas_procesadas,
    verificar_compras_procesadas
} = require( '../middlewares/comprobar_tipos_movimientos_caja' ); 

const { comprobar_factura_registrada, comprobar_salto_factura, comprobar_utilizacion_factura_registrada } = require( '../helpers/comprobar_salto_facturas' )

const { verifica_ventas_existentes, verifica_compras_existentes } = require('../middlewares/verificar_movimientos_existentes');


const router_caja = Router();

router_caja.get( '/obtener_movimientos_caja', [  ],  obtener_movimientos_de_caja);

router_caja.post( '/generar_movimientos_de_caja/ventas', [ verificar_existe_caja_abierta, verifica_ventas_existentes, verificar_ventas_a_caja, verificar_ventas_procesadas, comprobar_utilizacion_factura_registrada, comprobar_factura_registrada, comprobar_salto_factura ], generar_movimientos_de_caja_ventas );

router_caja.post( '/generar_movimientos_de_caja/compras', [ verificar_existe_caja_abierta, verifica_compras_existentes, verificar_compras_a_caja, verificar_compras_procesadas ], generar_movimientos_de_caja_compras );

router_caja.get( '/obtener_movimientos_caja/detalle_movimiento', [  ],  obtener_detalle_movimiento_de_caja);

router_caja.post( '/crear_caja', [ verificar_existe_caja_vigente ],  crear_caja);

router_caja.put( '/actualizar_caja', [  ],  actualizar_caja);

router_caja.put( '/reabrir_caja', [  ],  reabrir_caja);

router_caja.put( '/cerrar_caja', [  ],  cerrar_caja);

router_caja.get( '/cerrar_caja/obtener_movimientos_caja_cierre', [  ],  obtener_movimientos_de_caja_al_cierre);


router_caja.get( '/cerrar_caja/obtener_resumen_caja_cierre', [  ],  obtener_resumen_de_caja_al_cierre);

router_caja.get( '/obtener_tipos_pago', [], obtener_tipo_pagos );

router_caja.post( '/crear_tipo_pago', [ ], crear_tipo_pago );

router_caja.get( 'obtener_detalles_caja', [  ], obtener_detalles_caja )

module.exports = router_caja;


