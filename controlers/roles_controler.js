const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const crear_rol = async ( req = request, res = response ) => {

    const { descripcionRol } = req.body;

    const rol_nuevo = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
                                                    descripcion_rol )
                                                VALUES ( ${ descripcionRol });`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Creado',
            rol_nuevo : descripcion_rol
        }

    );

}


const actualizar_rol = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { descripcionRol } = req.body;

    const rol_editado = await prisma.$executeRaw`UPDATE public.roles_usuario
                                                    SET descripcion_rol= ${ descripcionRol }
                                                WHERE id_rol_usuario = ${id}`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Editado',
            rol_editado
        }

    );


}


const borrar_rol = async ( req = request, res = response ) => {


    const { id } = req.params;
    //const { descripcion_rol } = req.body;

    const rol_borrado = await prisma.$executeRaw`UPDATE public.roles_usuario
                                                    SET activacion_rol= false
                                                WHERE id_rol_usuario = ${id}`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Rol Borrado',
            rol_borrado
        }

    );

}


const obtener_roles = async ( req = request, res = response ) => {

    const roles_usuario = await prisma.$queryRaw`select CAST ( id_rol_usuario AS INTEGER ) AS id_rol_usuario, descripcion_rol
                                                    from roles_usuario;`;

    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Roles del sistema',
            roles_usuario
        }

    );

}


module.exports = {  actualizar_rol, 
    borrar_rol, 
    crear_rol, 
    obtener_roles
};
