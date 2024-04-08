const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const ExcelJS = require('exceljs');


const prisma = new PrismaClient();


const MESES_ESPAÑOL = [ 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AUGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DECIEMBRE' ];

const obtener_cuotas_pendientes_x_socio = async ( req = request, res = response ) =>{

    const { numero_cedula, annio } = req.query;
    //console.log( numero_cedula);
    // OBTIENE LAS CUOTAS PENDIENTES DEL SOCIO EN EL AÑO
    try {



        const query = `SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
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
                        WHERE EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = ${annio}
                            AND C.PAGO_REALIZADO = false AND A.CEDULA = '${numero_cedula}';`
        
        const cuotas_pendientes = await prisma.$queryRawUnsafe( query );

        //console.log( cuotas_pendientes );
        let cuotasPendientes = [];
        cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

            const { idcuotasocio, nombresocio, id_socio, 
                    fechavencimiento, cedula, numero_mes,
                    fecha_pago, tipo_cuota, monto_cuota } = element;
            
            const mes_español = MESES_ESPAÑOL[ Number( numero_mes ) -1 ];

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
        if ( cuotasPendientes.length === 0 ){
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
                    cuotasPendientes
                }
            );
        } 
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener los pagos pendientes del socio',
            //error
        } );
        
    } 


}


const obtener_cuotas_pagadas_x_socio = async ( req = request, res = response ) =>{

    const { numero_cedula, annio } = req.query;
    //console.log( numero_cedula);
    // OBTIENE LAS CUOTAS PENDIENTES DEL SOCIO EN EL AÑO
    try {



        const query = `SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
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
                        WHERE EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = ${annio}
                            AND C.PAGO_REALIZADO = true AND A.CEDULA = '${numero_cedula}';`
        
        const cuotas_pagadas = await prisma.$queryRawUnsafe( query );

        //console.log( cuotas_pendientes );
        let cuotasPagadas = [];
        cuotasPagadas = cuotas_pagadas.map( ( element ) =>{

            const { idcuotasocio, nombresocio, id_socio, 
                    fechavencimiento, cedula, numero_mes,
                    fecha_pago, tipo_cuota, monto_cuota } = element;
            
            const mes_español = MESES_ESPAÑOL[ Number( numero_mes ) -1 ];

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
        if ( cuotasPagadas.length === 0 ){
            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'El socio no registra pagos ',
                    //cantidad : cuotas_pendientes.length
                }
            );
        }else {
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pagos realizados del socio',
                    cuotasPagadas
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
        //CUOTAS PENDIENTES QUE NO SE PAGO


        const query = `SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
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
                                AND EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = EXTRACT(YEAR FROM CURRENT_DATE)
                            AND C.PAGO_REALIZADO = false`;

        let cuotas_pendientes = [];
        cuotas_pendientes = await prisma.$queryRawUnsafe( query );
        console.log( cuotas_pendientes );

        let cuotasPendientes = [];

        cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

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

        if ( cuotasPendientes.length === 0 ){
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


        const query = `SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
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
                                AND EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = EXTRACT(YEAR FROM CURRENT_DATE)
                            AND C.PAGO_REALIZADO = true`;
        let cuotas_pendientes = [];                 
        cuotas_pendientes = await prisma.$queryRawUnsafe(query);


        let cuotasPendientes = [];
        cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

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

        const query = `SELECT CAST ( C.ID_CUOTA_SOCIO AS INTEGER ) AS idCuotaSocio ,
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
								AND EXTRACT(YEAR FROM C.FECHA_VENCIMIENTO) = EXTRACT(YEAR FROM CURRENT_DATE)
								AND EXTRACT(DAY FROM CURRENT_DATE) >= EXTRACT(DAY FROM C.FECHA_VENCIMIENTO)
                            AND C.PAGO_REALIZADO = false`;

        let cuotas_pendientes = [];
        cuotas_pendientes = await prisma.$queryRawUnsafe( query );

        let cuotasPendientes = [];
        cuotasPendientes = cuotas_pendientes.map( ( element ) =>{

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
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener las cuotas atrasadas del mes',
            //error
        } );
    }
}



const obtener_grilla_de_cuotas = async ( req = request, res = response )=>{

    try {
        
        let query = `SELECT concat( A.apellido,' ', A.nombre) as nombre_cmp, A.cedula, B.nombre_usuario, B.id_socio,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 1  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS enero,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 2  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS febrero,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 3  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS marzo,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 4  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS abril,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 5  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS mayo,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 6  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS junio,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 7  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS julio,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 8  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS agosto,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 9  AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS septiembre,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 10 AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS octubre,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 11 AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS noviembre,
                            CASE WHEN EXTRACT(MONTH FROM C.fecha_vencimiento) = 12 AND (D.fecha_pago IS NOT NULL) THEN 'P' ELSE '' END AS diciembre
                        FROM PERSONA A
                        JOIN SOCIO B ON A.id_persona = B.id_persona 
                        JOIN CUOTAS_SOCIO C ON B.id_socio = C.id_socio
                        JOIN PAGOS_SOCIO D ON D.id_cuota_socio = C.id_cuota_socio`
        let grillaCuotas = [];
        let grilla_cuotas = [];
        grilla_cuotas = await prisma.$queryRawUnsafe( query );
        //console.log( grilla_cuotas );

        if ( grilla_cuotas.length === 0  ){
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'No existe grilla disponible de cuotas',
                    grillaCuotas
                }
            );
        }else {
            grilla_cuotas.forEach( ( element )=>{

                const { nombre_cmp, nombre_usuario, cedula, id_socio, ...cuotas } = element;

                grillaCuotas.push( {
                    nombreCmp : nombre_cmp,
                    nombreUsuario : nombre_usuario,
                    idSocio : (typeof( id_socio) === 'bigint' ) ? Number( String( id_socio ) ) : id_socio,
                    cedula,
                    cuotas
                } );

            } );
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Grilla de las cuotas',
                    grillaCuotas
                }
            );

        }



    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener la grilla de cuotas del mes',
            //error
        } );
    }






}







module.exports = {
    obtener_cuotas_pendientes_x_socio,
    obtener_cuotas_pagadas_x_socio,
    obtener_cuotas_pendientes_del_mes,
    obtener_cuotas_atrasadas_del_mes,
    obtener_cuotas_pagadas_del_mes,
    obtener_grilla_de_cuotas
}