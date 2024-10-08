const { request, response } = require('express');
const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');
const { decode } = require('jsonwebtoken');

const prisma = new PrismaClient();


const verificar_requerimientos_usuario = async ( req = request, res = response, next ) =>{

    try {
        
        
        const { x_token } = req.headers;
        const { id_usuario } = decode( x_token, process.env.SECRET0RPR1VAT3K3Y );

        const acceso_usuario = await prisma.cliente.findUnique( { 
                                                                    where : {
                                                                        id_cliente : Number( id_usuario )
                                                                    },
                                                                    include : {
                                                                        roles_usuario : {
                                                                            select : {
                                                                                descripcion_rol : true
                                                                            }
                                                                        }
                                                                    }
                                                                } );

        const { descripcion_rol } = acceso_usuario.roles_usuario;
        let acceso = '';
        switch ( descripcion_rol ){
            case 'ADMINISTRADOR' : 
                acceso = descripcion_rol;
                break;
            case 'SOCIO' : 
                acceso = descripcion_rol;
                break;
            default : 
                acceso = descripcion_rol;
        }

        //console.log( acceso_usuario )
        req.body.idSocio = id_usuario;
        req.body.acceso = acceso;
        //console.log( decode( x_token, process.env.SECRET0RPR1VAT3K3Y ) );
        next();

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se lograron verificar las ventas, favor intente de nuevo',
            //error
        } );
    }


}



module.exports = { 
    verificar_requerimientos_usuario
}