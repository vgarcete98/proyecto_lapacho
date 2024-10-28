const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const comprueba_pago_cuotas_consec = async ( req = request, res = response, next )=>{

    try {
        

        const { cliente, cuotas } = req.body;

        const socio = await prisma.cliente.findUnique({ where : { cedula : cliente }, select : { id_cliente : true } } );
        const cuotas_pendientes = await prisma.cuotas_socio.findMany( { 
                                                                        where : { 
                                                                            AND :[
                                                                                { id_cliente : socio.id_cliente },
                                                                                { estado : 'PENDIENTE' }
                                                                            ]
                                                                        },
                                                                        orderBy: { id_cuota_socio : 'asc' }, 
                                                                    });

        // Obtener la lista de números de cuota pendientes
        const numerosPendientes = cuotas_pendientes.map(c => c.id_cuota_socio);
        const map_cuotas_a_pagar = cuotas.map( d => Number(d.idSocioCuota) );

        const cuotasOrdenadas = map_cuotas_a_pagar.sort((a, b) => a - b); // Ordenar cuotas en orden ascendente
        for (let i = 1; i < cuotasOrdenadas.length; i++) {
            // Verificar que la diferencia entre una cuota y la siguiente sea exactamente 1
            if (cuotasOrdenadas[i] !== cuotasOrdenadas[i - 1] + 1) {
                return res.status(400).json({ 
                    status : false,
                    msg: `Las cuotas deben ser consecutivas. Hay un salto entre las cuotas ${cuotasOrdenadas[i - 1]} y ${cuotasOrdenadas[i]}.`,
                    descripcion : "Verifique las cuotas adjuntadas e intente de nuevo" 
                });
            }
        }
        next();

    } catch (error) {

        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se lograron verificar las ventas, favor intente de nuevo',
            //error
        } );
    }

}




module.exports = {
    comprueba_pago_cuotas_consec,

}
