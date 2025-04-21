const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();



const obtener_compras_club = async ( req = request, res = response ) =>{

    try {

        const { pagina, cantidad } = req.query;

        const compras_club = await prisma.compras.findMany( {  
                                                                select : {
                                                                    id_compra : true,
                                                                    estado : true,
                                                                    fecha_operacion : true,
                                                                    descripcion : true,
                                                                    cantidad : true,
                                                                    creado_en : true,
                                                                    id_tipo_egreso : true,
                                                                    id_insumo : true
                                                                },
                                                                skip : (Number(pagina) - 1) * Number(cantidad),
                                                                take : Number(cantidad),
                                                                where : {
                                                                    estado : { contains : 'PENDIENTE' }//que aun no se completo el circuito de compras
                                                                }

                                                            } );

        if ( compras_club.length > 0 ) {

            const compras = compras_club.map(element =>({
                idCompra : element.id_compra,
                fechaGeneracion : element.fecha_operacion,
                estado : element.estado,
                descripcion : element.descripcion,
                cantidad : element.cantidad,
                fechaCreacion : element.creado_en,
                tipoCompra : element.id_tipo_egreso,
                idInsumo : element.id_insumo
                
            }) );
    
            res.status( 200 ).json( {
                status : true,
                msg : 'Ventas de ese cliente',
                compras
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } ); 


        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No se lograron obtener las Compras del club',
                descripcion : `No existe ninguna compra generada por el club`
            } ); 
        }

        
        
    } catch (error) {

        //console.log( error );
        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo obtener las compras generadas por el club`,
            //error
        } );
        
    }

}


const generar_compras_club = async ( req = request, res = response ) =>{

    try {

        const { compras } = req.body;
        let nueva_compra, gasto_fijo;
        let id_gasto_fijo = null;
        let compras_procesadas = 0;
        for (let element of compras) {

            try {
                
                let { descripcion, cantidad, gastoFijo, tipoEgreso, fechaVencimiento } = element;
    
                if ( gastoFijo === true ){
                    gasto_fijo = await prisma.gastos_fijos.create( { 
                                                                        data : {
                                                                            creado_en : new Date(),
                                                                            creado_por : 1,
                                                                            fecha_vencimiento : new Date(fechaVencimiento),
                                                                            descripcion_gasto_fijo : descripcion,
                                                                            monto : 0,
                                                                            id_tipo_egreso : Number( tipoEgreso )
                                                                        } 
                                                                    } );
                }
                nueva_compra = await prisma.compras.create( { 
                                                                data : {
                                                                    creado_en : new Date(),
                                                                    creado_por : 1,
                                                                    descripcion : descripcion,
                                                                    cantidad : Number( cantidad ),
                                                                    estado : 'PENDIENTE DE COMPRA',
                                                                    monto : 0,
                                                                    id_tipo_egreso : Number( tipoEgreso ),
                                                                    id_cliente : 1,
    
                                                                } 
                                                            } );
                if( nueva_compra !== null ) {
                    compras_procesadas += 1;
                    console.log( nueva_compra )
                }
            } catch (error) {
                console.log( error );
            }

        }

        if ( compras.length ===  compras_procesadas ){

            res.status( 200 ).json( {
                status : true,
                msg : 'Compras del club generadas',
                descripcion : "Todas las compras del club fueron generadas"
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } );
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No todas las compras del club fueron procesadas',
                descripcion : "Verifique las compras que faltan agregar para su compra"
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } );
        }
        
    } catch (error) {

        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar las compras del club'
        } );
    }





}




const procesar_pago_por_compras_club = async () => {


    try {

        const { 
                compras,
                nroFactura,
                montoTotal, //Que lucas en todo caso haga el calculo en el front o algo asi y me pase directo 
                fechaPago, // LA FECHA EN LA QUE SE PRODUJO EL PAGO POR LA COMPRA
                idTipoPago //PARA VER COMO ES QUE SE PAGO ESTA COMPRA QUE SE TENIA PENDIENTE
            } = req.body;
        let compras_procesadas = 0;
        let actualiza_compra;
        for (let element of compras) {

            try {
                
                let { descripcion, idInsumo, idCompra } = element;
    
                actualiza_compra = await prisma.compras.update( { 
                                                                data : {
                                                                    editado_en : new Date(),
                                                                    editado_por : 1,
                                                                    estado : 'PAGADO'
                                                                },
                                                                where : {
                                                                    id_compra : Number( idCompra )
                                                                } 
                                                            } );
                if( actualiza_compra !== null ) {
                    //console.log( nueva_compra );
                    //SE ACTUALIZO LA COMPRA POR TANTO TIENE QUE FIGURARSE COMO UN EGRESO
                    //Y TAMBIEN COMO UN MOVIMIENTO DE CAJA PARA PAGAR
                    let { cantidad, monto, id_tipo_egreso,  } = actualiza_compra;
                    let movimiento_caja = await prisma.movimiento_caja.create( {  
                                                                                data : {
                                                                                    creado_por : 1,
                                                                                    cedula : 4365710,
                                                                                    descripcion : `PAGO POR COMPRA ${ idCompra }`,
                                                                                    id_venta : null,
                                                                                    id_compra : Number( idCompra ),
                                                                                    creado_en : new Date(),
                                                                                    nro_factura : nroFactura,
                                                                                    id_factura : null,
                                                                                    id_tipo_egreso : id_tipo_egreso,
                                                                                    nro_comprobante : null,
                                                                                    fecha_operacion : new Date(),
                                                                                    id_tipo_pago : Number( idTipoPago )
                                                                                }
                                                                            } );
                    if ( movimiento_caja !== null ){
                        //HAY QUE HACER FIGURAR COMO UN EGRESO A ESE MOVIMIENTO NUEVO DE LA CAJA

                        let { descripcion, id_movimiento_caja, id_tipo_egreso } = movimiento_caja;
                        let nuevo_egreso = await prisma.egresos.create( {
                                                                            data : {
                                                                                cargado_en : new Date(),
                                                                                comprobante : null,
                                                                                nro_factura : nroFactura,
                                                                                descripcion : descripcion,
                                                                                id_movimiento_caja : id_movimiento_caja,
                                                                                fecha_pago :  new Date(),
                                                                                monto : monto,
                                                                                id_tipo_egreso : id_tipo_egreso,
                                                                                borrado : false

                                                                            }
                                                                        } );


                        if ( nuevo_egreso !== null  ){
                            //AQUI RECIEN SE COMPLETO EL CIRCUITO
                            compras_procesadas += 1;
                        }

                    }

                }
            } catch (error) {
                console.log( error );
            }

        }

        if ( compras.length ===  compras_procesadas ){

            res.status( 200 ).json( {
                status : true,
                msg : 'Compras del club generadas',
                descripcion : "Todas las compras del club fueron generadas"
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } );
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No todas las compras del club fueron procesadas',
                descripcion : "Verifique las compras que faltan agregar para completar"
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } );
        }
        
    } catch (error) {

        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar las compras del club'
        } );
    }

}





const agregar_tipo_egreso = async ( req = request, res = response ) =>{

    try {

        const { descripcion, esGastoFijo } = req.body;
    

        const gasto_fijo = await prisma.tipos_egreso.create( { 
                                                                data : {
                                                                    creado_en : new Date(),
                                                                    creado_por : 1,
                                                                    descripcion : descripcion,
                                                                    gasto_fijo : (esGastoFijo === true)? true : false
                                                                }
                                                            } );

        if ( gasto_fijo !== null ){

            res.status( 200 ).json( {
                status : true,
                msg : 'Tipo de gasto generado',
                descripcion : "Se ha generado el tipo de gasto para una compra"
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } );
        }else {

            res.status( 400 ).json( {
                status : false,
                msg : 'No se creo el tipo de gasto',
                descripcion : "No se ha generado el tipo de gasto para procesar las compras"
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } );

        }

        
    } catch (error) {

        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al comprobar las compras del club'
        } );
    }





}








module.exports = {

    obtener_compras_club,
    generar_compras_club,
    procesar_pago_por_compras_club,
    agregar_tipo_egreso
}