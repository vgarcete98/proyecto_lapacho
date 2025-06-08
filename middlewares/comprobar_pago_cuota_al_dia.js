const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();


const comprobar_pago_cuota_al_dia = async ( req = request, res = response, next )=> {

    const { nroFactura } = req.body;
    
    
    
    try {

        const query = `SELECT COUNT( * )
                            FROM (SELECT A.ID_SOCIO, 
                                A.NOMBRE_USUARIO, 
                                A.NOMBRE_CMP,
                                --B.ID_CUOTA_SOCIO,
                                --B.DESCRIPCION,
                                --B.MONTO_CUOTA
                                json_agg(
                            json_build_object(
                                'idCuotaSocio', B.ID_CUOTA_SOCIO,
                                'descripcion', B.DESCRIPCION,
                                'monto', B.MONTO_CUOTA
                            )
                        ) AS sales_data
                            FROM SOCIO A JOIN CUOTAS_SOCIO B ON A.ID_SOCIO = B.ID_SOCIO
                            --JOIN PAGOS_SOCIO C ON C.ID_CUOTA_SOCIO = B.ID_CUOTA_SOCIO
                        WHERE A.ID_SOCIO = 1 
                            AND B.FECHA_VENCIMIENTO < CURRENT_DATE 
                            AND B.PAGO_REALIZADO = FALSE
                            AND FECHA_PAGO_REALIZADO IS NULL
                        GROUP BY A.ID_SOCIO,  A.NOMBRE_USUARIO, A.NOMBRE_CMP) AS CUOTAS_DEBE;`;
                  
        let cuotas_pendientes = [];
        cuotas_pendientes = await prisma.$queryRawUnsafe(query);

        
        if( cuotas_pendientes === null || cuotas_pendientes === undefined || cuotas_pendientes.length === 0){
            next();
        }else {
            
            res.status( 500 ).json( {
                status : false,
                msg : 'El socio tiene cuotas pendientes por abonar, consulte con administracion',
            } );

        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar las cuotas pendientes'
        } );
        
    }

}

module.exports = { comprobar_pago_cuota_al_dia };
