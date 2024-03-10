const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const crear_rol = async ( req = request, res = response ) => {

    const { descripcionRol } = req.body;

    try {
        const rol_nuevo = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
                                                        descripcion_rol )
                                                    VALUES ( ${ descripcionRol });`;

        res.status( 200 ).json(

            {
                status : true,
                msj : 'Rol Creado',
                rol_nuevo : descripcionRol
            }

        );    
    } catch (error) {
        console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : 'No se pudo crear el Rol',
                //rol_nuevo : descripcionRol
            }

        );    
        
    }


}


const actualizar_rol = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { descripcionRol } = req.body;
    try {
        const rol_editado = await prisma.$executeRaw`UPDATE public.roles_usuario
                                                        SET descripcion_rol= ${ descripcionRol }
                                                    WHERE id_rol_usuario = ${id}`;

        res.status( 200 ).json(

            {
                status : true,
                msj : 'Rol Editado',
                rol_editado
            }

        );    
    } catch (error) {
        console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : 'No se pudo actualizar el Rol',
                //rol_nuevo : descripcionRol
            }

        );    
        
    }





}


const borrar_rol = async ( req = request, res = response ) => {


    const { id } = req.params;
    //const { descripcion_rol } = req.body;
    try {

        const rol = await prisma.roles_usuario.findFirst( { where : { id_rol_usuario : id } } );
        const rol_borrado = await prisma.$executeRaw`UPDATE public.roles_usuario
                                                        SET activacion_rol= false
                                                    WHERE id_rol_usuario = ${id}`;

        res.status( 200 ).json(

            {
                status : true,
                msj : 'Rol Borrado',
                rol_borrado
            }

        ); 
    } catch (error) {
        console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : 'No se pudo borrar el Rol',
                //rol_nuevo : descripcionRol
            }

        );    
        
    }


}


const obtener_roles = async ( req = request, res = response ) => {

    const roles_usuario = await prisma.$queryRaw`select CAST ( id_rol_usuario AS INTEGER ) AS id_rol_usuario, descripcion_rol
                                                    from roles_usuario;`;

    res.status( 200 ).json(

        {
            status : true,
            msj : 'Roles del sistema',
            roles_usuario
        }

    );

}



const obtener_modulos_x_rol = async ( req = request, res = response ) => {

    const modulos_x_rol = await prisma.$queryRaw`SELECT A.ID_ROL_USUARIO, A.DESCRIPCION_ROL, STRING_AGG(CONCAT(C.DESCRIPCION_MODULO, ':'),CONCAT(C.ID_MODULO,';')), STRING_AGG( D.descripcion_accion, ', ' )
                                                    FROM ROLES_USUARIO A JOIN MODULOS_HABILITADOS_ROL B ON A.id_rol_usuario = B.id_rol_usuario_habilitado_acciones
                                                    JOIN MODULOS C ON C.id_modulo = B.id_modulo
                                                    JOIN ACCIONES D ON C.id_modulo = D.id_modulo_accion
                                                GROUP BY A.ID_ROL_USUARIO, A.DESCRIPCION_ROL`;




    res.status( 200 ).json(

        {
            status : true,
            msj : 'Roles del sistema',
            roles_usuario
        }

    );

}

module.exports = {  
    actualizar_rol, 
    borrar_rol, 
    crear_rol, 
    obtener_roles,
    //obtener_modulos_x_rol
};
