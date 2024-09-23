const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const generar_venta_servicios = async (  req = request, res = response  ) =>{


    try {

        const { ventas } = req.body;

        let venta;
        for (const element of ventas) {

            try {
                let {  } = ventas[ element ];
                venta = await prisma.ventas.create( { 
                                                        data : {  
                                                            
                                                        } 
                                                    } );

            } catch (error) {
                console.log( `Error intentando insertar la venta ${ error }` );
            }

        }

        
    } catch (error) {
        
    }

}

const eliminar_venta_servicios = async (  req = request, res = response  ) =>{

    try {
        
    } catch (error) {
        
    }


}



const obtener_venta_servicios = async (  req = request, res = response  ) =>{

    try {


        const { id_cliente, pagina, cantidad } = req.query;

        const ventas = await prisma.ventas.findMany( { 
                                                        select : {
                                                            id_cuota_socio : true,
                                                            id_socio_reserva : true,
                                                            estado : true,
                                                            fecha_operacion : true,
                                                            monto : true,
                                                            movimiento_caja : true,
                                                            id_venta : true,
                                                            

                                                        },
                                                        skip : (Number(pagina) - 1) * Number(cantidad),
                                                        take : Number(cantidad),
                                                        where : {
                                                            AND : [
                                                                id_cliente ? { id_cliente: Number( id_cliente ) } : undefined, 
                                                                
                                                            ].filter( Boolean )
                                                        }
                                                    } );
        let ventaServicios = ventas.map( element =>({
            idVenta : element.id_venta,
            idCliente : element.id_cliente,
            idSocioCuota : element.id_cuota_socio,
            idReserva : element.id_socio_reserva,

            
        }));

        
        
    } catch (error) {
        console.log( `Ocurrio un error al consultar las cuotas ${ error }` );
        res.status( 500 ).json(
            {
                status : true,
                msj : `Error al obtener las ventas para ese cliente ${ error }`,
                //descripcion : "Ingrese correctamente su contraseña"
            }
        );
    }


}


const actualizar_venta_servicios = async (  req = request, res = response  ) =>{


}








module.exports = {
    generar_venta_servicios,
    actualizar_venta_servicios,
    eliminar_venta_servicios,
    obtener_venta_servicios
}
