const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();





const actualiza_datos_del_servicio = async ( id_venta = 0 ) => {


    try {
        
        const venta = await prisma.ventas.findUnique( {  
                                                        where : { id_venta : Number( id_venta ) },
                                                        select : {
                                                            id_agendamiento : true,
                                                            id_cliente_reserva : true,
                                                            id_inscripcion : true,
                                                            id_cuota_socio : true
                                                        }
                                                    } );

        if ( venta !== null ) {

            const { id_agendamiento, id_cliente_reserva, id_inscripcion, id_cuota_socio } = venta;

            let servicio;

            switch (venta) {
                case id_agendamiento !== null:
                    servicio = await prisma.agendamiento_clase.update( { 
                                                                            where : { id_agendamiento : id_agendamiento },
                                                                            data : {
                                                                                
                                                                            }
                                                                        } );
                    break;
            
                case id_cliente_reserva !== null :
                servicio = await prisma.reservas.update( { 
                                                                        where : { id_cliente_reserva : id_cliente_reserva },
                                                                        data : {
                                                                            estado : 'PAGADO'
                                                                        }
                                                                    } );                                                                        
                    break;


                case id_cliente_reserva !== null :
                    servicio = await prisma.reservas.update( { 
                                                                            where : { id_cliente_reserva : id_cliente_reserva },
                                                                            data : {
                                                                                estado : 'PAGADO'
                                                                            }
                                                                        } );                                                                        
                    break;

                
                default:
                    break;
            }




        }



    } catch (error) {
        
    }





}



module.exports = {
    actualiza_datos_del_servicio
}







