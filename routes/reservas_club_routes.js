const Router = require( 'express' );

const { obtener_data_socio, verificar_vista_usuario, verificar_acceso_usuario } = require( '../helpers/verficar_socio_carga' );
const comprobar_disponibilidad_reserva = require( '../helpers/comprobar_disponibilidad_reserva' );
const { borrar_reserva_en_club,
        crear_reserva_en_club,
        editar_reserva_en_club,
        obtener_reservas_en_club,
        obtener_mesas_reserva, 
        obtener_mesas_disponibles_x_horario,
        realizar_reserva_via_bff,
        crear_reserva_en_club_administrador,
        agregar_reserva_a_venta} = require( '../controlers/reservas_club' );
const { verificar_existe_reserva } = require('../helpers/verificar_existe_reserva');
const { verifica_precio_de_reservas } = require('../middlewares/verficar_precio_reservas');
const { verificar_reservas_generadas } = require('../middlewares/verificar_reservas_generadas');

const router_reservas_club = Router();


router_reservas_club.get( '/obtener_mesas_disponibles',[ ], obtener_mesas_reserva );

router_reservas_club.get( '/obtener_reservas_club', [ verificar_vista_usuario ], obtener_reservas_en_club );


router_reservas_club.post( '/agregar_reserva_a_venta', [ verificar_reservas_generadas ], agregar_reserva_a_venta );

router_reservas_club.post( '/crear_reserva_club', [ comprobar_disponibilidad_reserva, obtener_data_socio, verifica_precio_de_reservas ], crear_reserva_en_club );

router_reservas_club.post( '/crear_reserva_club_administrador', [ comprobar_disponibilidad_reserva, obtener_data_socio ], crear_reserva_en_club_administrador );

router_reservas_club.delete( '/borrar_reserva_club', [ obtener_data_socio, verificar_existe_reserva ], borrar_reserva_en_club );

router_reservas_club.put( '/editar_reserva_club', [ obtener_data_socio, verificar_existe_reserva ], editar_reserva_en_club );

router_reservas_club.post( '/obtener_mesas_disponibles_x_horario',[ ], obtener_mesas_disponibles_x_horario );


router_reservas_club.post( '/realizar_reserva_via_bff',[ verificar_acceso_usuario, ], realizar_reserva_via_bff );


module.exports = router_reservas_club;
