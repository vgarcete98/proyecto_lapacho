const Router = require( 'express' )



const { validar_existe_rol_usuario } = require( '../middlewares/validar_existe_rol_usuario' );

const { actualizar_egreso,
        agrega_regreso,
        borrar_egreso,
        obtener_egresos_x_fecha,
        obtener_egresos_x_fecha_excel,
        obtener_tipos_egreso } = require( '../controlers/egresos_controller' );


const router_egresos = Router();


router_egresos.get('/', [],  obtener_egresos_x_fecha );
router_egresos.get( '/tipos_egreso', obtener_tipos_egreso );
router_egresos.get( '/reportes_egresos_excel', obtener_egresos_x_fecha_excel );
router_egresos.post('/', [], agrega_regreso);
router_egresos.put( '/',[], actualizar_egreso );
router_egresos.delete('/', [], borrar_egreso);



module.exports = router_egresos;