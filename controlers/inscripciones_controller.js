
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const inscribirse_a_evento = async ( req = request, res = response ) =>{


}


const editar_inscripcion = async ( req = request, res = response ) =>{


}



const abonar_x_inscripcion = async ( req = request, res = response ) =>{


}

const ver_inscripciones_x_evento = async ( req = request, res = response ) =>{

    const { id_evento } = req.query;

    try {
        
        const inscripciones = await prisma.inscripciones.findMany( {
                                                                    where : { id_evento_calendario : id_evento }
                                                                } );
        const cant_inscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cant_inscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            cant_inscripciones : 0
        } );

    }


}



module.exports = {

    abonar_x_inscripcion,
    editar_inscripcion,
    inscribirse_a_evento,
    ver_inscripciones_x_evento
}