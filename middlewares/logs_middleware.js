const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();



const middleware_request = async (req = request, res = response, next) => {


    const fecha = new Date();
    //const fechaSolicitud = fecha.
    const tipo = req.method;
    const ruta = req.url;
    const cuerpo_solicitud = req.body;
    //console.log ( req.body )
    const nuevo_log = await prisma.api_logs.create( {

        data : {
            fecha_solicitud : fecha,
            request_body : JSON.stringify(cuerpo_solicitud ),
            type_request : tipo,
            ruta_solicitud : ruta
        }
    } );

    /*console.log( 'middleware de solicitudes' );*/
    next();
}




module.exports = { middleware_request };