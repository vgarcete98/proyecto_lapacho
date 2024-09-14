const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();




const verificar_existe_evento = async ( req = request, res = response, next) =>{


    try {

        const { horaDesde, horaHasta } = req.body;

        let fecha_desde_convert = DateTime.fromISO(horaDesde);
        let fecha_hasta_convert = DateTime.fromISO(horaHasta);

        const evento = await prisma.calendario_eventos.findFirst( { 
                                                                    where : { 
                                                                        AND : [
                                                                            { 
                                                                                fecha_desde_evento : { lte : fecha_desde_convert }
                                                                            },
                                                                            {
                                                                                fecha_hasta_evento :{ gte : fecha_hasta_convert }
                                                                            }
                                                                        ]
                                                                    } 
                                                                } );

        
        if ( evento === null || evento === undefined ){
            next();
        }else {

            const { decripcion_evento, nombre_evento } = evento;

            res.status( 400 ).json({

                status : false,
                msg : 'Ya existe un evento para esa fecha, cambie la misma',
                decripcion : `${ nombre_evento }, ${ decripcion_evento }`
            })


        }
        
    } catch (error) {
        
    }



}






module.exports = {verificar_existe_evento};