const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();


const obtener_solicitudes_a_api = async ( req = request, res = response ) => {


    try {
        const { pagina, cantidad } = req.query;
        
        const solicitudes = await prisma.api_logs.findMany({
            skip : (Number(pagina) - 1) * Number(cantidad),
            take : Number(cantidad),
        });

        res.status(200).json( {
            solicitudes
        } )
        
    } catch (error) {

        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar las compras del club'
        } );
    }

}






module.exports = {

    obtener_solicitudes_a_api
}







