const Router = require( 'express' );


const comprobar_disponibilidad_reserva = require( '../helpers/comprobar_disponibilidad_reserva' );
const {
    borrar_reserva_en_club,
    crear_reserva_en_club,
    editar_reserva_en_club,
    obtener_reservas_en_club
    } = require( '../controlers/reservas_club' );

const router_reservas_club = Router();


router_reservas_club.get( '/', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_reservas_en_club );

router_reservas_club.post( '/', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ comprobar_disponibilidad_reserva ], crear_reserva_en_club );

router_reservas_club.delete( '/:id', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], borrar_reserva_en_club );

router_reservas_club.put( '/:id', [ /*validar_token,*/ /*/*validar_rol_usuario,*/  ], editar_reserva_en_club );



module.exports = router_reservas_club;
