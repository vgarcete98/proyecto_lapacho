const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const verifica_precio_de_reservas = await = async ( req = request, res = response, next )=>{

    try {
        const precio_reserva = await prisma.precio_reservas.findFirst( { 
            where : { valido : true },
            orderBy : {
                id_precio_reserva : 'desc'
            }
        } );
    if ( precio_reserva !== null  ) {
        const { id_precio_reserva, monto_reserva, valido  } = precio_reserva;

        req.body.idPrecioReserva = Number( id_precio_reserva );
        req.body.montoReserva = Number( monto_reserva )
        next();
    }else {
        res.status( 400 ).json( {
            status : false,
            msg : 'Debe de generar el precio para las reservas',
            descipcion : `No existe un precio establecido para las reservas`
        } ); 
    }

    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `Reserva no generada : Ocurrio un error al verificar el precio para esa reserva`,
            //error
        } );
    }

}


module.exports = {
    verifica_precio_de_reservas
}


