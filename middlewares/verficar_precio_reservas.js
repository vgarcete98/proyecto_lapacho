const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();


const verifica_precio_de_reservas = await = async ( req = request, res = response, next )=>{

    try {
        //-----------------------------------------------------------------------------------------
        //PRIMERAMENTE VAMOS A BUSCAR EL PRECIO ESTABLECIDO PARA QUE SEA UN POCO MAS DINAMICO
        const { horaDesde, horaHasta } = req.body;
        let fecha_desde = generar_fecha(horaDesde),
            fecha_hasta = generar_fecha(horaHasta)
        const precio_reserva = await prisma.precio_reservas.findFirst( { 
                                                                orderBy : [
                                                                    {

                                                                        fecha_precio : 'desc'
                                                                    }

                                                                ]
                                                                
                                                            } );
        //-----------------------------------------------------------------------------------------
        if ( precio_reserva !== null ) {
            const { id_precio_reserva, monto_reserva, valido  } = precio_reserva;
            req.body.idPrecioReserva = id_precio_reserva ;
            req.body.montoReserva = monto_reserva 
            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'Debe de generar el precio para las reservas',
                descipcion : `No existe un precio establecido para las reservas`
            } ); 
        }

    } catch (error) {
        console.log( error )
        res.status( 500 ).json( {
            status : false,
            msg : `Reserva no generada : Ocurrio un error al verificar el precio para esa reserva`,
            //error
        } );
    }

}


module.exports = {
    verifica_precio_de_reservas
}


