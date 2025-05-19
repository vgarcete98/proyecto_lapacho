const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const verificar_existe_clase_profesor = async ( req = request, res = response, next)=>{

    try {

        const { idAgendamientoClase } = req.body;


        const clase_profesor = await prisma.agendamiento_clase.findUnique( { 
                                                                                where : { id_agendamiento : Number( idAgendamientoClase ) },
                                                                                select : { 
                                                                                    id_agendamiento : true
                                                                                }
                                                                            } );

        if ( clase_profesor !== null ){
            next()
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'Debe existir la clase para agendar un alumno a la misma',
                descripcion : `La clase donde quiere asignar al alumno no existe`
            } ); 
        }
        
    } catch (error) {
        console.log(`Ocurrio un error al verificar si existe la clase del profesor`);
        res.status( 500 ).json( {
            status : false,
            msg : 'Ocurrio un error al verificar si existe la clase del profesor',
            //error
        } );
    }
}






module.exports = { verificar_existe_clase_profesor }