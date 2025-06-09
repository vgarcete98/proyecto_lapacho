const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { Console } = require('winston/lib/winston/transports');

const prisma = new PrismaClient();


const verificar_servicio_en_venta = async ( req = request, res = response, next )=> {

    try {
        const { reservas, inscripciones, cuotas } = req.body;
        
        let verificados = false;
        let movimiento;
        let ventas
        let servicio = null;
        switch ( true ) {
            case ( reservas !== null && reservas !== undefined ):
                ventas = reservas
                break;

            case ( inscripciones !== null && inscripciones !== undefined ):
                ventas = inscripciones
                break;

                
            case ( cuotas !== null && cuotas !== undefined ):
                ventas = cuotas
                break;
            default:
                break;
        }


        for (let venta of ventas) {
            try {
                // Extraer idVenta directamente del objeto venta
                let {  idSocioCuota, idReserva, idAgendamiento, idInscripcion } = venta;

                switch (true) {
                    case (idAgendamiento !== null && idAgendamiento !== undefined) :
                        servicio = await prisma.ventas.findMany( { 
                                                                    where : { id_agendamiento : Number( idAgendamiento) },
                                                                    select : {
                                                                        id_venta : true
                                                                    }
                                                                } );
                        break;
                
                    case ( idReserva !== null && idReserva !== undefined ):
                        servicio = await prisma.ventas.findMany( { 
                                                                    where : { id_cliente_reserva : Number( idReserva ) },
                                                                    select : {
                                                                        id_venta : true
                                                                    }
                                                                } );                                                                     
                        break;

                    
                    case ( idInscripcion !== null && idInscripcion !== undefined ):
                        //DEJO VACIO POR QUE ESTA EN VEREMOS TODAVIA ESTE SERVICIO DE HACER
                        servicio = await prisma.ventas.findMany( { 
                                                                    where : { id_inscripcion : Number( idInscripcion) },
                                                                    select : {
                                                                        id_venta : true
                                                                    }
                                                                } );                                                                       
                        break;

                    case ( idSocioCuota !== null && idSocioCuota !== undefined ):
                        servicio = await prisma.ventas.findMany( { 
                                                                    where : { id_cuota_socio : Number( idSocioCuota ) },
                                                                    select : {
                                                                        id_venta : true
                                                                    }
                                                                } );                                                                       
                        break;

                    default:
                        break;
                }

                console.log( servicio )
                if (servicio !== null && servicio.length > 0) {
                    verificados = true;
                    break;  // Si ya se encontró, no es necesario seguir verificando
                }

            } catch (error) {
                console.log(`No se logró verificar esa venta que se adjuntó: ${error}`);
            }
        }
        //console.log( verificados )
        if (verificados === true) {
            res.status(400).json({
                status: false,
                msg: 'Un servicio que se esta adjuntando ya figura en ventas',
                descripcion: 'Favor verificar los movimientos a procesar ya que algunos se agregaron a ventas ',
            });
        }else {

            next();
        }
    } catch (error) {
        console.log( error );
        res.status(500).json({
            status: false,
            msg: 'No se lograron verificar las ventas, favor intente de nuevo',
        });
    }

}



module.exports = { verificar_servicio_en_venta };

