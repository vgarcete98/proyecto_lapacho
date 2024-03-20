const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const ExcelJS = require('exceljs');


const prisma = new PrismaClient();


const MESES_ESPAÑOL = [ 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AUGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DECIEMBRE' ];

const obtener_cuotas_pendientes_x_socio = async ( req = request, res = response ) =>{

    const { numero_cedula } = req.query;
    //console.log( typeof(numero_cedula) );
    // OBTIENE LAS CUOTAS PENDIENTES DEL SOCIO EN EL AÑO
    try {
        const cuotas_pendientes = await prisma.$queryRaw`SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
                                                                CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
                                                                CAST ( B.ID_SOCIO AS INTEGER ) AS id_socio,
                                                                A.CEDULA AS CEDULA, TO_CHAR ( C.FECHA_VENCIMIENTO, 'MONTH') AS cuota_mes,
                                                                TO_CHAR ( C.FECHA_VENCIMIENTO, 'MM') AS NUMERO_MES,
                                                                C.FECHA_VENCIMIENTO AS fechaVencimiento,
																C.fecha_pago_realizado as fecha_pago,
																D.desc_tipo_cuota as tipo_cuota,
																C.monto_cuota as monto
                                                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                            JOIN CUOTAS_SOCIO C ON C.ID_SOCIO = B.ID_SOCIO
															JOIN TIPO_CUOTA D ON D.ID_TIPO_CUOTA = C.ID_TIPO_CUOTA
                                                        WHERE EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = EXTRACT(YEAR FROM CURRENT_DATE)
                                                            AND C.PAGO_REALIZADO = false AND A.CEDULA = '${numero_cedula}';`;

        const cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

            const { idcuotasocio, nombresocio, id_socio, 
                    fechavencimiento, cedula, numero_mes,
                    fecha_pago, tipo_cuota, monto_cuota } = element;
            //console.log( numero_mes )
            const mes_español = MESES_ESPAÑOL[ Number( numero_mes ) -1 ];
            //console.log( mes_español )

            return {
                idCuotaSocio : idcuotasocio,
                nombreSocio : nombresocio,
                idSocio : id_socio,
                fechaVencimiento : fechavencimiento,
                cuotaMes : mes_español,
                numeroMes : numero_mes,
                cedula,
                fechaPago : fecha_pago,
                tipoCuota : tipo_cuota,
                monto : monto_cuota

                //cedula
            }

        } );
        if ( cuotas_pendientes.length === 0 ){
            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'El socio no registra pagos pendientes',
                    //cantidad : cuotas_pendientes.length
                }
            );
        }else {
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pagos pendientes del socio',
                    //cantidad : cuotas_pendientes.length,
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

const obtener_cuotas_pendientes_del_mes = async ( req = request, res = response )=>{
    try {
        //CUOTAS PENDIENTES LUEGO DEL VENCIMIENTO DE UNA CUOTA QUE SERIA EL 5

        const cuotas_pendientes = await prisma.$executeRaw`SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
                                                                CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
                                                                CAST ( B.ID_SOCIO AS INTEGER ) AS id_socio,
                                                                A.CEDULA AS CEDULA, TO_CHAR ( C.FECHA_VENCIMIENTO, 'MONTH') AS cuota_mes,
                                                                TO_CHAR ( C.FECHA_VENCIMIENTO, 'MM') AS NUMERO_MES,
                                                                C.FECHA_VENCIMIENTO AS fechaVencimiento,
																C.fecha_pago_realizado as fecha_pago,
																D.desc_tipo_cuota as tipo_cuota,
																C.monto_cuota as monto
                                                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                            JOIN CUOTAS_SOCIO C ON C.ID_SOCIO = B.ID_SOCIO
															JOIN TIPO_CUOTA D ON D.ID_TIPO_CUOTA = C.ID_TIPO_CUOTA
                                                        WHERE EXTRACT(MONTH FROM C.FECHA_VENCIMIENTO) = EXTRACT(MONTH FROM CURRENT_DATE)
																AND EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = 2025 --EXTRACT(YEAR FROM CURRENT_DATE)
                                                            AND C.PAGO_REALIZADO = false`


        const cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

            const { idcuotasocio, nombresocio, id_socio, 
                    fechavencimiento, cedula, numero_mes,
                    fecha_pago, tipo_cuota, monto_cuota } = element;
            //console.log( numero_mes )
            const mes_español = MESES_ESPAÑOL[ Number( numero_mes ) -1 ];
            //console.log( mes_español )

            return {
                idCuotaSocio : idcuotasocio,
                nombreSocio : nombresocio,
                idSocio : id_socio,
                fechaVencimiento : fechavencimiento,
                cuotaMes : mes_español,
                numeroMes : numero_mes,
                cedula,
                fechaPago : fecha_pago,
                tipoCuota : tipo_cuota,
                monto : monto_cuota
            }

        } );
        if ( cuotas_pendientes.length === 0 ){
            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se registran cuotas pendientes en el mes',
                    //cantidad : cuotas_pendientes.length
                }
            );
        }else {
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pagos pendientes del socio',
                    //cantidad : cuotasPendientes,
                    cuotasPendientes
                }
            );
        } 
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener las cuotas pendientes del mes',
            //error
        } );
    }

}


const obtener_cuotas_pagadas_del_mes = async ( req = request, res = response )=>{
    try {
        //QUIENES YA PAGARON SU CUOTA

        const cuotas_pendientes = await prisma.$executeRaw`SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
                                                                CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
                                                                CAST ( B.ID_SOCIO AS INTEGER ) AS id_socio,
                                                                A.CEDULA AS CEDULA, TO_CHAR ( C.FECHA_VENCIMIENTO, 'MONTH') AS cuota_mes,
                                                                TO_CHAR ( C.FECHA_VENCIMIENTO, 'MM') AS NUMERO_MES,
                                                                C.FECHA_VENCIMIENTO AS fechaVencimiento,
																C.fecha_pago_realizado as fecha_pago,
																D.desc_tipo_cuota as tipo_cuota,
																C.monto_cuota as monto
                                                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                            JOIN CUOTAS_SOCIO C ON C.ID_SOCIO = B.ID_SOCIO
															JOIN TIPO_CUOTA D ON D.ID_TIPO_CUOTA = C.ID_TIPO_CUOTA
                                                        WHERE EXTRACT(MONTH FROM C.FECHA_VENCIMIENTO) = EXTRACT(MONTH FROM CURRENT_DATE)
																AND EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = 2025 --EXTRACT(YEAR FROM CURRENT_DATE)
                                                            AND C.PAGO_REALIZADO = true`


        const cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

            const { idcuotasocio, nombresocio, id_socio, 
                    fechavencimiento, cedula, numero_mes,
                    fecha_pago, tipo_cuota, monto_cuota } = element;
            //console.log( numero_mes )
            const mes_español = MESES_ESPAÑOL[ Number( numero_mes ) -1 ];
            //console.log( mes_español )

            return {
                idCuotaSocio : idcuotasocio,
                nombreSocio : nombresocio,
                idSocio : id_socio,
                fechaVencimiento : fechavencimiento,
                cuotaMes : mes_español,
                numeroMes : numero_mes,
                cedula,
                fechaPago : fecha_pago,
                tipoCuota : tipo_cuota,
                monto : monto_cuota
            }

        } );
        if ( cuotas_pendientes.length === 0 ){
            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se registran cuotas pagadas en el mes',
                    //cantidad : cuotas_pendientes.length
                }
            );
        }else {
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pagos Realizados de los socios',
                    //cantidad : cuotasPendientes,
                    cuotasPendientes
                }
            );
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener las cuotas pagadas del mes',
            //error
        } );
    }
}

const obtener_cuotas_atrasadas_del_mes = async ( req = request, res = response )=>{
    try {
        //QUIENES AUN NO PAGARON SU CUOTA A LA FECHA
        const cuotas_pendientes = await prisma.$executeRaw`SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
                                                                CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
                                                                CAST ( B.ID_SOCIO AS INTEGER ) AS id_socio,
                                                                A.CEDULA AS CEDULA, TO_CHAR ( C.FECHA_VENCIMIENTO, 'MONTH') AS cuota_mes,
                                                                TO_CHAR ( C.FECHA_VENCIMIENTO, 'MM') AS NUMERO_MES,
                                                                C.FECHA_VENCIMIENTO AS fechaVencimiento,
																C.fecha_pago_realizado as fecha_pago,
																D.desc_tipo_cuota as tipo_cuota,
																C.monto_cuota as monto
                                                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                            JOIN CUOTAS_SOCIO C ON C.ID_SOCIO = B.ID_SOCIO
															JOIN TIPO_CUOTA D ON D.ID_TIPO_CUOTA = C.ID_TIPO_CUOTA
                                                        WHERE EXTRACT(MONTH FROM C.FECHA_VENCIMIENTO) = EXTRACT(MONTH FROM CURRENT_DATE)
																AND EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = 2025 --EXTRACT(YEAR FROM CURRENT_DATE)
																AND EXTRACT(DAY FROM CURRENT_DATE) >= EXTRACT(DAY FROM C.FECHA_VENCIMIENTO)
                                                            AND C.PAGO_REALIZADO = false`


        const cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

            const { idcuotasocio, nombresocio, id_socio, 
                    fechavencimiento, cedula, numero_mes,
                    fecha_pago, tipo_cuota, monto_cuota } = element;
            //console.log( numero_mes )
            const mes_español = MESES_ESPAÑOL[ Number( numero_mes ) -1 ];
            //console.log( mes_español )

            return {
                idCuotaSocio : idcuotasocio,
                nombreSocio : nombresocio,
                idSocio : id_socio,
                fechaVencimiento : fechavencimiento,
                cuotaMes : mes_español,
                numeroMes : numero_mes,
                cedula,
                fechaPago : fecha_pago,
                tipoCuota : tipo_cuota,
                monto : monto_cuota
            }

        } );
        if ( cuotas_pendientes.length === 0 ){
            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se registran cuotas atrasadas en el mes',
                    //cantidad : cuotas_pendientes.length
                }
            );
        }else {
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pagos pendientes del socio',
                    //cantidad : cuotasPendientes,
                    cuotasPendientes
                }
            );
        }
    } catch (error) {
        console.log( error );
    }
}


module.exports = {
    obtener_cuotas_pendientes_x_socio,
    obtener_cuotas_pendientes_del_mes,
    obtener_cuotas_atrasadas_del_mes,
    obtener_cuotas_pagadas_del_mes
}