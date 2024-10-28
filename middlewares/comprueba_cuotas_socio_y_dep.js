const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const comprueba_pago_cuotas_socio_y_dep = async ( req = request, res = response, next )=>{

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

        for (let numeroCuota of map_cuotas_a_pagar) {
            if (!numerosPendientes.includes(numeroCuota)) {
                return res.status(400).json({ 
                    status : false,
                    msg: `La cuota ${numeroCuota} no existe o no es una cuota pendiente.`,
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
    comprueba_pago_cuotas_socio_y_dep,

}
