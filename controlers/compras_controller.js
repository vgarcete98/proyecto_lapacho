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
                                                                    id_tipo_egreso : true
                                                                },
                                                                skip : (Number(pagina) - 1) * Number(cantidad),
                                                                take : Number(cantidad),
                                                                where : {
                                                                    estado : 'PENDIENTE DE COMPRA' //que aun no se completo el circuito de compras
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
                tipoCompra : element.id_tipo_egreso
                
            }) );
    
            res.status( 200 ).json( {
                status : true,
                msg : 'Ventas de ese cliente',
                compras
                //descipcion : `No existe ninguna venta generada para ese cliente`
            } ); 


        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No se lograron obtener las Compras del club',
                descipcion : `No existe ninguna compra generada por el club`
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
                //descipcion : `No existe ninguna venta generada para ese cliente`
            } );
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No todas las compras del club fueron procesadas',
                descripcion : "Verifique las compras que faltan agregar para su compra"
                //descipcion : `No existe ninguna venta generada para ese cliente`
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
    generar_compras_club
}