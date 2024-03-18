const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const ExcelJS = require('exceljs');


const prisma = new PrismaClient();


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




module.exports = {
    obtener_cuotas_pendientes_x_socio,
    
}