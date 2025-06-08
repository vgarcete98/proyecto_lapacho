const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();



const comprobar_profesor_existe = async ( req = request, res = response, next )=> {

    try {
        const { numeroCedula } = req.body;
        const existe = await prisma.profesores.findFirst( { where : { cedula : numeroCedula } } );
        if ( existe === undefined || existe === null ) {
            console.log ( existe );
            next();
        }else {

            console.log( existe );
            res.status( 400 ).json( {
                status : false,
                msg : "Ese profesor ya existe",
                /*profesor : {
                    cedula, 
                    contacto_profesor, 
                    costo_x_hora, 
                    creadoen, 
                    nombre_profesor
                }*/
            } );
        }

    } catch (error) {
        
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al buscar al profesor",
            //existe
        } );
    }

}



module.exports = comprobar_profesor_existe;