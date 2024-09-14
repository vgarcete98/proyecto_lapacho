const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();



const verificar_existe_clase = async ( req = request, res = response, next)=> {

    try {
        
        const { idAgendamiento } = req.body;

        const clase = await prisma.agendamiento_clase.findUnique( { where : { id_agendamiento : Number( idAgendamiento ) } } );
        
        if ( clase === undefined || clase === null ){
            res.status( 400 ).json( {
                status : true,
                msg : "La clase no existe, favor verificar",
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            //console.log ( "clase que coincide, no se puede reservar" );
            next()
        }
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `No se pudo verificar si existe la clase, error : ${error}`,
            //nuevoIngreso
        } );
    }




}






const verificar_solapamiento_clase = async ( req = request, res = response, next) =>{

    try {

        const { horaDesde, horaHasta } = req.body;
        
        let fecha_desde_convert = DateTime.fromISO(horaDesde);
        let fecha_hasta_convert = DateTime.fromISO(horaHasta);


        const clase = await prisma.agendamiento_clase.findFirst( {
                                                                    where : {
                                                                        AND : [
                                                                            { horario_inicio : { gte : fecha_desde_convert } },
                                                                            { horario_hasta : { lte : fecha_hasta_convert } }
                                                                        ]
                                                                    }
                                                                } )




        
    } catch (error) {
        
    }



}


module.exports = { verificar_existe_clase };
