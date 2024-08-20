const Router = require( 'express' );

const { crear_caja_chica,
        obtener_gastos_caja_chica,
        obtener_reposiciones_caja_chica,
        registrar_gasto_caja_chica,
        registrar_reposicion_caja_chica } = require( '../controlers/caja_chica_controller' );

const router_caja_chica = Router();


router_caja_chica.get( '/obtener_gastos_caja_chica', [  ],  obtener_gastos_caja_chica);

router_caja_chica.get( '/obtener_reposiciones_caja_chica', [  ],  obtener_reposiciones_caja_chica);

router_caja_chica.post( '/crear_caja_chica', [  ],  crear_caja_chica);

router_caja_chica.post( '/registrar_gasto_caja_chica', [  ],  registrar_gasto_caja_chica);

router_caja_chica.post( '/registrar_reposicion_caja_chica', [  ],  registrar_reposicion_caja_chica);



module.exports = router_caja_chica;