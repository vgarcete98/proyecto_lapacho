const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



const validar_existe_socio = async ( req = request, res = response, next ) =>{



    const { cedula, ruc } = req.body;

    try {
        const persona = await prisma.persona.findFirst( { where : { cedula } } );
        //console.log( persona );
        
        if ( persona === null || persona === undefined ) {
            // QUIERE DECIR QUE NO SE ENCONTRO POR TANTO NO EXISTE
            next();
        }else {
            const { nombre, apellido, fecha_nacimiento } = persona;
            res.status( 400 ).json( {
                status : false,
                msg : 'Ya existe un socio con esos datos',
                persona_encontrada : {
                    nombre, 
                    apellido, 
                    fecha_nacimiento,
                    cedula
                }
            } );
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un socio repetido',
            //persona
        } );
    }


    
}


const comprobar_existe_socio = async ( req = request, res = response, next ) =>{

    const { cedula, ruc } = req.body;

    try {
        const persona = await prisma.persona.findFirst( { where : { cedula } } );
        //console.log( persona );
        
        if ( persona === null || persona === undefined ) {
            // QUIERE DECIR QUE NO SE ENCONTRO POR TANTO NO EXISTE
            const { nombre, apellido, fecha_nacimiento } = persona;
            res.status( 400 ).json( {
                status : false,
                msg : 'No existe un socio con esos datos',
                cedula,
                ruc
            } );
        }else {
            next();
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un socio repetido',
            //persona
        } );
    }


    
}






module.exports = { validar_existe_socio, comprobar_existe_socio };
