const Router = require( 'express' );



const { 
        borrar_reserva_en_club_no_socio,
        crear_reserva_en_club_no_socio,
        editar_reserva_en_club_no_socio,
        obtener_mesas_disponibles_x_horario,
        obtener_mesas_reserva,
        obtener_reservas_en_club_no_socio

    } = require( '../controlers/reservas_no_socios_controller' );

const router_reservas_club_no_socio = Router();



router_reservas_club_no_socio.get( '/obtener_mesas_disponibles',[ ], obtener_mesas_reserva );


//----------------------------------------------------------------------------------------------------------------

router_reservas_club_no_socio.get( '/obtener_reservas_club_no_socio', [ ], obtener_reservas_en_club_no_socio );

router_reservas_club_no_socio.post( '/crear_reserva_club_no_socio', [ ], crear_reserva_en_club_no_socio );

router_reservas_club_no_socio.delete( '/borrar_reserva_club_no_socio', [ ], borrar_reserva_en_club_no_socio );

router_reservas_club_no_socio.put( '/editar_reserva_club_no_socio', [ ], editar_reserva_en_club_no_socio );

//----------------------------------------------------------------------------------------------------------------


router_reservas_club_no_socio.post( '/obtener_mesas_disponibles_x_horario',[ ], obtener_mesas_disponibles_x_horario );





module.exports = router_reservas_club_no_socio;