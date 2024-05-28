const Router = require( 'express' );

const { obtener_data_socio, verificar_vista_usuario } = require( '../helpers/verficar_socio_carga' );
const comprobar_disponibilidad_reserva = require( '../helpers/comprobar_disponibilidad_reserva' );
const { borrar_reserva_en_club,
        crear_reserva_en_club,
        editar_reserva_en_club,
        obtener_reservas_en_club,
        obtener_mesas_reserva } = require( '../controlers/reservas_club' );

const router_reservas_club = Router();


router_reservas_club.get( '/obtener_mesas_disponibles',[ ], obtener_mesas_reserva );

router_reservas_club.get( '/obtener_reservas_club', [ verificar_vista_usuario ], obtener_reservas_en_club );

router_reservas_club.post( '/crear_reserva_club', [ comprobar_disponibilidad_reserva, obtener_data_socio ], crear_reserva_en_club );

router_reservas_club.delete( '/borrar_reserva_club', [ obtener_data_socio ], borrar_reserva_en_club );

router_reservas_club.put( '/editar_reserva_club', [ obtener_data_socio ], editar_reserva_en_club );



module.exports = router_reservas_club;
