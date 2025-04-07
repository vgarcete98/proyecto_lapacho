const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')

const prisma = new PrismaClient();




const comprobar_disponibilidad_reserva = async ( req = request, res = response, next )=> {

    try {
        const { idMesa, horaDesde, horaHasta } = req.body;
        //const [ dia, mes, annio ] = fechaAgendamiento.split( "/" );
        //console.log( "" )
        let existe_reserva = [];

        existe_reserva = await prisma.reservas.findMany( { 
                                                            where : { 
                                                                hora_desde : { gte : new Date( horaDesde ) },
                                                                hora_hasta : { lte : new Date( horaHasta ) },
                                                                
                                                                AND : [ 
                                                                    { id_mesa : idMesa }, 
                                                    
                                                                ]
                                                            } 
                                                        } );

        //console.log ( existe_reserva )
        if ( existe_reserva.length === 0 ){
            next();
        }else{
            res.status( 400 ).json( {
                status : false,
                msg : "No existe fecha libre para esa reserva"
            } );
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se logro verificar si habia reserva en esa fecha : ${ error }`
        } );
    }

}




const comprobar_reserva_express_duplicada = async ( req = request, res = response, next )=> {

    try {
        const { tipoIngreso, idCliente } = req.body;
        //const [ dia, mes, annio ] = fechaAgendamiento.split( "/" );
        //console.log( "" )
        let existe_reserva = [];
        //console.log( new Date ( (new Date()).toLocaleDateString()) )
        const fechaDesde = new Date();

        fechaDesde.setHours(0,0,0);

        const fechaHasta = new Date();
        fechaHasta.setHours( 23,59,59 )

        existe_reserva = await prisma.reservas.findMany( { 
                                                            where : { 
                                                                id_cliente : Number(idCliente), 
                                                                AND : [ 
                                                                    {
                                                                        hora_desde : { gte : fechaDesde },                                                                
                                                                        OR : [
                                                                            { hora_hasta : { lte : fechaHasta } },
                                                                            { hora_hasta : null }
                                                                        ],
                                                                    }
                                                                ]
                                                            } 
                                                        } );

        //console.log ( existe_reserva )
        if ( existe_reserva.length === 0 ){
            next();
        }else{
            res.status( 400 ).json( {
                status : false,
                msg : "Ya existe una reserva Express Pendiente de Cobro"
            } );
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se logro verificar si habia reserva en esa fecha : ${ error }`
        } );
    }

}

module.exports = { comprobar_disponibilidad_reserva, comprobar_reserva_express_duplicada } ;