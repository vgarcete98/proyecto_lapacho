const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const verificar_existe_reserva = async ( req = request, res = response, next )=> {

    try {

        const { idReserva } = req.body;
        const reserva = await prisma.reservas.findUnique( { where : { id_socio_reserva : Number( idReserva ) } } );

        
        if( reserva === null || reserva === undefined ){
            res.status( 400 ).json( {
                status : false,
                msg : 'Esa reserva no existe',
            } );
        }else { 
            next();
        }

    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al comprobar el pago : ${ error }`
        } );
        
    }

}



module.exports = { verificar_existe_reserva };