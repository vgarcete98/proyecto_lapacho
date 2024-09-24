const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

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
      
        const { nro_factura, nro_cedula, fecha_movimiento, pagina, cantidad } = req.query;

        const fecha_db = generar_fecha( fecha_movimiento );
        const movimientos_de_caja = await prisma.movimiento_caja.findMany( {
                                                                                skip : (Number(pagina) - 1) * Number(cantidad),
                                                                                take : Number(cantidad),
                                                                                where : {
                                                                                    AND : [
                                                                                        nro_factura ? { nro_factura : { contains: nro_factura, mode: 'insensitive' } } : undefined, 
                                                                                        fecha_movimiento ? { fecha_operacion : fecha_db } : undefined,
                                                                                        cedula ? { cedula: { contains: nro_cedula, mode: 'insensitive' } } : undefined,
                                                                                        //es_socio ? { es_socio : ( es_socio === "true" ) } : undefined,
                                                                                    ]
                                                                                }
                                                                            } );
        let movimientosDeCaja = [];
        if ( movimientos_de_caja.length > 0  ){

            movimientosDeCaja = movimientos_de_caja.map( element =>({
                idCaja : element.id_caja,
                idTipoPago : element.id_tipo_pago,
                descipcion : element.descripcion,
                nroFactura : element.nro_factura,
                nroComprobante : element.nro_comprobante,
                fechaOperacion : element.fecha_operacion,
                idCliente : element
            }));
        }

        
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


const obtener_tipo_pagos = async ( req = request, res = response ) => {

    try {

        //const {  } = req.body;

        const tipos_pago = await prisma.tipo_pago.findMany();

        let tiposPago = [];
        if ( tipos_pago.length > 0 ){
            
            tiposPago = tipos_pago.map( element =>({
                idTipoPago : element.id_tipo_pago,
                descTipoPago : element.dec_tipo_pago
                
            }));

            res.status( 200 ).json( {
                status : true,
                msg : 'Tipos de Pago disponibles',
                tiposPago
            } );  


        }else { 
            res.status( 400 ).json( {
                status : false,
                msg : 'No se lograron obtener los tipos de pago',
                descipcion : `No existe ningun tipo de pago, favor crear uno`
            } );   
        }
        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'no se lograron obtener los tipos de pago',
            //error
        } );
        
    } 



}



const crear_tipo_pago = async ( req = request, res = response ) => {

    try {

        const { descTipoPago } = req.body;

        const tipos_pago = await prisma.tipo_pago.create({
            data : { 
                dec_tipo_pago : descTipoPago
            }
        });

        let tiposPago = [];
        if ( tipos_pago !== null ){

            res.status( 200 ).json( {
                status : true,
                msg : 'Tipo de Pago creado',
                descipcion : `Se ha creado un tipo de pago con exito`
            } ); 


        }else { 
            res.status( 400 ).json( {
                status : false,
                msg : 'No se creo el tipo de pago solicitado',
                descipcion : `Ocurrio algo al crear el tipo de pago, favor intente de vuelta`
            } );   
        }
        
    } catch (error) {
        console.log(error);
        res.status( 500 ).json( {
            status : false,
            msg : 'Error al crear el tipo de pago',
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
    actualizar_caja,
    obtener_tipo_pagos,
    crear_tipo_pago
}
