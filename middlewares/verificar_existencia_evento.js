const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();





const verificar_existencia_evento = async ( req = request, res = response, next )=>{

    try {

        const { categorias } = req.body;

        let evento;
        let verificados = false;
        for (let element of categorias) {
            const { idEvento } = element
            evento = await prisma.eventos.findFirst( { where : { id_evento : Number( idEvento ) } } )
            if ( evento === null ){
                verificados = true;
                break;
            }
        }
        
        if ( !verificados ){
            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'Debe realizar la creacion del evento para registrar la inscripcion',
                descipcion : `El evento donde se quiere generar la inscripcion no existe`
            } ); 
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar si existe una caja abierta y disponible',
            //error
        } );
    }

    
}



module.exports = {
    verificar_existencia_evento,

}