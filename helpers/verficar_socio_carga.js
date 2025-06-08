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
            
            next();

        }
    } catch (error) {
        res.status( 500 ).json(
        
            {
                status : false,
                msg : `Ha ocurrido un error al realizar la consulta, No se pudo generar el token : ${ error }`,
                //mensaje_error : error
            }
    
        );
    }




}



const verificar_vista_usuario = async ( req = request, res = response, next ) =>{

    try {
        const { x_token } = req.headers;
        const { id_usuario, rol } = decode( x_token, process.env.SECRET0RPR1VAT3K3Y );
        if ( rol === 'ADMINISTRADOR' ){
            
            //req.query.idUsuario = idSocio;
            next();
        }else{
            req.query.idUsuario = id_usuario;
            
            next();

        }
    } catch (error) {
        res.status( 500 ).json(
        
            {
                status : false,
                msg : `Ha ocurrido un error al verificar la vista del usuario : ${ error }`,
                //mensaje_error : error
            }
    
        );
    }




}



const verificar_acceso_usuario = async ( req = request, res = response, next ) =>{

    try {
        const { x_token } = req.headers;
        const { id_usuario, rol } = decode( x_token, process.env.SECRET0RPR1VAT3K3Y );

        req.body.acceso = rol;

        next();
    } catch (error) {
        res.status( 500 ).json(
        
            {
                status : false,
                msg : `Ha ocurrido un error al realizar la consulta, No se pudo generar el token : ${ error }`,
                //mensaje_error : error
            }
    
        );
    }




}


const verificar_vista_profesor = async ( req = request, res = response, next ) =>{

    try {
        const { x_token } = req.headers;
        const { id_usuario, rol } = decode( x_token, process.env.SECRET0RPR1VAT3K3Y );
        let idSocio = undefined;
        if ( rol === 'ADMINISTRADOR' ){
            
            //req.query.idUsuario = idSocio;
            next();
        }else{
            if ( rol === 'SOCIO' ){
                res.status( 401 ).json(
        
                    {
                        status : false,
                        msg : `No se tiene acceso a este recurso`,
                        //mensaje_error : error
                    }
            
                );
            }else {

                req.query.id_profesor = id_usuario;
                
                next();
            }

        }
    } catch (error) {
        res.status( 500 ).json(
        
            {
                status : false,
                msg : `Ha ocurrido un error al realizar la consulta, No se pudo generar el token : ${ error }`,
                //mensaje_error : error
            }
    
        );
    }




}




module.exports = { obtener_data_socio, verificar_vista_usuario, verificar_vista_profesor, verificar_acceso_usuario };