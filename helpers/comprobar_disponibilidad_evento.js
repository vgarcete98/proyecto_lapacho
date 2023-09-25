const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')

const prisma = new PrismaClient();


const comprobar_disponibilidad_evento = async ( req = request, res = response, next )=> {

    try {
        const { fecha_desde, fecha_hasta } = req.body;
        const evento = await prisma.calendario_eventos.findFirst( { 
                                                                    where : {  
                                                                        AND : [
                                                                            { fecha_desde_evento : fecha_desde },
                                                                            { fecha_hasta_evento : fecha_hasta }
                                                                        ]                  
                                                                    } 
                                                                } );
        if ( evento === null || evento === undefined ){
            next();
        }else {
            res.status( 400 ).json( {
                status : true,
                msg : 'Esa fecha para ese evento no se encuentra libre',
                evento
            } );
        }
    } catch (error) {

        console.log( error );
        
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al buscar fecha libre',
            error
        } );
    }
}

module.exports = comprobar_disponibilidad_evento;

