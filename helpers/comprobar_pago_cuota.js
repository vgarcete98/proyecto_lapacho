const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')

const prisma = new PrismaClient();


const comprobar_pago_cuota_socio = async ( req = request, res = response, next )=> {

    const { idCuotaSocio } = req.body;

    try {
        const pago_realizado = await prisma.pagos_socio.findFirst( { where : { id_cuota_socio : idCuotaSocio } } );

        
        if( pago_realizado === null || pago_realizado === undefined ){
            next();
        }else {

            const { fecha_pago, monto_abonado, nro_factura } = pago_realizado;
            
            res.status( 400 ).json( {
                status : false,
                msg : 'Ese pago ya se encuentra realizado',
                pagoRealizado : {
                    fechaPago : fecha_pago,
                    montoAbonado : monto_abonado,
                    nroFactura : nro_factura
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


const comprobar_pago_cuota_socio_varios = async ( req = request, res = response, next )=> {

    
    try {
        const { idCuotaSocio } = req.body;

        const { cuotas } = req.body;



        for (let element in cuotas) {

            const { idCuotaSocio } = cuotas[element];
            const pago_realizado = await prisma.pagos_socio.findFirst( { where : { id_cuota_socio : Number(idCuotaSocio) } } );
            if( pago_realizado !== null && pago_realizado !== undefined ){
                //console.log( pago_realizado );
                const { fecha_pago, monto_abonado, nro_factura } = pago_realizado;
                res.status( 400 ).json( {
                    status : false,
                    msg : 'Hay un pago que ya se encuentra realizado',
                    pagoRealizado : {
                        fechaPago : fecha_pago,
                        montoAbonado : monto_abonado,
                        nroFactura : nro_factura
                    }
                } );      
            }
        }
        next();

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar el pago'
        } );
        
    }

}


module.exports = { 
                    comprobar_pago_cuota_socio,
                    comprobar_pago_cuota_socio_varios 
                };





