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

                                                                }
                                                            } );



        
    } catch (error) {

        console.log( error );
        
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
            msg : 'Ha ocurrido un error al comprobar el pago'
        } );
    }





}





module.exports = {

    obtener_compras_club,
    generar_compras_club
}