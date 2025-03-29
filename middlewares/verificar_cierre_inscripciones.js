const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const verificar_cierre_inscripciones_evento = async ( req = request, res = response, next )=>{

    try {
        const { idEvento } = req.body;
        const cierre_inscripciones = await prisma.caja.findFirst( { where : { 
                                                                        AND : [
                                                                            { fecha_cierre : null,      },
                                                                            { id_cliente_cierre : null, },
                                                                            { fecha_cierre : null }
                                                                        ]
                                                                    } 
                                                        } );

        if ( cierre_inscripciones !== null  && cierre_inscripciones !== undefined){

            res.status( 400 ).json( {
                status : false,
                msg : 'Debe de realizar el cierre de la caja para realizar la apertura de otra',
                descripcion : `Ya existe una caja abierta`
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


const verificar_cierre_inscripciones_categoria = async ( req = request, res = response, next )=>{

    try {
        const { idEvento } = req.body;
        const cierre_inscripciones = await prisma.caja.findFirst( { where : { 
                                                                        AND : [
                                                                            { fecha_cierre : null,      },
                                                                            { id_cliente_cierre : null, },
                                                                            { fecha_cierre : null }
                                                                        ]
                                                                    } 
                                                        } );

        if ( cierre_inscripciones !== null  && cierre_inscripciones !== undefined){

            res.status( 400 ).json( {
                status : false,
                msg : 'Debe de realizar el cierre de la caja para realizar la apertura de otra',
                descripcion : `Ya existe una caja abierta`
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
    verificar_cierre_inscripciones_evento,
    verificar_cierre_inscripciones_categoria
}