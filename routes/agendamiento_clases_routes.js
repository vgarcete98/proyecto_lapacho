const Router = require( 'express' )



const { abonar_una_clase,
        agendar_una_clase,
        editar_una_clase,
        eliminar_clase_con_profesor,
        obtener_clases_del_dia,
        obtener_clases_x_profesor_dia, 
        obtener_clases_del_dia_x_socio} = require( '../controlers/agendamiento_clases_controller' );
const { comprobar_horario_profesor } = require('../helpers/comprobar_disponibilidad_profesor');

const router_agendamientos_clase = Router();


router_agendamientos_clase.get( '/obtener_clases_x_fecha', [], obtener_clases_del_dia );

router_agendamientos_clase.get( '/obtener_clases_x_fecha_socio', [], obtener_clases_del_dia_x_socio );

router_agendamientos_clase.get( '/obtener_clases_x_fecha_profesor', [], obtener_clases_x_profesor_dia );

router_agendamientos_clase.post( '/agendar_clase', [ comprobar_horario_profesor ], agendar_una_clase );

router_agendamientos_clase.delete( '/cancelar_clase', [], eliminar_clase_con_profesor );

router_agendamientos_clase.put( '/pagar_x_clase', [], abonar_una_clase );

router_agendamientos_clase.put( '/editar_clase', [ ], editar_una_clase );


module.exports = router_agendamientos_clase;





