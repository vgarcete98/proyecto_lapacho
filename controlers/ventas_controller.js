const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const generar_venta_servicios = async (  req = request, res = response  ) =>{


    try {
        //mientras tanto idCliente va ser mi cabecera, ahora que tengo la cedula solo con eso ya puedo hacer mas cosas
        const { idCliente, cedula, ventas } = req.body;

        let cliente = {};
        let nuevas_ventas = [];
        const cantidad_a_insertar = ventas.length;
        if ( cedula !== undefined && cedula !== "" ){
            cliente = await prisma.cliente.findUnique( { where : { cedula : cedula } } );
        }
        let venta;
        for (const element of ventas) {

            try {
                //AQUI HAY QUE VER LA FORMA DE AÑADIR UNOS CUANTOS CAMPOS MAS PERO DE MOMENTO CON ESO YA ESTARIA
                let { idCuotaSocio, idReserva, monto } = ventas[ element ];
                venta = await prisma.ventas.create( { 
                                                        data : {  
                                                            creado_en : new Date(),
                                                            creado_por : 1, //AQUI LUEGO HAY QUE VER LA FORMA DE COMPLETAR ESTE CAMPO CON EL TOKEN QUE SE ME MANDA
                                                            monto : monto,
                                                            id_cuota_socio : Number( idCuotaSocio ),
                                                            id_socio_reserva : Number( idReserva ),
                                                            estado : false, //ES ASI YA QUE TODAVIA NO SE PAGO
                                                            fecha_operacion : new Date(),
                                                            id_cliente : Number( idCliente ) // Mientras tanto aqui vamos a ver como lo hacemos
                                                        } 
                                                    } );
                nuevas_ventas.push( { idVenta : venta.id_venta } );

            } catch (error) {
                console.log( `Error intentando insertar la venta ${ error }` );
            }

        }

        if ( nuevas_ventas.length > 0 && cantidad_a_insertar ===  nuevas_ventas.length){

            res.status( 200 ).json(
                {
    
                    status : true,
                    msj : 'Ventas Creadas',
                    descripcion : `Todas las Ventas fueron generadas con exito`
                }
            );   
        }else {
            res.status( 400 ).json(
                {
    
                    status : true,
                    msj : 'No se lograron crear todas las ventas que se adjunto',
                    descripcion : `Ventas que fueron generadas con exito ${ nuevas_ventas.length }, Ventas fallidas ${ ventas.length - nuevas_ventas.length }`
                }
            ); 
        }

        
    } catch (error) {
        res.status( 500 ).json(

            {
                status : false,
                msj : `No se logro generar ninguna sola venta ${error}`,
                //error
            }

        ); 
    }

}

const eliminar_venta_servicios = async (  req = request, res = response  ) =>{

    try {
        
    } catch (error) {
        
    }


}



const obtener_venta_servicios = async (  req = request, res = response  ) =>{

    try {


        const { id_cliente, pagina, cantidad, nro_cedula } = req.query;
        let ventas = [];
        const ventas_dependientes = await prisma.cliente.findMany( { 
                                                                        where : { parent_id_cliente : Number(id_cliente) },
                                                                        select : {
                                                                            id_cliente : true
                                                                        } 
                                                                } );
        //console.log( ventas_dependientes )
        let otros_clientes = ( ventas_dependientes.length !== 0  ) ? ventas_dependientes.map( element => element.id_cliente ) : [];
        //console.log( otros_clientes );
        ventas = await prisma.ventas.findMany({
            select: {
              id_cuota_socio: true,
              id_socio_reserva: true,
              estado: true,
              fecha_operacion: true,
              monto: true,
              movimiento_caja: true,
              id_venta: true,
            },
            where: {
                    OR: [
                            // Si `id_cliente` está definido, se incluye esta condición
                            id_cliente ? { id_cliente: Number(id_cliente) } : undefined,
                            // Se verifica si `otros_clientes` no está vacío
                            (ventas_dependientes.length !== 0 ) ? { id_cliente: { in: otros_clientes } } : undefined,
                    ].filter(Boolean),  // Elimina valores indefinidos dentro del OR
                },  // Elimina valores indefinidos dentro del AND
                skip : (Number(pagina) - 1) * Number(cantidad),
                take : Number(cantidad),
          });        

        let ventaServicios = [];
        if ( ventas.length > 0 ) {

            ventaServicios = ventas.map( element =>({
                idVenta : element.id_venta,
                idCliente : element.id_cliente,
                idSocioCuota : element.id_cuota_socio,
                idReserva : element.id_socio_reserva,
                nroCedula : element.cedula,
                fechaOperacion : element.fecha_operacion,
                monto : element.monto,
                estado : element.estado,

                
            }));
            res.status( 200 ).json( {
                status : true,
                msg : 'Ventas de ese cliente',
                ventaServicios
                //descipcion : `No existe ninguna venta generada para ese cliente`
            } ); 


        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No se lograron obtener las Ventas para ese Cliente',
                descipcion : `No existe ninguna venta generada para ese cliente`
            } ); 
        }

        
        
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
