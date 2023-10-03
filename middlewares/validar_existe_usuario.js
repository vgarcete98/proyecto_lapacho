const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const validar_existe_usuario = async ( req = request, res = response, next ) =>{

    // ESTO SERIA PARA EL CASO DE UN POST 

    try {
        //const { id_usuario } = req.params;
        const { nombreUsuario } = req.body;
        const comprobar_usuario = await prisma.usuario.findFirst( { where : { nombre_usuario : nombreUsuario } } ); 
        if ( comprobar_usuario === null || comprobar_usuario === undefined ) {
            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'Ese usuario ya existe no se puede crear de esa forma'
            } );
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar si el usuario existe',
            error
        } );        
    }

    
}


const comprobar_usuario_valido = async ( req = request, res = response, next ) =>{

    // ESTO SERIA PARA EL CASO DE UN PUT Y DELETE 
    const { id_usuario } = req.params;

    try {
        const comprobar_usuario = await prisma.usuario.findFirst( { where : { id_usuario } } ); 
        if ( comprobar_usuario === null || comprobar_usuario === undefined ) {
            res.status( 400 ).json( {
                status : false,
                msg : 'Ese usuario no existe no se puede editar de esa forma'
            } );
        }else {
            next();
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar si el usuario existe',
            error
        } );        
    }

    
}











module.exports = { validar_existe_usuario, comprobar_usuario_valido };