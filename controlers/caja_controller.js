const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const crear_caja = async ( req = request, res = response ) =>{ 

    try {

        const { idCliente, montoInicial } = req.body;
        const nueva_caja = await prisma.caja.create( { 
                                                        data : { 
                                                            fecha_apertura : new Date(),
                                                            id_cliente : Number( idCliente ),
                                                            monto_inicial : Number( montoInicial ),
                                                            monto_cierre : Number( montoInicial )
                                                        } 
                                                    } );
        if ( nueva_caja !== null ) {

            const { id_caja, monto_inicial } = nueva_caja;
            res.status( 200 ).json( {
                status : false,
                msg : 'Caja Creada',
                descipcion : `Caja creada con exito idCaja :  ${ id_caja }, montoInicial : ${ monto_inicial }`
            } );            
        }else {
            res.status( 200 ).json( {
                status : false,
                msg : 'No se pudo realizar esa accion sobre la caja',
                descipcion : `Ocurrio algo al crear la caja, error`
            } ); 
        }


        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }


}

const reabrir_caja = async ( req = request, res = response ) =>{ 

    try {
        
        const { id_caja_chica } = req.params;




    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }

}


const cerrar_caja = async ( req = request, res = response ) =>{ 
    try {


        const { id_caja } = req.query;
        const { idCliente } = req.body;

        const cierre_caja = await prisma.caja.update( { 
                                                        data : {
                                                            fecha_cierre : new Date(),
                                                            id_cliente_cierre : Number( idCliente )
                                                        } 
                                                    } );
        if ( cierre_caja !== null ) {

            const { id_caja, monto_inicial, monto_cierre } = cierre_caja;
            res.status( 200 ).json( {
                status : false,
                msg : 'Caja Cerrada',
                descipcion : `Caja cerrada con exito idCaja :  ${ id_caja }, montoInicial : ${ monto_inicial }, montoFinal : ${ monto_cierre }`
            } );            
        }else {
            res.status( 200 ).json( {
                status : false,
                msg : 'No se pudo realizar esa accion sobre la caja',
                descipcion : `Ocurrio algo al cerrar la caja, error`
            } ); 
        }
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}


const eliminar_caja = async ( req = request, res = response ) =>{ 
    try {
        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}




const obtener_movimientos_de_caja = async ( req = request, res = response ) =>{ 
    try {


        const { id_caja, cantidad, pagina } = req.query;

        const movimientos_de_caja = await prisma.movimiento_caja.findMany( {                                                             
                                                                            skip : (Number(pagina) - 1) * Number(cantidad),
                                                                            take : Number(cantidad),
                                                                            where : {
                                                                                
                                                                                id_caja : Number( idCaja )
                                                                                
                                                                            }
                                                                        } );
        const movimientosDeCaja = movimientos_de_caja.map( element =>({
            idCaja : element.id_caja,
            idTipoPago : element.id_tipo_pago,
            descipcion : element.descripcion,
            
        }));

        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}


const obtener_detalle_movimiento_de_caja = async ( req = request, res = response ) =>{ 
    try {
        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}

const actualizar_caja = async ( req = request, res = response ) =>{ 
    try {

        const {  } = req.body;
        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}



module.exports = {
    crear_caja,
    cerrar_caja,
    eliminar_caja,
    reabrir_caja,
    obtener_movimientos_de_caja,
    obtener_detalle_movimiento_de_caja,
    actualizar_caja
}
