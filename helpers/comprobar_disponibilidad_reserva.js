const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')

const prisma = new PrismaClient();




const comprobar_disponibilidad_reserva = async ( req = request, res = response, next )=> {

    const { mesa_reserva, fecha_uso_reserva } = req.body;

    try {
        const existe_reserva = await prisma.reservas.findUnique( { 
                                                                    where : { 
                                                                        
                                                                        AND : [ 
                                                                            { id_mesa : mesa_reserva }, 
                                                            
                                                                            { fecha_para_reserva : fecha_uso_reserva }
                                                                        ]
                                                                    } 
                                                                } );
        if ( existe_reserva === null || existe_reserva === undefined ){
            next();
        }else{
            res.status( 400 ).json( {
                status : false,
                msg : "No existe fecha libre para esa reserva"
            } );
        }

    } catch (error) {
        
    }

}

module.exports = comprobar_disponibilidad_reserva;