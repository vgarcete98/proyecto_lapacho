const Router = require( 'express' );

const router_graficos= Router();

const { 
        obtener_cant_socios_al_dia,
        obtener_socios_al_dia_detalle
        } = require( '../controlers/graficos_controller' )

router_graficos.get( '/obtener_socios_al_dia_detalle', [  ],  obtener_socios_al_dia_detalle);

router_graficos.get( '/obtener_cant_socios_al_dia', [  ],  obtener_cant_socios_al_dia);



module.exports = router_graficos;