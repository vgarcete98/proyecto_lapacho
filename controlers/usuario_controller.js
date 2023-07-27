const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const crear_usuario = async ( req = request, res = response ) => {

    const { descripcion_rol } = req.body;

    const rol_nuevo = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
                                                    descripcion_rol )
                                                VALUES ( ${ descripcion_rol });`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            rol_nuevo
        }

    );

}

const borrar_usuario = async ( req = request, res = response ) => {

    const { descripcion_rol } = req.body;

    const rol_nuevo = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
                                                    descripcion_rol )
                                                VALUES ( ${ descripcion_rol });`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            rol_nuevo
        }

    );

}




const actualizar_usuario = async ( req = request, res = response ) => {

    const { descripcion_rol } = req.body;

    const rol_nuevo = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
                                                    descripcion_rol )
                                                VALUES ( ${ descripcion_rol });`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            rol_nuevo
        }

    );

}





const obtener_usuarios = async ( req = request, res = response ) => {

    const { descripcion_rol } = req.body;

    const rol_nuevo = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
                                                    descripcion_rol )
                                                VALUES ( ${ descripcion_rol });`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            rol_nuevo
        }

    );

}



const obtener_usuario = async ( req = request, res = response ) => {

    const { descripcion_rol } = req.body;

    const rol_nuevo = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
                                                    descripcion_rol )
                                                VALUES ( ${ descripcion_rol });`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            rol_nuevo
        }

    );

}


const obtener_accesos_usuario = async ( req = request, res = response ) => {

    //const { descripcion_rol } = req.body;
    const usuarios_acceso = await prisma.$queryRaw`SELECT A.ID_USUARIO, A.ID_SOCIO, A.TIPO_USUARIO, A.NOMBRE_USUARIO,
                                                B.ID_ACCESO, B.DESCRIPCION_ACCESO
                                            FROM USUARIO A JOIN ACCESOS_USUARIO B
                                                ON A.ID_USUARIO = B.ID_USUARIO;`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Accesos de usuario',
            usuarios_acceso
        }

    );

}



module.exports = {

    actualizar_usuario,
    borrar_usuario,
    crear_usuario,
    obtener_accesos_usuario,
    obtener_usuario,
    obtener_usuarios
};