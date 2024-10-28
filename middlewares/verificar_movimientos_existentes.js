const { request, response } = require('express');





const verifica_ventas_existentes = async ( req = request, res = response, next ) =>{

    try {
        
        const { ventas } = req.body;

        if ( ventas.length === 0 || ventas === null || ventas === undefined ) {
            res.status( 400 ).json( {
                status : false,
                msg : 'No se le esta pasando ningun movimiento a caja',
                descripcion : `Debe adjuntar al menos un movimiento de venta para procesar`
            } ); 
        }else {

            next();
        }



    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se lograron verificar las ventas, favor intente de nuevo',
            //error
        } );
    }


}

const verifica_compras_existentes = async ( req = request, res = response, next ) =>{

    try {
        
        const { compras } = req.body;

        if ( compras.length === 0 || compras === null || compras === undefined ) {
            res.status( 400 ).json( {
                status : false,
                msg : 'No se le esta pasando ningun movimiento a caja',
                descripcion : `Debe adjuntar al menos un movimiento de compra para procesar`
            } ); 
        }

        next();


    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se lograron verificar las compras, favor intente de nuevo',
            //error
        } );    }


}




module.exports = {
    verifica_ventas_existentes,
    verifica_compras_existentes


}