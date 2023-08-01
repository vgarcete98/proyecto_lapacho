const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const obtener_tipos_reserva = async ( req = request, res = response ) => {

    const tipos_reserva = await prisma.$queryRaw`SELECT * FROM Tipo_Reserva`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            tipos_reserva
        }
    );


}


const crear_tipo_reserva = async ( req = request, res = response ) => {

    const { desc_tipo_reserva } = req.body;

    const tipo_reserva = await prisma.$executeRaw`INSERT INTO public.Tipo_Reserva(
                                                    desc_tipo_reserva )
                                                VALUES ( ${ desc_tipo_reserva })`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            tipo_reserva
        }

    );

}



const actualizar_tipo_reserva = async ( req = request, res = response ) => {

    const { id_reserva } = req.params;
    const { new_desc_tipo_reserva } = req.body;
    const tipo_reserva = await prisma.$executeRaw`UPDATE public.Tipo_Reserva
                                                    SET desc_tipo_reserva= ${ new_desc_tipo_reserva }
                                                WHERE id_tipo_reserva = ${id_reserva}`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            tipo_reserva
        }

    );

}




const eliminar_tipo_reserva = async ( req = request, res = response ) => {

    const { id_reserva } = req.params;
    //const { new_desc_tipo_reserva } = req.body;
    const tipo_reserva = await prisma.$executeRaw`UPDATE public.Tipo_Reserva
                                                    SET desc_tipo_reserva= ${ new_desc_tipo_reserva }
                                                WHERE id_tipo_reserva = ${id_reserva}`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            tipo_reserva
        }

    );

}

module.exports = {

    crear_tipo_reserva,
    actualizar_tipo_reserva,
    eliminar_tipo_reserva,
    obtener_tipos_reserva

}