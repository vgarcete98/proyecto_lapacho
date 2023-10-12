const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

/*
    Enero – January (Yenuari)
    Febrero – February (Februari)
    Marzo – March (March)
    Abril – April (Eipril)
    Mayo – May (Mei)
    Junio – June (Yun)
    Julio – July (Yulai)
    Agosto – August (Ogost)
    Septiembre – September (September)
    Octubre – Octuber (October)
    Noviembre – November (November)
    Diciembre – December (Dicember) 
*/

const MESES_INGLES = [ 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER' ];
const MESES_ESPAÑOL = [ 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AUGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DECIEMBRE' ];

const obtener_pagos_x_mes = async ( req = request, res = response ) => {

    // OBTIENE TODOS LOS PAGOS REALIZADOS POR LOS SOCIOS EN EL MES

    try {
        const pagos_del_mes = await prisma.$queryRaw`SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio, 
                                                            CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
                                                            CAST ( B.ID_SOCIO AS INTEGER ) AS idSocio, C.FECHA_VENCIMIENTO AS fechaVencimiento,
                                                            /*TO_CHAR ( C.FECHA_VENCIMIENTO, 'MONTH') AS cuotames,*/ 
                                                            D.MONTO_ABONADO AS montoAbonado, D.FECHA_PAGO as fechaPago
                                                    FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                    JOIN CUOTAS_SOCIO C ON C.ID_SOCIO = B.ID_SOCIO
                                                    JOIN PAGOS_SOCIO D ON D.ID_CUOTA_SOCIO = C.ID_CUOTA_SOCIO
                                                    WHERE FECHA_PAGO BETWEEN ( DATE_TRUNC('month', CURRENT_DATE) ) 
                                                                    AND ( (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day') )
                                                                    AND C.PAGO_REALIZADO =  true;`
        if ( pagos_del_mes.length === 0 ){

            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No hay pagos por este mes ',
                    cantidad : 0
                }
            );

        }else {

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pagos del mes en el club',
                    pagos_del_mes,
                    cantidad : pagos_del_mes.length
                }
            );

        }
    } catch (error) {
        console.log( error );
        res.status( 200 ).json(

            {
                status : false,
                msj : 'No se pudieron obtener los pagos del mes en el club',
                error
            }
        );
    }


}


const obtener_pagos_x_socio= async ( req = request, res = response ) => {

    try {
        // OBTIENE TODOS LOS PAGOS DE UN SOCIO EN EL AÑO 
        const { numero_cedula } = req.query;
        //console.log ( numero_cedula );

        const pagos_socio_annio = await prisma.$queryRaw`SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
                                                                CAST ( B.ID_SOCIO AS INTEGER ) AS idSocio,
                                                                C.FECHA_VENCIMIENTO AS fechaVencimiento, D.NRO_FACTURA as nroFactura, 
                                                                D.MONTO_ABONADO AS montoAbonado, D.FECHA_PAGO AS fechaPago
                                                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                            JOIN CUOTAS_SOCIO C ON C.ID_SOCIO = B.ID_SOCIO
                                                            JOIN PAGOS_SOCIO D ON D.ID_CUOTA_SOCIO = C.ID_CUOTA_SOCIO
                                                        WHERE EXTRACT(YEAR FROM FECHA_PAGO) = EXTRACT(YEAR FROM CURRENT_DATE)
                                                        AND A.CEDULA = ${ numero_cedula }`;
        if ( pagos_socio_annio.length === 0 ){

            res.status( 200 ).json(
                {
                    status : true,
                    msj : 'El socio no registra pagos en el año',
                    nro_pagos : pagos_socio_annio.length,
                    pagos_socio_annio
                }
            );
        } else { 
            res.status( 200 ).json(
                {
                    status : true,
                    msj : 'Pagos del socio en el año',
                    nro_pagos : pagos_socio_annio.length,
                    pagos_socio_annio
                }
            );
        }
    } catch (error) {
        console.log( error );
        res.status(500).json( {
            status: false,
            msg : 'No se pudo obtener los pagos del socio',
            error
        } );
    }



}



const obtener_cuotas_pendientes_x_socio = async ( req = request, res = response ) =>{

    const { numero_cedula } = req.query;
    //console.log( typeof(numero_cedula) );
    // OBTIENE LAS CUOTAS PENDIENTES DEL SOCIO EN EL AÑO
    try {
        const cuotas_pendientes = await prisma.$queryRaw`SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
                                                                CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
                                                                CAST ( B.ID_SOCIO AS INTEGER ) AS idSocio,
                                                                A.CEDULA AS CEDULA, TO_CHAR ( C.FECHA_VENCIMIENTO, 'MONTH') AS cuotames,
                                                                TO_CHAR ( C.FECHA_VENCIMIENTO, 'MM') AS NUMERO_MES,
                                                                C.FECHA_VENCIMIENTO AS fechaVencimiento
                                                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                            JOIN CUOTAS_SOCIO C ON C.ID_SOCIO = B.ID_SOCIO
                                                        WHERE EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = EXTRACT(YEAR FROM CURRENT_DATE)
                                                            AND C.PAGO_REALIZADO = false AND A.CEDULA = ${ numero_cedula }`;

        const cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

            const { idcuotasocio, nombresocio, idsocio, fechavencimiento, cedula, cuotames, numero_mes } = element;
            //console.log( numero_mes )
            const mes_español = MESES_ESPAÑOL[ Number( numero_mes ) -1 ];
            //console.log( mes_español )

            return {
                idCuotaSocio : idcuotasocio,
                nombreSocio : nombresocio,
                idSocio : idsocio,
                fechaVencimiento : fechavencimiento,
                cuotaMes : mes_español
                //cedula
            }

        } );
        if ( cuotas_pendientes.length === 0 ){
            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'El socio no registra pagos pendientes',
                    cantidad : cuotas_pendientes.length
                }
            );
        }else {
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pagos pendientes del socio',
                    cantidad : cuotas_pendientes.length,
                    cuotasPendientes
                }
            );
        } 
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener los pagos del socio',
            //error
        } );
        
    } 


}


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
        /*const pago_socio = await prisma.$executeRaw`INSERT INTO PAGOS_SOCIO 
                                                    ( ID_CUOTA_SOCIO, NRO_FACTURA, MONTO_ABONADO, FECHA_PAGO )
                                                    VALUES 
                                                    ( ${ id_cuota_socio }, ${ nro_factura }, ${ monto_abonado }, ${ fecha_pago } )`;*/
        
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






module.exports = {
    obtener_pagos_x_mes,
    obtener_pagos_x_socio,
    obtener_cuotas_pendientes_x_socio,
    realizar_pago_socio
    
}



