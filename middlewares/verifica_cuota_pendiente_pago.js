const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();




const verifica_cuota_pendiente_pago = async ( req = request, res = response, next )=>{

    try {
        
        const { cliente, cuotas } = req.body;
        const socio = await prisma.cliente.findUnique({ where : { cedula : cliente }, select : { id_cliente : true } } );
        for (let numeroCuota of cuotas) {
            const { idSocioCuota } = numeroCuota;
            const cuota_en_venta = await prisma.ventas.findFirst( { 
                where : { 
                    AND :[
                        { id_cliente : socio.id_cliente },
                        { estado : { contains : 'PENDIENTE' } },
                        { id_cuota_socio: Number( idSocioCuota ) }
                    ] 
                },
                orderBy: { id_cuota_socio : 'asc' }, 
            });
            if (cuota_en_venta !== null) {
                return res.status(400).json({ 
                    status : false,
                    msg: `La cuota ${idSocioCuota} es una cuota pendiente de procesar.`,
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
    verifica_cuota_pendiente_pago,

}
