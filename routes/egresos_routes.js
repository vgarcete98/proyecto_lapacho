const Router = require( 'express' )

const  { obtener_data_socio  } = require('../helpers/verficar_socio_carga');

const { actualizar_egreso,
        agrega_regreso,
        borrar_egreso,
        obtener_egresos_x_fecha,
        obtener_egresos_x_fecha_excel,
        obtener_tipos_egreso, 
        generar_grafico_x_fecha,
        obtener_grafico_torta_egresos} = require( '../controlers/egresos_controller' );


const router_egresos = Router();


router_egresos.get('/', [],  obtener_egresos_x_fecha );
router_egresos.get( '/obtener_datos_grafico', [], generar_grafico_x_fecha );
router_egresos.get( '/obtener_datos_grafico_torta', [], obtener_grafico_torta_egresos );
router_egresos.get( '/tipos_egreso', obtener_tipos_egreso );
router_egresos.get( '/reportes_egresos_excel', obtener_egresos_x_fecha_excel );
router_egresos.post('/agregar_gasto', [ obtener_data_socio ], agrega_regreso);
router_egresos.put( '/actualizar_egreso',[ obtener_data_socio ], actualizar_egreso );
router_egresos.delete('/eliminar_egreso/:id_egreso', [ obtener_data_socio ], borrar_egreso);



module.exports = router_egresos;