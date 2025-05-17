const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();






const obtener_ultima_caja_abierta = async ( req = request, res = response, next )=>{

    try {
        
        const caja = await prisma.caja.findFirst( { 
                                                    where : { 
                                                        fecha_cierre : { not : null } 
                                                    },
                                                    select : {
                                                        id_caja : true
                                                    } 
                                                } );

        if ( caja !== null ){
            const { id_caja } = caja;
            req.body.idCaja = id_caja;
            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'Debe de realizar la apertura de la caja para realizar el cierre',
                descripcion : `No existe una caja abierta y disponible`
            } ); 
        }


    } catch (error) {
        console.log( error );
        res.status(500).json({
            status: false,
            msg: 'No se lograron verificar la ultima caja abierta, favor intente de nuevo',
        });

    }


}


module.exports = {
    obtener_ultima_caja_abierta
}