const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();



const comprobar_profesor_existe = async ( req = request, res = response, next )=> {

    const { numeroCedula } = req.body;
    try {
        const existe = await prisma.profesores.findFirst( { where : { cedula : numeroCedula } } );
        if ( existe === undefined || existe === null ) {
            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : "Ese profesor ya existe",
                existe
            } );
        }

    } catch (error) {
        
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al buscar al profesor",
            existe
        } );
    }

}



module.exports = comprobar_profesor_existe;