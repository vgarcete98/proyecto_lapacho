const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const MESES_INGLES = [ 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER' ];
const MESES_ESPAÑOL = [ 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AUGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DECIEMBRE' ];



const realizar_pago_socio = async ( req = request, res = response ) => {

    try {
        const { idSocio, idCuotaSocio, nroFactura, montoAbonado, numeroCedula, descripcionPago } = req.body;

        let idCuotaSocioConvertido = 1;
        let montoAbonadoConvertido = 0;
        if ( typeof( idCuotaSocio ) !== Number ){ idCuotaSocioConvertido = Number( idCuotaSocio ) };
        if ( typeof( montoAbonado ) !== Number ){ montoAbonadoConvertido = Number( montoAbonado ) };
        //const fecha_pago = new Date();

        const fechaPago = new Date();
        //----------------------------------------------------------------------------------------------------------------------------
        //const { id_socio } = req.params;
        const socio = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );

        const nombre_socio = socio.nombre + ' ' + socio.apellido;
        const pago_socio = await prisma.pagos_socio.create( {   
                                                                data : {  
                                                                    id_cuota_socio : idCuotaSocioConvertido,
                                                                    monto_abonado : montoAbonadoConvertido,
                                                                    nro_factura : nroFactura,
                                                                    fecha_pago : fechaPago,
                                                                } 
                                                            } );
        //----------------------------------------------------------------------------------------------------------------------------
        
        const { id_cuota_socio, fecha_pago, monto_abonado, nro_factura } = pago_socio;
        
        const idCuotaPagada = id_cuota_socio;
        //const fecha_pago = new date
        const cuota_pagada = await prisma.cuotas_socio.update( { 
                                                                    where : { id_cuota_socio : idCuotaPagada },
                                                                    data : { 
                                                                                pago_realizado : true,
                                                                                fecha_pago_realizado : fechaPago,
                                                                                descripcion : descripcionPago 
                                                                            }
                                                            } );


        if ( pago_socio === null || pago_socio === undefined){
    
            res.status( 400 ).json(
    
                {
                    status : false,
                    msj : 'No se pudo realizar el pago del socio',
                    pagoSocioConvertido : {
                        //idCuotaSocio : id_cuota_socio,
                        nombreCmp : nombre_socio,
                        fechaPago : fecha_pago,
                        montoAbonado : monto_abonado,
                        nroFactura : nro_factura
                    }
                }
            );
    
        }else {
            res.status( 200 ).json(
    
                {
                    status : true,
                    msj : 'Pago Realizado con exito',
                    pagoSocioConvertido : {
                        //idCuotaSocio : id_cuota_socio,
                        fechaPago : fecha_pago,
                        nombreSocio : nombre_socio,
                        montoAbonado : monto_abonado,
                        nroFactura : nro_factura
                    }
                }
            );
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se finalizo el pago de cuota',
            //error
        } );
    }

}




const anular_pago_socio = async ( req = request, res = response ) =>{

    try {
        
        const { id_cuota } = req.params;


        //ANTES DE PROCEDER AL BORRADO


        const pago_cuota = await prisma.pagos_socio.findFirst(  { where : { id_cuota_socio : Number(id_cuota) } } );
        //console.log( pago_cuota );
        const { id_pago_socio } = pago_cuota;

        const cuota_anulada = await prisma.pagos_socio.delete(  { 
                                                                    where : { 
                                                                                id_pago_socio : Number( ( typeof( id_pago_socio ) === 'bigint' )? String( id_pago_socio ): id_pago_socio ) 
                                                                            } 
                                                                } );
         
        
        //console.log( cuota_anulada );

        
        
        res.status( 200 ).json( {
            status : true,
            msg : 'Pago anulado con exito',
            //error
        } );

    } catch (error) {

        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se ha podido procesar la insercion del registro',
            //error
        } );
        
    }

}







module.exports = {
    realizar_pago_socio,
    anular_pago_socio
    
}



