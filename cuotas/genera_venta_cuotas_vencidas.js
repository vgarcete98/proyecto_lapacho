const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const schedule = require('node-schedule');


const cron_job_genera_venta_cuotas_vencidas = async (  ) => { 

    try {

        console.log( 'Ejecutando procedimiento de cuotas vencidas' );
        let ventas_de_cuotas = 0;

        let ingreso_por_cuota = await prisma.tipos_ingreso.findFirst( { 
            where : { descripcion : 'CUOTAS' },
            select : {
                id_tipo_ingreso : true
            } 
        } );
        //VOY A BUSCAR PRIMERO TODAS ESAS CUOTAS PENDIENTES
        let cuotas_vencidas = await prisma.cuotas_socio.findMany( { 
                                                                        where : {  
                                                                            AND :[

                                                                                { fecha_vencimiento :  { lte : new Date() }  },
                                                                                { estado : 'PENDIENTE' }
                                                                            ]
                                                                        },
                                                                        include : {
                                                                            cliente : {
                                                                                select :{
                                                                                    cedula : true
                                                                                }
                                                                            },
                                                                        } 
                                                                    } );
        
        for (let element of cuotas_vencidas) {
            
            let { descripcion, id_cliente, id_cuota_socio, monto_cuota, cliente} = element;
            let { cedula } = cliente;
            let venta = await prisma.ventas.create( { 
                                                        data : {
                                                            creado_en : new Date( ),
                                                            creado_por : 1,
                                                            estado : 'PENDIENTE DE PAGO',
                                                            descripcion_venta : descripcion,
                                                            monto : monto_cuota,
                                                            cedula : cedula,
                                                            id_agendamiento : null,
                                                            id_cliente_reserva : null,
                                                            id_cuota_socio : id_cuota_socio,
                                                            id_cliente : id_cliente,
                                                            id_inscripcion : null,
                                                            fecha_operacion : new Date(),
                                                            id_tipo_ingreso : ingreso_por_cuota.id_tipo_ingreso

                                                        }
                                                    } );
            if( venta !== null ) {
                console.log( 'Venta generada' );
                ventas_de_cuotas += 1;
                let cuota_actualizada = await prisma.cuotas_socio.update( { 
                                                                            where : { id_cuota_socio : id_cuota_socio  },
                                                                            data : {
                                                                                estado : 'PENDIENTE DE PAGO'
                                                                            } 
                                                                        
                                                                        } )
            }

        }

        cuotas_vencidas = await prisma.cuotas_socio.update( {
            data : { estado : 'PENDIENTE DE PAGO' }, 
            where : {  
                AND :[

                    { fecha_vencimiento :  { lte : new Date() }  },
                    { estado : 'PENDIENTE' }
                ]
            }
        } );
        console.log( 'Procedimiento terminado' );

    } catch (error) {
        
        console.log( `No se logro ejecutar el procedimiento de carga de gastos fijos : ${ error }` );
    }



}



module.exports = {
    cron_job_genera_venta_cuotas_vencidas
}












