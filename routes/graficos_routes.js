const Router = require( 'express' );

const router_graficos= Router();

const { 
        obtener_cant_socios_al_dia,
        obtener_socios_al_dia_detalle,
        obtener_data_costo_clase,
        obtener_data_alumnos_promedio,
        obtener_data_aceptacion_profesores
        } = require( '../controlers/graficos_controller' )

router_graficos.get( '/obtener_socios_al_dia_detalle', [  ],  obtener_socios_al_dia_detalle);

router_graficos.get( '/obtener_cant_socios_al_dia', [  ],  obtener_cant_socios_al_dia);

router_graficos.get( '/obtener_data_costo_clase', [  ],  obtener_data_costo_clase);

router_graficos.get( '/obtener_data_alumnos_promedio', [  ],  obtener_data_alumnos_promedio);

router_graficos.get( '/obtener_data_aceptacion_profesores', [  ],  obtener_data_aceptacion_profesores);

module.exports = router_graficos;