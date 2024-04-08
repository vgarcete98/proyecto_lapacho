const Router = require( 'express' )


const { validar_existe_rol_usuario } = require( '../middlewares/validar_existe_rol_usuario' );


const { actualizar_ingreso,
        agregar_ingreso,
        borrar_ingreso,
        obtener_ingresos_x_fecha,
        obtener_ingresos_x_fecha_excel,
        obtener_tipos_ingreso } = require( '../controlers/ingresos_controller' )



const router_ingresos = Router();


router_ingresos.get( '/', [], obtener_ingresos_x_fecha );
router_ingresos.get( '/tipos_ingreso', [], obtener_tipos_ingreso );
router_ingresos.get( '/reportes_ingresos_excel', [  ], obtener_ingresos_x_fecha_excel );
router_ingresos.post('/agregar_ingreso', [], agregar_ingreso );
router_ingresos.put( '/actualizar_ingreso/:id_ingreso', [] , actualizar_ingreso);
router_ingresos.delete( '/borrar_ingreso/:id_ingreso', [], borrar_ingreso );





module.exports = router_ingresos;