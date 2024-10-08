//AQUI SE COMPRUEBA SI ES QUE LOS MOVIMIENTOS QUE SE VAN PASANDO A CAJA SON COMPRAS O SON VENTAS Y DEMAS

const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();





const verificar_ventas_a_caja = async ( req = request, res = response, next )=>{

    try {
        

        const { ventas } = req.body;
        let verificados = false;
        for (let element in ventas) {
            //----------------------------------------------------------------------------------------------------------------------------
            try { 
                let { idVenta  } = ventas[ element ];
                
                let venta = await prisma.ventas.findUnique( { where : { id_venta : Number( idVenta ) } } );
                if ( venta !== null ){
                    verificados = true;
                    break;
                }
            }catch ( error ){
                console.log( `No se logro verificar esa venta que se adjunto ${ error }` )
            }
        }
        
        if( verificados ) {

            res.status( 400 ).json({
                status : false,
                msg : 'Un movimiento que se esta pasando no corresponde',
                descipcion : `Favor verificar los movimientos a procesar`
            })

        }

        next();

    } catch (error) {

        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se lograron verificar las ventas, favor intente de nuevo',
            //error
        } );
    }

}



const verificar_compras_a_caja = async ( req = request, res = response, next )=>{

    try {

        const { compras } = req.body;

        let validado = false;
        for (let element in ventas) {
            //----------------------------------------------------------------------------------------------------------------------------
            try { 
                let { idCompra  } = compras[ element ];
                
                let compra = await prisma.compras.findUnique( { where : { id_compra : Number( idCompra ) } } );
                if ( compra !== null ){
                    validado = true;
                    break;
                }
            }catch ( error ){
                console.log( `No se logro verificar esa compra que se adjunto ${ error }` )
            }
        }
        
        if ( validado ) { 

            res.status( 400 ).json( {
                status : false,
                msg : 'Un movimiento que se esta pasando no corresponde',
                descipcion : `Favor verificar los movimientos a procesar`
            } ); 

        }

        next();
            
    } catch (error) {

        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se lograron verificar las compras, favor intente de nuevo',
            //error
        } );
    }

}



const verificar_ventas_procesadas = async ( req = request, res = response, next )=>{

    try {
        
        const { ventas } = req.body;
        let verificados = false;
        for (let element in ventas) {
            //----------------------------------------------------------------------------------------------------------------------------
            try { 
                let { idVenta  } = ventas[ element ];
                
                let venta = await prisma.movimiento_caja.findFirst( { where : { id_venta : Number( idVenta ) } } );
                if ( venta !== null ){
                    verificados = true;
                    break;
                }
            }catch ( error ){
                console.log( `No se logro verificar esa venta que se adjunto ${ error }` )
            }
        }
        
        if ( verificados ){
            return res.status( 400 ).json( {
                status : false,
                msg : 'Un movimiento que se esta pasando ya se proceso',
                descipcion : `Favor verificar los movimientos a procesar ya que algunos fueron procesados`
            } );
        }else {
            
            next();
        }


    } catch (error) {

        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se lograron verificar las ventas, favor intente de nuevo',
            //error
        } );
    }

}




const verificar_compras_procesadas = async ( req = request, res = response, next )=>{

    try {
        
        const { compras } = req.body;
        let verificados = false;
        for (let element in compras) {
            //----------------------------------------------------------------------------------------------------------------------------
            try { 
                let { idCompra  } = compras[ element ];
                
                let venta = await prisma.movimiento_caja.findFirst( { where : { id_compra : Number( idCompra ) } } );
                if ( venta !== null ){
                    verificados = true;
                    break;
                }
            }catch ( error ){
                console.log( `No se logro verificar esa compra que se adjunto ${ error }` )
            }
        }
        
        if ( verificados === true ){
            return res.status( 400 ).json( {
                status : false,
                msg : 'Un movimiento que se esta pasando ya se proceso',
                descipcion : `Favor verificar los movimientos a procesar ya que algunos fueron procesados`
            } );
        }else {

            next();
        }

    } catch (error) {

        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se lograron verificar las compras, favor intente de nuevo',
            //error
        } );
    }

}






module.exports = {
    verificar_ventas_a_caja,
    verificar_compras_a_caja,
    verificar_ventas_procesadas,
    verificar_compras_procesadas

}