const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const validar_existe_rol_usuario = async ( req = request, res = response, next ) =>{

    try {

        const { descripcionAcceso } = req.body;
        const rol = await prisma.roles_usuario.findFirst( { where : { descripcion_rol : descripcionAcceso } } );
        //console.log( persona );
        
        if ( rol === null || rol === undefined ) {
            // QUIERE DECIR QUE NO SE ENCONTRO POR TANTO NO EXISTE
            next();
        }else {
            //const { nombre, apellido, fecha_nacimiento } = persona;
            const { descripcion_rol } = rol;
            res.status( 400 ).json( {
                status : false,
                msg : `Ya existe un rol con esos datos : ${ descripcion_rol }`,
            } );
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un rol repetido',
            //persona
        } );
    }


    
}


module.exports = { validar_existe_rol_usuario };

