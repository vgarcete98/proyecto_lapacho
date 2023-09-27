const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



const validar_existe_socio = async ( req = request, res = response, next ) =>{



    const { cedula, ruc } = req.body;

    try {
        const persona = await prisma.persona.findFirst( { where : { cedula } } );

        if ( persona === null || persona === undefined ) {
            // QUIERE DECIR QUE NO SE ENCONTRO POR TANTO NO EXISTE
            next();
        }else {

            res.status( 400 ).json( {
                status : false,
                msg : 'Ya existe un socio con esos datos',
                persona
            } );
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un socio repetido',
            persona
        } );
    }


    
}



