const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const verificar_inscripciones_generadas = async ( req = request, res = response, next )=>{

    try {

        const { inscripciones } = req.body;

        let inscripcion_falsa = false;
        for (const element of inscripciones) {
            let {  idInscripcion } = element;
            let inscripcion = await prisma.inscripciones.findUnique( { where : { id_inscripcion : Number( idInscripcion ) } } );
            if ( inscripcion === null ) { 
                inscripcion_falsa = true;
            }


        }

        if ( !inscripcion_falsa ){

            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'DEbe verificar las inscripciones adjuntadas',
                descripcion : `Una de las inscripciones adjuntadas no existe`
            } ); 
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar si existen todas las reservas',
            //error
        } );
    }

    
}



module.exports = {
    verificar_inscripciones_generadas,

}