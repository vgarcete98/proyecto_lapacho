const Router = require( 'express' )



const { validar_existe_rol_usuario } = require( '../middlewares/validar_existe_rol_usuario' );

const { actualizar_egreso,
        agrega_regreso,
        borrar_egreso,
        obtener_egresos_x_fecha,
        obtener_egresos_x_fecha_excel,
        obtener_tipos_egreso, 
        generar_grafico_x_fecha} = require( '../controlers/egresos_controller' );


const router_egresos = Router();


router_egresos.get('/', [],  obtener_egresos_x_fecha );
router_egresos.get( '/obtener_datos_grafico', [], generar_grafico_x_fecha )
router_egresos.get( '/tipos_egreso', obtener_tipos_egreso );
router_egresos.get( '/reportes_egresos_excel', obtener_egresos_x_fecha_excel );
router_egresos.post('/agregar_gasto', [], agrega_regreso);
router_egresos.put( '/actualizar_egreso/:id_egreso',[], actualizar_egreso );
router_egresos.delete('/eliminar_egreso/:id_egreso', [], borrar_egreso);



module.exports = router_egresos;