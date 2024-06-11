const Router = require( 'express' );


const  { obtener_data_socio  } = require('../helpers/verficar_socio_carga');


const { actualizar_ingreso,
        agregar_ingreso,
        borrar_ingreso,
        obtener_ingresos_x_fecha,
        obtener_ingresos_x_fecha_excel,
        obtener_tipos_ingreso, 
        generar_grafico_x_fecha_ingresos,
        obtener_grafico_torta_ingresos} = require( '../controlers/ingresos_controller' );



const router_ingresos = Router();


router_ingresos.get( '/', [], obtener_ingresos_x_fecha );
router_ingresos.get( '/tipos_ingreso', [], obtener_tipos_ingreso );
router_ingresos.get( '/obtener_grafico_ingresos', [], generar_grafico_x_fecha_ingresos );
router_ingresos.get( '/obtener_grafico_ingresos_torta', [], obtener_grafico_torta_ingresos );
router_ingresos.get( '/reportes_ingresos_excel', [  ], obtener_ingresos_x_fecha_excel );
router_ingresos.post('/agregar_ingreso', [ obtener_data_socio ], agregar_ingreso );
router_ingresos.put( '/actualizar_ingreso', [ obtener_data_socio ] , actualizar_ingreso);
router_ingresos.delete( '/borrar_ingreso/:id_ingreso', [ obtener_data_socio ], borrar_ingreso );





module.exports = router_ingresos;