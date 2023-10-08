const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();


const comprobar_gasto_cargado = async ( req = request, res = response, next )=> {

    const { nroFactura } = req.body;

    try {
        const gasto_cargado = await prisma.gastos_club.findFirst( { where : { nro_factura : nroFactura } } );

        
        if( gasto_cargado === null || gasto_cargado === undefined ){
            next();
        }else {

            const { descripcion, gastocreadoen, monto_gasto, 
                nro_factura } = gasto_cargado;
            
            res.status( 400 ).json( {
                status : false,
                msg : 'Ese gasto ya se encuentra cargado',
                gastoRegistrado : {
                    descripcion , 
                    gastoCreadoEn : gastocreadoen, 
                    montoGasto : monto_gasto, 
                    nroFactura : nroFactura
                }
            } );

        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar el pago'
        } );
        
    }

}

module.exports = { comprobar_gasto_cargado };


