const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')

const { decode } = require('jsonwebtoken');

const prisma = new PrismaClient();



const obtener_data_socio = async ( req = request, res = response, next ) =>{

    try {
        if ( req.path === '/auth/login' ){
            next();
        }else{

            const { x_token } = req.headers;
            const { id_usuario } = decode( x_token, process.env.SECRET0RPR1VAT3K3Y );
            req.body.idSocio = id_usuario;
            //console.log( decode( x_token, process.env.SECRET0RPR1VAT3K3Y ) );
            next();

        }
    } catch (error) {
        res.status( 500 ).json(
        
            {
                status : false,
                msj : `Ha ocurrido un error al realizar la consulta, No se pudo generar el token : ${ error }`,
                //mensaje_error : error
            }
    
        );
    }




}



module.exports = { obtener_data_socio };