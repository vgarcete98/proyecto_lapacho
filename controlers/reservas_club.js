const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const obtener_reservas_en_club = async ( req = request, res = response ) => {
    const reservas_club = await prisma.$queryRaw`SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS NOMBRE_SOCIO, B.ID_SOCIO, C.HORARIO_RESERVA_DESDE, 
                                                        C.HORARIO_RESERVA_HASTA, C.FECHA_RESERVA, C.ID_MESA AS NUMERO_MESA
                                                    FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                    JOIN SOCIO_RESERVAS D ON B.ID_SOCIO = D.ID_SOCIO
                                                    JOIN RESERVAS C ON D.ID_SOCIO_RESERVA = C.ID_SOCIO_RESERVA
                                                    JOIN MESAS F ON F.ID_MESA = C.ID_MESA;`;
    if ( reservas_club.length === 0 ) {
        res.status( 200 ).json( {
            reservas : false,
            msg : "No existen reservas"
        } );
    } else {
        res.status( 200 ).json( {
            reservas : true,
            msg : "Reservas del club",
            reservas_club
        } );
    }
}




const crear_reserva_en_club = async ( req = request, res = response ) => {


}





const editar_reserva_en_club = async ( req = request, res = response ) => {


}


const borrar_reserva_en_club = async ( req = request, res = response ) => {


}






module.exports = {
    obtener_reservas_en_club,
    crear_reserva_en_club,
    borrar_reserva_en_club, 
    editar_reserva_en_club
};
