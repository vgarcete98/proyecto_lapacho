const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const verificar_existe_caja_abierta = async ( req = request, res = response, next )=>{

    try {

        const caja_abierta = await prisma.caja.findFirst( { where : { 
                                                                        AND : [
                                                                            { fecha_cierre : null,      },
                                                                            { id_cliente_cierre : null, },
                                                                            { fecha_cierre : null }
                                                                        ]
                                                                    } 
                                                        } );

        if ( caja_abierta !== null ){

            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'Debe de realizar la apertura de una caja para procesar el pago',
                descipcion : `No existe ninguna caja abierta para procesar el movimiento`
            } ); 
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar si existe una caja abierta y disponible',
            //error
        } );
    }

    
}





const verificar_existe_caja_vigente = async ( req = request, res = response, next )=>{

    try {

        const caja_abierta = await prisma.caja.findFirst( { where : { 
                                                                        AND : [
                                                                            { fecha_cierre : null,      },
                                                                            { id_cliente_cierre : null, },
                                                                            { fecha_cierre : null }
                                                                        ]
                                                                    } 
                                                        } );

        if ( caja_abierta !== null ){

            res.status( 400 ).json( {
                status : false,
                msg : 'Debe de realizar el cierre de la caja para realizar la apertura de otra',
                descipcion : `Ya existe una caja abierta`
            } ); 
        }else {
            next();
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar si existe una caja abierta y disponible',
            //error
        } );
    }

    
}







module.exports = {
    verificar_existe_caja_abierta,
    verificar_existe_caja_vigente

}