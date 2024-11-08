const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const verificar_existe_talonario_vigente = async ( req = request, res = response, next )=>{

    try {

        // VEO SI ES QUE EXISTE UN TIMBRADO VIGENTE Y QUE TENGA FACTURAS DISPONIBLES
        const talonario = await prisma.timbrado.findFirst({
                                                            where: {
                                                                fecha_vencimiento: { gt: new Date() },
                                                                facturas: {
                                                                    some: {
                                                                        fecha_emision: null,
                                                                        ruc_cliente: null,
                                                                        total_iva: null,
                                                                        condicion_venta: null,
                                                                        monto_total: null
                                                                    }
                                                                }
                                                            },
                                                            include: {
                                                                facturas: {
                                                                    select: {
                                                                        fecha_emision: true,
                                                                        ruc_cliente: true,
                                                                        total_iva: true,
                                                                        condicion_venta: true,
                                                                        monto_total: true
                                                                    }
                                                                }
                                                            }
                                                        });
        

        if ( talonario !== null ){

            res.status( 400 ).json( {
                status : false,
                msg : 'Ya existe un talonario vigente',
                descipcion : `Utilice todas las facturas del talonario vigente antes de generar un nuevo talonario`
            } ); 
        }else {
            next();
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar si existe un talonario vigente y disponible',
            //error
        } );
    }

    
}

const verificar_numeracion_talonario = async ( req = request, res = response, next )=>{

    try {

        const { numeroDesde, numeroHasta } = req.body;



        if ( (Number( numeroHasta ) - Number(numeroDesde  )) > 100 ) {

            res.status( 400 ).json( {
                status : false,
                msg : 'La numeracion es demasiado grande para continuar',
                descipcion : `Debe reducir el margen de numeracion para continuar`
            } ); 
        }else{
            next();
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar la numeracion e las facturas',
            //error
        } );
    }

    
}




module.exports = {
    verificar_existe_talonario_vigente,
    verificar_numeracion_talonario

}