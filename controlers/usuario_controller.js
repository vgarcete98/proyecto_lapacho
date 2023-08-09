const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const crear_usuario = async ( req = request, res = response ) => {

    const { id_acceso, id_socio, tipo_usuario, nombre_usuario, contraseña } = req.body;

    const nuevo_usuario = await prisma.$executeRaw`INSERT INTO public.usuario(
                                                    id_acceso, id_socio, tipo_usuario, nombre_usuario, contrasea)
                                                    VALUES ( ${ id_acceso }, ${ id_socio }, 
                                                                ${ tipo_usuario }, ${ nombre_usuario }, ${ contraseña } );`;
    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            usuario_creado : {
                id_acceso,
                id_socio,
                tipo_usuario,
                nombre_usuario,
                contraseña
            }
        }

    );

}

const borrar_usuario = async ( req = request, res = response ) => {

}




const actualizar_usuario = async ( req = request, res = response ) => {


}





const obtener_usuarios = async ( req = request, res = response ) => {

    //const { descripcion_rol } = req.body;

    const usuarios = await prisma.$queryRaw`SELECT CAST ( id_usuario AS INTEGER ) AS id_usuario, 
                                                    CAST ( id_acceso AS INTEGER ) AS id_acceso, 
                                                    CAST ( id_socio AS INTEGER ) AS id_socio, tipo_usuario, nombre_usuario, contrasea
                                                FROM public.Usuario;`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Usuarios del sistema',
            usuarios
        }

    );

}



const obtener_usuario = async ( req = request, res = response ) => {

    const { id_usuario } = req.params;

    const usuario = await prisma.$queryRaw`SELECT id_usuario, id_acceso, id_socio, tipo_usuario, nombre_usuario, contraseña
                                                FROM public.Usuario
                                            WHERE id_usuario = ${ id_usuario };`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Usuarios del sistema',
            usuario
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