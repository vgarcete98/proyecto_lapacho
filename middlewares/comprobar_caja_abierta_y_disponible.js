const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();


const verificar_caja_abierta_y_disponible = async (req = request, res = response, next) => {

    try {


        const caja_disponible = await prisma.caja.findFirst( { 
                                                                where : {  
                                                                    fecha_cierre : null
                                                                } 
                                                            } );
        if ( caja_disponible === null ){
            res.status( 400 ).json( {
                status : false,
                msg : 'Debe de realizar la apertura de la caja para realizar el cierre',
                descripcion : `No existe una caja abierta y disponible`
            } ); 
        }else {

            next(); 
        }
    } catch (error) {
        console.log( error );
        res.status(500).json({
            status: false,
            msg: 'No se lograron verificar la ultima caja abierta, favor intente de nuevo',
        });
    }

};


module.exports = {
    verificar_caja_abierta_y_disponible
}



