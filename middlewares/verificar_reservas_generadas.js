const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();





const verificar_reservas_generadas = async ( req = request, res = response, next )=>{

    try {

        const { reservas } = req.body;
        //const evento = await prisma.eventos.findFirst( { where : { id_evento : Number( idEvento ) } } );
        let reserva_falsa = false;
        for (const element of reservas) {
            let {  idReserva } = element;
            let reserva = await prisma.reservas.findUnique( { where : { id_cliente_reserva : Number( idReserva ) } } );
            if ( reserva === null ) { 
                reserva_falsa = true;
            }


        }

        if ( !reserva_falsa ){

            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'DEbe verificar las reservas adjuntadas',
                descipcion : `Una de las reservas adjuntadas no existe`
            } ); 
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar si existen todas las reservas',
            //error
        } );
    }

    
}



module.exports = {
    verificar_reservas_generadas,

}