const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')

const prisma = new PrismaClient();


const comprobar_disponibilidad_evento = async ( req = request, res = response, next )=> {

    try {
        const { fechaDesde, fechaHasta } = req.body;
        const evento = await prisma.calendario_eventos.findFirst( { 
                                                                    where : {  
                                                                        AND : [
                                                                            { fecha_desde_evento : fechaDesde },
                                                                            { fecha_hasta_evento : fechaHasta }
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

