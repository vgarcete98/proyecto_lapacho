const Router = require( 'express' )



const { validar_existe_rol_usuario } = require( '../middlewares/validar_existe_rol_usuario' );

const { actualizar_egreso,
        agrega_regreso,
        borrar_egreso,
        obtener_egresos_x_fecha,
        obtener_egresos_x_fecha_excel,
        obtener_tipos_egreso } = require( '../controlers/egresos_controller' );


const router_egresos = Router();


router_egresos.route( '/' )
                .get( [],  obtener_egresos_x_fecha )
                .get( '/tipos_egreso', obtener_tipos_egreso )
                .get( '/reportes_egresos_excel', obtener_egresos_x_fecha_excel )
                .post( [], agrega_regreso)
                .put( [], actualizar_egreso )
                .delete( [], borrar_egreso);



module.exports = router_egresos;