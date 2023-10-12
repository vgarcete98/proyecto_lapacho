const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')

const { generar_fecha } = require( '../helpers/generar_fecha' ) 

const prisma = new PrismaClient();


const comprobar_disponibilidad_evento = async ( req = request, res = response, next )=> {

    try {
        const { fechaDesde, fechaHasta } = req.body;
        const [ fecha_desde_convertido, fecha_hasta_convertido ] = [ generar_fecha( fechaDesde ), generar_fecha( fechaHasta ) ];
        console.log( fecha_desde_convertido, fecha_hasta_convertido );
        const evento = await prisma.calendario_eventos.findFirst( { 
                                                                    where : {  
                                                                        AND : [
                                                                            { fecha_desde_evento : fecha_desde_convertido },
                                                                            { fecha_hasta_evento : fecha_hasta_convertido }
                                                                        ]                  
                                                                    } 
                                                                } );
        if ( evento === null || evento === undefined ){
            next();
        }else {

            const { fecha_desde_evento, fecha_hasta_evento, costo, decripcion_evento  } = evento;
            res.status( 400 ).json( {
                status : true,
                msg : 'Esa fecha para ese evento no se encuentra libre',
                evento : {
                    fechaDesde : fecha_desde_evento,
                    fechaHasta : fecha_hasta_evento,
                    descripcion : decripcion_evento,
                    costo,
                    //idTipoEvento : tipoEvento
                }
            } );
        }
    } catch (error) {

        console.log( error );
        
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al buscar fecha libre',
            //error
        } );
    }
}






const comprobar_evento_borrado = async ( req = request, res = response, next )=> {

    try {
        //const { fechaDesde, fechaHasta } = req.body;
        //const [ fecha_desde_convertido, fecha_hasta_convertido ] = [ generar_fecha( fechaDesde ), generar_fecha( fechaHasta ) ];
        const { id_evento } = req.params;
        const evento = await prisma.calendario_eventos.findFirst( { 
                                                                    where : { id_evento_calendario : id_evento } 
                                                                } );
        const { estadoevento } = evento;
        if ( estadoevento !== 'ELIMINADO' ){
            next();
        }else {

            const { fecha_desde_evento, fecha_hasta_evento, costo, decripcion_evento  } = evento;
            res.status( 400 ).json( {
                status : true,
                msg : 'Ese evento ya fue eliminado',
                evento : {
                    fechaDesde : fecha_desde_evento,
                    fechaHasta : fecha_hasta_evento,
                    descripcion : decripcion_evento,
                    costo,
                    //idTipoEvento : tipoEvento
                }
            } );
        }
    } catch (error) {

        console.log( error );
        
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar la disponibilidad del evento',
            //error
        } );
    }
}


const comprobar_existe_evento = async ( req = request, res = response, next )=> {

    try {
        //const { fechaDesde, fechaHasta } = req.body;
        //const [ fecha_desde_convertido, fecha_hasta_convertido ] = [ generar_fecha( fechaDesde ), generar_fecha( fechaHasta ) ];
        const { id_evento } = req.params;
        const evento = await prisma.calendario_eventos.findFirst( { 
                                                                    where : { id_evento_calendario : id_evento } 
                                                                } );
        //const { estadoevento } = evento;
        if ( evento === null || evento === undefined ){
            //next();
            //const { fecha_desde_evento, fecha_hasta_evento, costo, decripcion_evento  } = evento;
            res.status( 400 ).json( {
                status : true,
                msg : 'Ese evento no existe',
                /*evento : {
                    fechaDesde : fecha_desde_evento,
                    fechaHasta : fecha_hasta_evento,
                    descripcion : decripcion_evento,
                    costo,
                    //idTipoEvento : tipoEvento
                }*/     
            } );       
        }else {
            next();
        }
    } catch (error) {

        console.log( error );
        
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al buscar si el evento existe',
            //error
        } );
    }
}







module.exports = { comprobar_disponibilidad_evento, comprobar_evento_borrado, comprobar_existe_evento } ;

