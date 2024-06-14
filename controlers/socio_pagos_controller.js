const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const MESES_INGLES = [ 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER' ];
const MESES_ESPAÑOL = [ 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AUGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DECIEMBRE' ];



const realizar_pago_socio = async ( req = request, res = response ) => {

    try {
        const { idSocio, 
                idCuotaSocio, 
                nroFactura, 
                numeroCedula, 
                descripcionPago } = req.body;

        //----------------------------------------------------------------------------------------------------------------------------
        const { nombre_cmp } = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );

        const { monto_cuota, id_tipo_cuota } = await prisma.cuotas_socio.findUnique( { where : { id_cuota_socio : Number( idCuotaSocio ) } } )

        const { desc_tipo_cuota } = await prisma.tipo_cuota.findUnique( { where : { id_tipo_cuota  } } )
        const pago_socio  = await prisma.pagos_socio.create( {   
                                                                data : {  
                                                                    id_cuota_socio : Number( idCuotaSocio ),
                                                                    monto_abonado : Number( monto_cuota ),
                                                                    nro_factura : nroFactura,
                                                                    fecha_pago : new Date(),
                                                                } 
                                                            } );
        //----------------------------------------------------------------------------------------------------------------------------
        const { id_cuota_socio, fecha_pago, monto_abonado, nro_factura } = pago_socio;
        const idCuotaPagada = id_cuota_socio;
        const { fecha_vencimiento } = await prisma.cuotas_socio.update( { 
                                                                            where : { id_cuota_socio : idCuotaPagada },
                                                                            data : { 
                                                                                        pago_realizado : true,
                                                                                        fecha_pago_realizado : new Date(),
                                                                                        descripcion : descripcionPago 
                                                                                    }
                                                                    } );


        if ( pago_socio === null || pago_socio === undefined){
    
            res.status( 400 ).json(
    
                {
                    status : false,
                    msj : 'No se pudo realizar el pago del socio',
                    pagoSocio : {
                        idCuotaSocio,
                        nombreSocio : nombre_cmp,
                        idSocio,
                        fechaVencimiento : fecha_vencimiento,
                        cuotaMes : MESES_ESPAÑOL[ fecha_vencimiento.getMonth() ],
                        numeroMes : (fecha_vencimiento.getMonth() + 1).toString(),
                        cedula : numeroCedula,
                        fechaPago : fecha_pago,
                        monto : monto_abonado,
                        //nroFactura : nro_factura
                    }
                }
            );
    
        }else {
            res.status( 200 ).json(
    
                {
                    status : true,
                    msj : 'Pago Realizado con exito',
                    pagoSocio : {
                        idCuotaSocio,
                        nombreSocio : nombre_cmp,
                        idSocio,
                        fechaVencimiento : fecha_vencimiento,
                        cuotaMes : MESES_ESPAÑOL[ fecha_vencimiento.getMonth() ],
                        numeroMes : (fecha_vencimiento.getMonth() + 1).toString(),
                        cedula : numeroCedula,
                        fechaPago : fecha_pago,
                        monto : monto_abonado,
                        //nroFactura : nro_factura
                    }
                }
            );
        }
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se finalizo el pago de cuota  ${ error }`,
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


const realizar_pago_socio_varios= async ( req = request, res = response ) => {

    try {
        
        const { cuotas } = req.body;
        let pagoCuotas = [];
        
        for (let element in cuotas) {
            //----------------------------------------------------------------------------------------------------------------------------
            const { idSocio, 
                    idCuotaSocio, 
                    nroFactura, 
                    numeroCedula, 
                    descripcionPago } = cuotas[element];

            
            const { nombre_cmp } = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );
    
            const { monto_cuota, id_tipo_cuota } = await prisma.cuotas_socio.findUnique( { where : { id_cuota_socio : Number( idCuotaSocio ) } } )
    
            const { desc_tipo_cuota } = await prisma.tipo_cuota.findUnique( { where : { id_tipo_cuota  } } )
            const pago_socio  = await prisma.pagos_socio.create( {   
                                                                    data : {  
                                                                        id_cuota_socio : Number( idCuotaSocio ),
                                                                        monto_abonado : Number( monto_cuota ),
                                                                        nro_factura : nroFactura,
                                                                        fecha_pago : new Date(),
                                                                    } 
                                                                } );
            //----------------------------------------------------------------------------------------------------------------------------
            const { id_cuota_socio, fecha_pago, monto_abonado, nro_factura } = pago_socio;
            const idCuotaPagada = id_cuota_socio;
            const { fecha_vencimiento } = await prisma.cuotas_socio.update( { 
                                                                                where : { id_cuota_socio : idCuotaPagada },
                                                                                data : { 
                                                                                            pago_realizado : true,
                                                                                            fecha_pago_realizado : new Date(),
                                                                                            descripcion : descripcionPago 
                                                                                        }
                                                                        } );
            pagoCuotas.push( {
                idCuotaSocio,
                nombreSocio : nombre_cmp,
                idSocio,
                fechaVencimiento : fecha_vencimiento,
                cuotaMes : MESES_ESPAÑOL[ fecha_vencimiento.getMonth() ],
                numeroMes : (fecha_vencimiento.getMonth() + 1).toString(),
                cedula : numeroCedula,
                fechaPago : fecha_pago,
                monto : monto_abonado,
                //nroFactura : nro_factura
            });

        }

        res.status( 200 ).json(
            {
                status : true,
                msj : 'Pagos Realizados con exito',
                pagoCuotas
            }
        );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se finalizo el pago de cuotas ${ error }`,
            //error
        } );
    }

}








module.exports = {
    realizar_pago_socio,
    anular_pago_socio,
    realizar_pago_socio_varios
    
}



