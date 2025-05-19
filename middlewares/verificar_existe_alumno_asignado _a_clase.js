const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const verificar_existe_alumno_asignado_a_clase = async ( req = request, res = response, next)=>{

    try {

        const { idAgendamientoClase, idCliente } = req.body;


        const clase_profesor = await prisma.clases_alumnos.findFirst( { 
                                                                                where : { 
                                                                                    AND :[

                                                                                        { id_agendamiento : Number( idAgendamientoClase ) },
                                                                                        { id_cliente : Number( idCliente ) }
                                                                                    ]
                                                                                },
                                                                                select : { 
                                                                                    id_agendamiento : true
                                                                                }
                                                                            } );

        if ( clase_profesor !== null ){
            res.status( 400 ).json( {
                status : false,
                msg : 'El alumno que quiere agregar a la clase ya esta asignado',
                descripcion : `En la clase seleccionada ya esta asignado dicho alumno`
            } ); 
        }else {
            next()
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






module.exports = { verificar_existe_alumno_asignado_a_clase }