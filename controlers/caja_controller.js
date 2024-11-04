const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();


const { actualiza_datos_del_servicio } = require( '../helpers/actualiza_datos_servicio' );


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


        //ESTO ES PARA REALIZARLO DE UNA FORMA MAS RESUMIDA
        const query = `SELECT X.nro_comprobante AS "nroComprobante", 
                                X.tipo_comprobante AS "tipoComprobante",
                                X.tipo_operacion AS "tipoOperacion",
                                SUM(X.monto) :: INTEGER AS "monto"
                                            FROM (SELECT CASE WHEN ( A.NRO_FACTURA IS NULL ) THEN A.NRO_COMPROBANTE ELSE A.NRO_FACTURA END AS "nro_comprobante",
                                                        CASE WHEN ( A.NRO_FACTURA IS NOT NULL ) THEN 'FACTURA' ELSE 'COMPROBANTE' END AS "tipo_comprobante",
                                                        CASE WHEN (A.ID_COMPRA IS NULL) THEN 'VENTA' ELSE 'COMPRA' END AS "tipo_operacion",
                                                        CASE WHEN ( A.ID_COMPRA IS NOT NULL ) THEN F.MONTO ELSE D.MONTO END AS "monto"
                                                    FROM MOVIMIENTO_CAJA A JOIN CAJA B ON A.ID_CAJA = B.ID_CAJA
                                                    JOIN CLIENTE C ON C.ID_CLIENTE = A.ID_CLIENTE
                                                    LEFT JOIN VENTAS D ON A.ID_VENTA = D.ID_VENTA 
                                                    LEFT JOIN COMPRAS F ON F.ID_COMPRA = A.ID_COMPRA
                                                WHERE (A.fecha_operacion :: DATE ) BETWEEN ('${fecha_desde}' :: DATE) AND ('${fecha_hasta}' :: DATE)) AS X
                        GROUP BY X.nro_comprobante, X.tipo_comprobante, X.tipo_operacion`;
        console.log( query )
        const movimientos_de_caja = await prisma.$queryRawUnsafe(query)

        //const movimientos_de_caja = await prisma.movimiento_caja.findMany();

        if ( movimientos_de_caja.length === 0  ){

            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo ningun movimiento entre esas fechas',
                descipcion : `No hay ningun movimientos para esas fechas`
            } ); 


        }else {

            res.status( 200 ).json( {
                status : true,
                msg : 'movimientos de caja',
                movimientos_de_caja
                //descipcion : `No existe ninguna venta generada para ese cliente`
            } ); 
        }



        
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
      
        const { nro_factura, comprobante } = req.query;
        const query = `SELECT A.ID_MOVIMIENTO_CAJA AS "idMovimientoCaja",
                        		A.ID_CAJA AS "idCaja",
                        		A.ID_CLIENTE AS "idCliente",
                        		C.CEDULA AS "cedula",
                        		CONCAT( C.NOMBRE, ' ', C.APELLIDO ) AS "nombreCliente",
                                CASE WHEN A.ID_COMPRA IS NOT NULL THEN F.DESCRIPCION ELSE D.DESCRIPCION_VENTA END AS "detalle",
                        		CASE WHEN (A.ID_COMPRA IS NULL) THEN 'VENTA' ELSE 'COMPRA' END AS "tipoOperacion",
                        		CASE WHEN A.NRO_FACTURA IS NULL THEN A.NRO_COMPROBANTE ELSE A.NRO_FACTURA END AS "nroComprobante",
                        		CASE WHEN A.NRO_FACTURA IS NOT NULL THEN 'FACTURA' ELSE 'COMPROBANTE' END AS "tipoComprobante",
                        		CASE WHEN A.ID_COMPRA IS NOT NULL THEN F.MONTO ELSE D.MONTO END AS "monto"
                        	FROM MOVIMIENTO_CAJA A JOIN CAJA B ON A.ID_CAJA = B.ID_CAJA
                        	JOIN CLIENTE C ON C.ID_CLIENTE = A.ID_CLIENTE
                        	LEFT JOIN VENTAS D ON A.ID_VENTA = D.ID_VENTA 
                        	LEFT JOIN COMPRAS F ON F.ID_COMPRA = A.ID_COMPRA
                        WHERE ${ ( nro_factura !== undefined ) ? `A.NRO_FACTURA = '${ nro_factura }'` : `A.COMPROBANTE = '${ comprobante }'` }`;
        console.log( query )
        const movimientos_de_caja = await prisma.$queryRawUnsafe(query)
        if ( movimientos_de_caja.length === 0  ){

            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo ningun movimiento entre esas fechas',
                descipcion : `No hay ningun movimientos para esas fechas`
            } ); 


        }else {

            res.status( 200 ).json( {
                status : true,
                msg : 'movimientos de caja',
                movimientos_de_caja
                //descipcion : `No existe ninguna venta generada para ese cliente`
            } ); 
        }

        
    } catch (error) {
        console.log( error )
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
        
        const { nroFactura, idCliente, cedula, tipoPago, nroComprobante, ventas, nroTimbrado } = req.body;
        
        let venta_socio = [];

        //----------------------------------------------------------------------------------------------------------------------------
        let monto_total = 0;
        let factura = {};
        let detalleFactura = [];
        //----------------------------------------------------------------------------------------------------------------------------
        if ( ventas.length > 0  ){
            //GENERO O COMPLETO LAS CABECERAS DE MI FACTURA
            //----------------------------------------------------------------------------------------------------------------------------
            monto_total = obtener_monto_total_ventas(ventas);
            factura = await genera_factura( { monto_total : monto_total, nro_factura : nroFactura, fecha_emision : new Date(), id_cliente : idCliente, nroTimbrado }, ventas );
            detalleFactura = [];
            //----------------------------------------------------------------------------------------------------------------------------

            for (let element in ventas) {
                //----------------------------------------------------------------------------------------------------------------------------
                try { 
                    let { idVenta , idSocioCuota, idReserva, idInscripcion, fechaOperacion, monto, tipoServicio } = ventas[ element ];
                    
                    let venta = await prisma.ventas.findUnique( { where : { id_venta : Number( idVenta ) } } );

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


                    //SERIA COMO EL DETALLE DE LA FACTURA
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
                                                                                            descripcion : venta.descripcion_venta,
                                                                                            creado_en : new Date(),
                                                                                            id_tipo_ingreso : Number(tipoServicio),
                                                                                            fecha_operacion : new Date(),
                                                                                            timbrado : Number( nroTimbrado )
                                                                                        } 
                                                                                } );
                    //OK ACTUALIZO EL ESTADO DE LA VENTA A PAGADO
                    let actualiza_venta = await prisma.ventas.update( { 
                                                                        data : { 
                                                                                    estado : 'PAGADO', 
                                                                                    editado_en : new Date( ),
                                                                                    editado_por : 1, //ESTO HAY QUE CAMBIAR LUEGO
                                                                                    
                                                                                }, 
                                                                        where : { id_venta : Number( idVenta ) } 
                                                                    } );
                    if ( actualiza_venta !== null ){
                        console.log( `venta actualizada con exito ${ actualiza_venta.id_venta }` );
                        //VER SI ES MAS FACTIBLE HACER UN TRIGGER O REALIZAR LA ACTUALIZACION DEL COBRO POR EL SERVICIO AQUI
                        
                        actualiza_datos_del_servicio( actualiza_venta.id_venta );

                        detalleFactura.push( { 
                                                cantidad : 1, 
                                                descripcion : actualiza_venta.descripcion_venta, 
                                                precio : actualiza_venta.monto,
                                                iva10 : actualiza_venta.monto/11 
                                            } );

                        let ingreso_club = await prisma.ingresos.create( { 
                                                                            data : {
                                                                                cargado_en : new Date(),
                                                                                fecha_ingreso : new Date(),
                                                                                monto : actualiza_venta.monto,
                                                                                descripcion : actualiza_venta.descripcion_venta,
                                                                                id_movimiento_caja : movimientos_de_caja.id_movimiento_caja,
                                                                                nro_factura : movimientos_de_caja.nro_factura,
                                                                                id_tipo_ingreso :  movimientos_de_caja.id_tipo_ingreso
                                                                            } 
                                                                        } );

                        if ( ingreso_club !== null ) { 
                            //console.log( `ingreso registrado con exito : ${ ingreso_club.column_d_operacion_ingreso }` );
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

    //console.log( "Llegue hasta aca", ventas.length === venta_socio.length &&  ventas.length !==  0 && venta_socio.length !== 0 )
    if ( ((ventas.length === venta_socio.length) && (ventas.length !==  0)) && (venta_socio.length !== 0) ){

        //console.log( "Llegue hasta aca");
        return res.status( 200 ).json( {
            status : true,
            msg : 'Ventas Procesadas con exito',
            descripcion : `Se han procesado todas las ventas que se tenian disponibles`,
            factura,
            detalleFactura
        } );

    }else { 
        return res.status( 400 ).json( {
            status : false,
            msg : 'No se procesaron todas las ventas disponibles',
            descripcion : `Favor cree un movimiento nuevo para procesar los faltantes`
        } );   
    }

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json( {
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





const genera_factura = async ( datos_factura  = {}, ventas = [] ) => {

    try {
        
        const { monto_total, nro_factura, fecha_emision, id_cliente, nroTimbrado } = datos_factura;

        const cliente = await prisma.cliente.findUnique( { 
                                                            where : { id_cliente : id_cliente },
                                                            select : { 
                                                                ruc: true,
                                                                cedula : true,

                                                            } 
                                                        } )

        const { ruc, cedula } = cliente;

        const timbrado = await prisma.timbrado.findUnique( { where : { nro_timbrado : Number( nroTimbrado ) } } );

        let factura = await prisma.facturas.findFirst( { 
                                                            where : { 
                                                                AND : [ 
                                                                    { nro_factura : nro_factura }, 
                                                                    { nro_timbrado : Number( nroTimbrado ) }, 
                                                                ] } 
                                                        } );
        const nueva_factura = await prisma.facturas.updateMany( { 
                                                                data : { 
                                                                    fecha_emision : fecha_emision,
                                                                    monto_total : monto_total,
                                                                    total_iva : monto_total /11,
                                                                    condicion_venta : 'C',
                                                                    ruc_cliente : ( ruc !== null ) ? ruc : cedula 
                                                                },
                                                                where : { 
                                                                    AND : [ 
                                                                        { nro_factura : nro_factura },
                                                                        { nro_timbrado : Number( nroTimbrado ) },
                                                                        { id_factura : factura.id_factura }
                                                                    ]
                                                                }
                                                            } );

        
        factura = await prisma.facturas.findFirst( { 
            where : { 
                AND : [ 
                    { nro_factura : nro_factura }, 
                    { nro_timbrado : Number( nroTimbrado ) }, 
                ] } 
        } );

        return {
            timbrado : {
                nroTimbrado : timbrado.nro_timbrado,
                fechaVencimiento : timbrado.fecha_vencimiento,
                rucEmisor : timbrado.ruc_emisor,
                razonSocial : timbrado.razon_social,
                direccion  : timbrado.direccion
            },
            factura : {
                nroFactura : factura.nro_factura,
                totalIva : 0,
                condicionVenta : factura.condicion,
                montoTotal : 0
            }
        };
    } catch (error) {
        console.log( error );
        return null;
    }




}

const obtener_monto_total_ventas = async ( ventas = [] ) => {

    try {
        
        let monto_total = 0;
        let servicio;
        for (let element of ventas) {
            
            let { idVenta , idSocioCuota, idAgendamiento,  idReserva, idInscripcion, fechaOperacion, monto, tipoServicio } = element;
            console.log( idSocioCuota, idAgendamiento,  idReserva, idInscripcion );
            if (idAgendamiento !== null) {

                servicio = await prisma.agendamiento_clase.findUnique( { 
                                                                        where : { id_agendamiento : Number(idAgendamiento) },
                                                                        select : {
                                                                            include : {
                                                                                precio_clase : {
                                                                                    select : {
                                                                                        precio : true,

                                                                                    }
                                                                                }
                                                                            } 
                                                                        }   
                                                                    } );
                monto_total += servicio.precio_clase.precio;
            }else if ( idReserva !== null ) {

                servicio = await prisma.reservas.findUnique( { 
                                                                    where : { id_cliente_reserva : Number(idReserva) },
                                                                    select : {
                                                                        include : {
                                                                            precio_reservas : {
                                                                                select : {
                                                                                    monto_reserva : true,

                                                                                }
                                                                            }
                                                                        } 
                                                                    } 
                                                                } );
                monto_total += servicio.precio_reservas.monto_reserva;                                                                        
            }else if( idSocioCuota !== null ) {
                
                servicio = await prisma.cuotas_socio.findUnique( { 
                                                                    where : { id_cuota_socio : Number(idSocioCuota) },
                                                                    include : {
                                                                        precio_cuota : {
                                                                            select : {
                                                                                monto_cuota : true,
                                                                            }
                                                                        }
                                                                    } 
                                                                });
                                                                    
                monto_total += servicio.precio_cuota.monto_cuota;
            }else if ( idInscripcion !== null )  {

                servicio = await prisma.inscripciones.findUnique( { 
                    where : { id_inscripcion : Number(idInscripcion) },
                    select : {
                        costo_inscripcion : true,
                    }
                    
                });
                monto_total += servicio.costo_inscripcion;
            }else {

                monto_total += 0;
            }
            
            console.log( servicio );
        }
        console.log( monto_total )
        return monto_total;

    } catch (error) {
        console.log( error );
        return 0;
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
