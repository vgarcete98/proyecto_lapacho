const Router = require( 'express' )


const { validar_existe_rol_usuario } = require( '../middlewares/validar_existe_rol_usuario' );


const { actualizar_ingreso,
        agregar_ingreso,
        borrar_ingreso,
        obtener_ingresos_x_fecha,
        obtener_ingresos_x_fecha_excel,
        obtener_tipos_ingreso } = require( '../controlers/ingresos_controller' )



const router_ingresos = Router();



router_ingresos.route( '/' )
                .get( [], obtener_ingresos_x_fecha )
                .get( [], '/tipos_ingreso', obtener_tipos_ingreso )
                .get( '/reportes_ingresos_excel', [  ], obtener_ingresos_x_fecha_excel )
                .post( [], agregar_ingreso )
                .put( [] , actualizar_ingreso)
                .delete( [], borrar_ingreso );





module.exports = router_ingresos;