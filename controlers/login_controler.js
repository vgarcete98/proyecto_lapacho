
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const { generar_token } = require( '../helpers/generar_token' )


const login = async ( req = request, res = response )=> {

    const { usuario, contraseña } = req.body;
    
    const consulta_usuario = await prisma.$queryRaw`SELECT CAST ( id_usuario AS INTEGER ) AS id_usuario, tipo_usuario, nombre_usuario, contrasea 
                                                        FROM  public.Usuario
                                                    WHERE nombre_usuario = ${ usuario } AND contrasea = ${ contraseña }`;
    //console.log( consulta_usuario.lenght() );
    if ( consulta_usuario.length === 0 ) { 
        res.status( 400 ).json(

            {
                status : 'OK',
                msj : 'No existe el usuario, No se pudo generar el token',
                //usuario,
                token : false
    
            }
    
        );
    }else {

        const { id_usuario, tipo_usuario } = consulta_usuario[0];

        const token = await generar_token( id_usuario, tipo_usuario );
    
        res.status( 200 ).json(
    
            {
                status : 'OK',
                msj : 'Login OK',
                //usuario,
                token
    
            }
    
        );
    }


}



module.exports = {

    login
}