const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const obtener_accesos = async ( req = request, res = response ) => {

    const accesos = await prisma.$queryRaw`select CAST ( id_acceso AS INTEGER ) AS id_acceso, CAST ( id_rol_usuario AS INTEGER ) AS id_rol_usuario , 
                                                descripcion_acceso
                                            from accesos_usuario;`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Accesos para usuarios',
            accesos

        }
    );

}




const crear_accesos = async ( req = request, res = response ) => {

    const { id_rol_usuario, descripcion_acceso } = req.body;

    const nuevo_acceso = await prisma.$executeRaw`INSERT INTO public.accesos_usuario(
                                                    id_rol_usuario, descripcion_acceso)
                                                    VALUES ( ${ id_rol_usuario }, ${ descripcion_acceso } );`

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Acceso Creado',
            nuevo_acceso

        }
    );

}






module.exports = {

    obtener_accesos,
    crear_accesos

}