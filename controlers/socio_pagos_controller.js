const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const MESES_INGLES = [ 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER' ];
const MESES_ESPAÑOL = [ 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AUGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DECIEMBRE' ];



const realizar_pago_socio = async ( req = request, res = response ) => {

    const { idCuotaSocio, nroFactura, montoAbonado, numeroCedula } = req.body;

    let idCuotaSocioConvertido = 1;
    let montoAbonadoConvertido = 0;
    if ( typeof( idCuotaSocio ) !== Number ){ idCuotaSocioConvertido = Number( idCuotaSocio ) };
    if ( typeof( montoAbonado ) !== Number ){ montoAbonadoConvertido = Number( montoAbonado ) };
    //const fecha_pago = new Date();

    try {
        const fechaPago = new Date();
        //----------------------------------------------------------------------------------------------------------------------------
        
        const socio = await prisma.persona.findFirst( { where : { cedula : numeroCedula } } );

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
        const cuota_pagada = await prisma.cuotas_socio.update( { 
                                                                    where : { id_cuota_socio : idCuotaPagada },
                                                                    data : { pago_realizado : true }
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

const obtener_comprobante_pago_cuota = async ( req = request, res = response ) =>{

    try {
        
        const { id_cuota } = req.params;

        const pago_cuota = await prisma.pagos_socio.findUnique( { where : { id_pago_socio : id_cuota } } );
        const { comprobante_cuota } = pago_cuota;
        
        fs.readFile(comprobante_cuota, 'utf8', (err, data) => {
            if (err) {
              console.error( 'Error al leer el archivo:', err );
              return;
            }
        });

        res.status( 200 ).json( {
            status : true,
            archivo : data
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


const obtener_pagos_del_socio = async ( req = request, res = response ) =>{

    try {
        
        //VOY A OBTENER LOS PAGOS QUE HIZO UN SOCIO EN EL AÑO
        const pagos_del_socio = await prisma.$queryRaw`SELECT A.ID_SOCIO, A.NOMBRE_USUARIO, CONCAT( B.NOMBRE, ' ', B.APELLIDO ) AS NOMBRE_COMPLETO,
	                                                        	B.CEDULA, C.FECHA_VENCIMIENTO AS VENCIMIENTO_CUOTA, C.DESCRIPCION, 
	                                                        	D.ID_PAGO_SOCIO, D.NRO_FACTURA, D.MONTO_ABONADO AS MONTO_PAGADO, D.FECHA_PAGO
	                                                        FROM SOCIO A 
	                                                        JOIN PERSONA B ON A.ID_PERSONA = B.ID_PERSONA
	                                                        JOIN CUOTAS_SOCIO C ON A.ID_SOCIO = C.ID_SOCIO	
	                                                        JOIN PAGOS_SOCIO D ON C.ID_CUOTA_SOCIO = D.ID_CUOTA_SOCIO`;


        const pagosDelSocio = []


        res.status( 200 ).json( {
            status : true,
            msg : 'Pagos del socio en el año',
            pagosDelSocio
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
    obtener_comprobante_pago_cuota
    
}



