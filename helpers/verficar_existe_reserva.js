const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();




const verificar_existe_reserva = async ( req = request, res = response, next) =>{


    try {

        const { horaDesde, horaHasta } = req.body;

        let fecha_desde_convert = DateTime.fromISO(horaDesde);
        let fecha_hasta_convert = DateTime.fromISO(horaHasta);

        const evento = await prisma.reservas.findFirst( { 
                                                                    where : { 
                                                                        AND : [
                                                                            { 
                                                                                hora_desde : { lte : fecha_desde_convert }
                                                                            },
                                                                            {
                                                                                hora_hasta :{ gte : fecha_hasta_convert }
                                                                            }
                                                                        ]
                                                                    } 
                                                                } );

        
        if ( evento === null || evento === undefined ){
            next();
        }else {

            const { fecha_reserva, hora_desde, hora_hasta } = evento;

            res.status( 400 ).json({

                status : false,
                msg : 'Ya existe una reserva para esa fecha, cambie la misma',
                decripcion : `Fecha de reserva ${ fecha_reserva }, con horario ${ hora_desde }, ${ hora_hasta }`
            })


        }
        
    } catch (error) {
        
    }



}






module.exports = {verificar_existe_reserva};