const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const verificar_datos_tipo_movimiento = async (req = request, res = response, next )=>{

    try {
        
        const { tipoPago } = req.body;

        const tipos_pago = await prisma.tipo_pago.findFirst( { 
                                                                where : { dec_tipo_pago : 'TRANSFERENCIA' },
                                                                select : {
                                                                    id_tipo_pago : true
                                                                }
                                                            } );

        const { id_tipo_pago } = tipos_pago;
        if ( Number( tipoPago ) === id_tipo_pago ){

            if ( req.files !== undefined || req.files !== null ){

                const { archivo } = req.files;
                if ( archivo !== undefined || archivo !== null ){
                    next();
                }else {
                    res.status( 400 ).json( {
                        status : false,
                        msg : 'Debe de adjuntar el comprobante para pagos en transferencia',
                        descripcion : `No existe el archivo valido para procesar comprobantes`
                    } ); 
                }

            }else {
                res.status( 400 ).json( {
                    status : false,
                    msg : 'Debe de adjuntar el comprobante para pagos en transferencia',
                    descripcion : `No existe el archivo valido para procesar comprobantes`
                } ); 
            }


        }else {
            next();
        }

    } catch (error) {
        console.log( error );
        res.status(500).json({
            status: false,
            msg: 'No se logro verificar los datos requeridos para el tipo de movimiento',
        });
    }







}

module.exports = {
    verificar_datos_tipo_movimiento
}
