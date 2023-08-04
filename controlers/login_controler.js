
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const { generar_token } = require( '../helpers/generar_token' )


const login = async ( req = request, res = response )=> {

    //const { usuario, contraseña } = req.body;
    
    const id_usuario = 0;
    const token = await generar_token( id_usuario );

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Login OK',
            //usuario,
            token

        }

    );

}



module.exports = {

    login
}