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

    const { id_tipo, id_socio, fecha_desde, fecha_hasta, id_mesa } = req.body;

    try {
        
        const nueva_reserva = await prisma.socio_reservas.create( { data : {
                                                                                id_socio,
                                                                                fecha_reserva : new Date(),
                                                                            } 
                                                                } );
        const { id_socio_reserva } = nueva_reserva;
        const reserva = await prisma.reservas.create( { data : {
                                                                    id_tipo_reserva : id_tipo,
                                                                    horario_reserva_desde : fecha_desde,
                                                                    horario_reserva_hasta : fecha_hasta,
                                                                    id_socio_reserva,
                                                                    id_mesa
                                                                } 
                                                    } );
        res.status( 200 ).json( {
            status : true,
            msg : "Reserva creada exitosamente",
            reserva
        } );
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Reserva no generada",
            error
        } );
        
    }



}





const editar_reserva_en_club = async ( req = request, res = response ) => {

    const { mesa, fecha_desde, fecha_hasta , id_reserva} = req.body;

    try {
        const reserva_editada = await prisma.socio_reservas.update( {   where : { id_reserva_socio : id_reserva },
                                                                        data : {
                                                                                    reserva_editada : new Date()
                                                                                } 
                                                                    } );
        const { id_socio_reserva } = reserva_editada
        const reserva = await prisma.reservas.update ( { 
                                                            where : { id_reserva : id_socio_reserva },
                                                            data : { 
                                                                horario_reserva_desde : fecha_desde,
                                                                horario_reserva_hasta : fecha_hasta,
                                                                id_mesa : mesa
                                                            }
                                                    } );
        res.status( 200 ).json( {
            status : true,
            msg : "Reserva editada con exito",
            reserva
        } );
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al editar la reserva",
            error
        } );
    }


}


const borrar_reserva_en_club = async ( req = request, res = response ) => {

    const { id_reserva_socio } = req.params;
    try {
        
        const reserva_cancelada = await prisma.socio_reservas.update( { 
            where : { id_socio_reserva : id_reserva_socio },
            data : { 
                reserva_eliminada : true,
                reserva_editada : new Date()
            } 
        } );

        res.status( 200 ).json( {
            status : true,
            msg : "Reserva eliminada con exito",
            reserva_cancelada
        } );

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al eliminar la reserva",
            error
        } );
        
    }




}






module.exports = {
    obtener_reservas_en_club,
    crear_reserva_en_club,
    borrar_reserva_en_club, 
    editar_reserva_en_club
};
