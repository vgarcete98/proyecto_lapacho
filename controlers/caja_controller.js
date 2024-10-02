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
                                                            id_cliente : 1,//Number( idCliente ),// ESTO LUEGO HAY QUE CAMBIAR YA QUE DEBE SER A TRAVEZ DEL TOKEN
                                                            monto_inicial : Number( montoInicial ),
                                                            monto_cierre : Number( montoInicial ),
                                                            id_cliente_apertura : 1 // ESTO LUEGO HAY QUE CAMBIAR YA QUE DEBE SER A TRAVEZ DEL TOKEN
                                                            
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
            res.status( 400 ).json( {
                status : false,
                msg : 'No se pudo realizar esa accion sobre la caja',
                descipcion : `Ocurrio algo al crear la caja, error`
            } ); 
        }


        
    } catch (error) {
        console.log ( error );
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
        const { idCliente } = req.body;//TIENE QUE VENIR DEL TOKEN, ESTA PENDIENTE DE REALIZAR

        const cierre_caja = await prisma.caja.update( { 
                                                        data : {
                                                            fecha_cierre : new Date(),
                                                            id_cliente_cierre : Number( idCliente ),
                                                            fecha_actualizacion : new Date(),

                                                        },
                                                        where : { id_caja : Number( id_caja ) }
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
        console.log( error );
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


        const { id_caja, cantidad, pagina, fecha_desde, fecha_hasta } = req.query;

        const movimientos_de_caja = await prisma.movimiento_caja.findMany( {                                                             
                                                                            skip : (Number(pagina) - 1) * Number(cantidad),
                                                                            take : Number(cantidad),
                                                                            where : {

                                                                                AND : [

                                                                                    id_caja? { id_caja :  Number( id_caja ) } : undefined,
                                                                                    fecha_desde? { fecha_operacion : { gte : generar_fecha( fecha_desde ) }  } : undefined,
                                                                                    fecha_hasta? { fecha_operacion : { lte : generar_fecha( fecha_hasta ) }  } : undefined,
                                                                                ].filter( Boolean )
                                                                                
                                                                                
                                                                            },
                                                                            include : {
                                                                                ventas : {
                                                                                    select : {
                                                                                        cedula : true, 
                                                                                        descripcion_venta : true,
                                                                                        monto : true
                                                                                    }
                                                                                },
                                                                                compras : {
                                                                                    select :{
                                                                                        fecha_operacion : true,
                                                                                        estado : true
                                                                                    }
                                                                                }
                                                                            }
                                                                        } );
        const movimientosDeCaja = movimientos_de_caja.map( element =>({
            idCaja : element.id_caja,
            idTipoPago : element.id_tipo_pago,
            descripcion : element.descripcion,
            tipoMovimiento : ( element.id_venta === null ) ? 'VENTA' : 'COMPRA',
            nroFactura : element.nro_factura,
            nroComprobante : element.nro_comprobante,
            
        }));



        res.status( 200 ).json( {
            status : true,
            msg : 'movimientos de caja',
            movimientosDeCaja
            //descipcion : `No existe ninguna venta generada para ese cliente`
        } ); 

        
    } catch (error) {
        console.log(error );
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

const generar_movimientos_de_caja_ventas = async ( req = request, res = response ) =>{ 

    try {
        
        const { nroFactura, idCliente, cedula, tipoPago, nroComprobante, ventas, compras } = req.body;
        
        const venta_socio = [];

        const compras_club = [];

        if ( ventas.length > 0  ){

            for (let element in ventas) {
                //----------------------------------------------------------------------------------------------------------------------------
                try { 
                    let { idVenta , idSocioCuota, idReserva, fechaOperacion, monto, estado } = ventas[ element ];
                    
                    let { descripcion_venta } = await prisma.ventas.findUnique( { where : { id_venta : Number( idVenta ) } } );

                    //AQUI VAMOS A OBTENER SIEMPRE LA ULTIMA CAJA ABIERTA
                    //----------------------------------------------------------------------------------------------------------------------------
                    let caja = await prisma.caja.findFirst( { 
                                                                orderBy : { fecha_apertura : 'desc' }, 
                                                                where : {
                                                                    AND : [
                                                                        { fecha_cierre : null }
                                                                    ]
                                                                } 
                                                            } );
                    //----------------------------------------------------------------------------------------------------------------------------
                    let movimientos_de_caja = await prisma.movimiento_caja.create( { 
                                                                                        data : {
                                                                                            creado_por : 1,
                                                                                            cedula : cedula,
                                                                                            id_cliente : Number( idCliente ),
                                                                                            id_tipo_pago : Number( tipoPago ),
                                                                                            id_caja : caja.id_caja,
                                                                                            nro_comprobante : nroComprobante,
                                                                                            nro_factura : nroFactura,
                                                                                            id_venta : Number( idVenta ),
                                                                                            id_compra : null,
                                                                                            descripcion : descripcion_venta,
                                                                                            creado_en : new Date()
                                                                                        } 
                                                                                } );

                    let caja_actualizada = await prisma.caja.update( { 
                                                                        data : {
                                                                            monto_cierre : caja.monto_cierre + Number( monto ),
                                                                            fecha_actualizacion : new Date(),
                                                                            cliente_actualiza : 1
                                                                        },
                                                                        where : {
                                                                            id_caja : caja.id_caja
                                                                        } 
                                                                    } );
                    //OK ACTUALIZO EL ESTADO DE LA VENTA A PAGADO
                    let actualiza_venta = await prisma.ventas.update( { 
                                                                        data : { 
                                                                                    estado : true, 
                                                                                    editado_en : new Date( ),
                                                                                    editado_por : 1, //ESTO HAY QUE CAMBIAR LUEGO
    
                                                                                }, 
                                                                        where : { id_venta : Number( idVenta ) } 
                                                                    } );
                    if ( actualiza_venta !== null ){
                        console.log( `venta actualizada con exito ${ actualiza_venta.id_venta }` );
                        //VER SI ES MAS FACTIBLE HACER UN TRIGGER O REALIZAR LA ACTUALIZACION DEL COBRO POR EL SERVICIO AQUI

                        let ingreso_club = await prisma.ingresos.create( { 
                                                                            data : {
                                                                                cargado_en : new Date(),
                                                                                fecha_ingreso : new Date(),
                                                                                monto : actualiza_venta.monto,
                                                                                descripcion : actualiza_venta.descripcion_venta,
                                                                                id_movimiento_caja : movimientos_de_caja.id_movimiento_caja,
                                                                                nro_factura : movimientos_de_caja.nro_factura,
                                                                                id_tipo :  1
                                                                            } 
                                                                        } );

                        if ( ingreso_club !== null ) { 
                            console.log( `ingreso registrado con exito : ${ ingreso_club.column_d_operacion_ingreso }` );
                            venta_socio.push( { ingreso_club } );
                        }else {
                            console.log( `No se registro el ingreso de esa venta : ${ idVenta }` );
                        }

                    }else {
                        console.log( `No se actualizo el estado de esa venta : ${ idVenta }` );
                    }
                    
                    
                } catch (error) {
                    console.log( error );
                }
    
            }
        }




    if ( ventas.length === venta_socio.length &&   ventas.length !==  0 && venta_socio.length !== 0 ){
        res.status( 200 ).json( {
            status : true,
            msg : 'Ventas Procesadas con exito',
            descipcion : `Se han procesado todas las ventas que se tenian disponibles`
        } ); 
    }else { 
        res.status( 400 ).json( {
            status : false,
            msg : 'No se creo el tipo de pago solicitado',
            descipcion : `Ocurrio algo al crear el tipo de pago, favor intente de vuelta`
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





const generar_movimientos_de_caja_compras = async ( req = request, res = response ) =>{ 

    try {
        
        const { nroFactura, idCliente, cedula, tipoPago, nroComprobante, ventas, compras } = req.body;
        
        const venta_socio = [];

        const compras_club = [];

        if ( compras.length > 0 ){
            for (let element in compras) {
                //----------------------------------------------------------------------------------------------------------------------------
                try { 
                    let { idVenta , idSocioCuota, idReserva, fechaOperacion, monto, estado } = compras[ element ];
    
                    let movimientos_de_caja = await prisma.movimiento_caja.create( { 
                                                                                        data : {
                                                                                            creado_por : 1,
                                                                                            cedula : cedula,
                                                                                            id_cliente : Number( idCliente ),
                                                                                            id_tipo_pago : Number( tipoPago ),
                                                                                            id_caja : Number( idCaja ),
                                                                                            nro_comprobante : nroComprobante,
                                                                                            nro_factura : nroFactura,
                                                                                            id_venta : Number( idVenta ),
    
                                                                                        } 
                                                                                } );
    
                    let actualiza_venta = await prisma.ventas.update( { 
                                                                        data : { 
                                                                                    estado : true, 
                                                                                    editado_en : new Date( ),
                                                                                    editado_por : 1, //ESTO HAY QUE CAMBIAR LUEGO
    
                                                                                }, 
                                                                        where : { id_venta : Number( idVenta ) } 
                                                                    } );
                    if ( actualiza_venta !== null ){
                        console.log( `venta actualizada con exito ${ actualiza_venta.id_venta }` );
                    }else {
                        console.log( `No se actualizo el estado de esa venta : ${ idVenta }` );
                    }
                    
                    
                } catch (error) {
                    console.log( error );
                }
    
            }
        }

    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }

}






const obtener_detalles_caja = async ( req = request, res = response ) =>{ 


    try {
        
        const query = `SELECT A.ID_TIPO_PAGO AS "tipoPago",
                            COUNT ( A.ID_TIPO_PAGO ) AS "cantidadTransacciones",
                            B.dec_tipo_pago as "descTipoPago",
                            A.ID_CAJA
                        FROM MOVIMIENTO_CAJA A JOIN TIPO_PAGO B ON A.ID_TIPO_PAGO = B.ID_TIPO_PAGO
                    GROUP BY A.ID_TIPO_PAGO,A.ID_CAJA, B.dec_tipo_pago

                    SELECT A.id_caja AS "idCaja",
                            A.id_cliente_apertura AS "idClienteApertura",
                            (SELECT  nombre_usuario FROM CLIENTE B WHERE A.id_cliente_apertura = B.ID_CLIENTE LIMIT 1) AS "usuarioApertura",
                            A.fecha_apertura AS "fechaApertura",
                            A.monto_inicial AS "montoInicial",
                            A.fecha_cierre AS "fechaCierre",
                            A.monto_cierre AS "montoCierre",
                            A.id_cliente_cierre AS "idClienteCierre",
                            cant_tipos_pago.dec_tipo_pago AS "descTipoPago",
                            cant_tipos_pago.cantidad_transacciones AS "cantidadTransacciones",
                            (SELECT  nombre_usuario FROM CLIENTE B WHERE A.id_cliente_cierre = B.ID_CLIENTE LIMIT 1) AS "usuarioCierre"
                        FROM CAJA A JOIN (SELECT A.ID_TIPO_PAGO AS "tipoPago",
                                        COUNT ( A.ID_TIPO_PAGO ) AS cantidad_transacciones,
                                        B.dec_tipo_pago ,
                                        A.ID_CAJA
                                    FROM MOVIMIENTO_CAJA A JOIN TIPO_PAGO B ON A.ID_TIPO_PAGO = B.ID_TIPO_PAGO
                                GROUP BY A.ID_TIPO_PAGO,A.ID_CAJA, B.dec_tipo_pago) AS cant_tipos_pago ON cant_tipos_pago.id_caja = A.id_caja;`;
        const detallesCaja = await prisma.$queryRawUnsafe(query);


        if ( detallesCaja.length > 0 ){
            res.status( 200 ).json( {
                status : true,
                msg : 'Detalles de la caja en cuestion',
                detallesCaja
            } ); 
        }else { 
            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvieron los detalles de la caja',
                descipcion : `Aun no se ha procesado ningun movimiento en esa caja`
            } );   
        }



    } catch (error) {
        console.log( error );
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
    actualizar_caja,
    obtener_tipo_pagos,
    crear_tipo_pago,
    generar_movimientos_de_caja_ventas,
    generar_movimientos_de_caja_compras,
    obtener_detalles_caja
}
