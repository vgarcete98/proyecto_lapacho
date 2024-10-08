const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();



const obtener_compras_club = async ( req = request, res = response ) =>{

    try {

        const { id_cliente, pagina, cantidad, nro_cedula } = req.query;

        const compras_club = await prisma.compras.findMany( {  
                                                                select : {
                                                                    id_compra : true,
                                                                    estado : true,
                                                                    fecha_operacion : true,

                                                                },
                                                                skip : (Number(pagina) - 1) * Number(cantidad),
                                                                take : Number(cantidad),
                                                                where : {
                                                                    estado : false //que aun no se completo el circuito de compras
                                                                }

                                                            } );

        if ( compras_club.length > 0 ) {

            const compras = compras_club.map(element =>({
                idCompra : element.id_compra,
                fechaGeneracion : element.fecha_operacion,
    
                
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

        const { id_cliente, pagina, cantidad, nro_cedula } = req.query;

        const compras_club = await prisma.compras.findMany( {  
                                                                select : {
                                                                    id_compra : true,
                                                                    estado : true,
                                                                    fecha_operacion : true,

                                                                },
                                                                skip : (Number(pagina) - 1) * Number(cantidad),
                                                                take : Number(cantidad),
                                                            } );


        const compras = compras_club.map( element =>({
            idCompra : element.id_compra,
            idCliente : element.id_cliente,
            idSocioCuota : element.id_cuota_socio,
            idReserva : element.id_socio_reserva,
            nroCedula : element.cedula,
            fechaOperacion : element.fecha_operacion,
            monto : element.monto,
            estado : element.estado,
        }) );

        res.status( 200 ).json( {
            status : true,
            msg : 'Compras del club',
            compras
            //descipcion : `No existe ninguna venta generada para ese cliente`
         
        } )
        
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