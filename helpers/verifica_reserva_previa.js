const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')

const prisma = new PrismaClient();




const verifica_reserva_previa = async ( req = request, res = response, next )=> {

    try {
        const { idMesa, horaDesde, horaHasta, tipoIngreso, idCliente } = req.body;

        
        let existe_reserva = [];

        existe_reserva = await prisma.reservas.findMany( { 
                                                            where : { 
                                                                hora_desde : ( tipoIngreso !== 'RESERVA EXPRESS' )? { gte : new Date( horaDesde ) } : null,
                                                                hora_hasta : ( tipoIngreso !== 'RESERVA EXPRESS' )? { lte : new Date( horaHasta ) }: null,
                                                                
                                                                AND : [ 
                                                                    { id_mesa : ( tipoIngreso !== 'RESERVA EXPRESS' )? idMesa : null}, 
                                                                    { id_cliente : Number(idCliente) }
                                                                ]
                                                            } 
                                                        } );

        
        if ( existe_reserva.length === 0 ){
            next();
        }else{
            res.status( 400 ).json( {
                status : false,
                msg : "No existe fecha libre para esa reserva"
            } );
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se logro verificar si habia reserva en esa fecha : ${ error }`
        } );
    }

}



module.exports = { verifica_reserva_previa }