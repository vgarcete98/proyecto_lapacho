const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const estados_usuario = {

    activo : { descripcion :'ACTIVO', id_estado : 1 },
    suspendido : { descripcion :'SUSPENDIDO', id_estado : 2 },
    eliminado : { descripcion :'ELIMINADO', id_estado : 3 }

}


const crear_usuario = async ( req = request, res = response ) => {

    const { idAcceso, idSocio, tipoUsuario, nombreUsuario, contraseña } = req.body;

    try {
        //----------------------------------------------------------------------------------------------------------------------
        /*const nuevo_usuario = await prisma.$executeRaw`INSERT INTO public.usuario(
                                                        id_acceso, id_socio, tipo_usuario, nombre_usuario, contrasea)
                                                        VALUES ( ${ idAcceso }, ${ idSocio }, 
                                                                    ${ tipoUsuario }, ${ nombreUsuario }, ${ contraseña } );`;*/
        //----------------------------------------------------------------------------------------------------------------------
        const nuevo_usuario = await prisma.usuario.create( { 
                                                                data : {
                                                                    id_acceso : idAcceso,
                                                                    id_socio : idSocio,
                                                                    tipo_usuario : tipoUsuario,
                                                                    nombre_usuario : nombreUsuario,
                                                                    contrasea : contraseña
                                                                } 
                                                        } );
        const { id_acceso, id_socio, tipo_usuario, nombre_usuario, contraseña } = nuevo_usuario;

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
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo crear al usuario',
            error
        } );
    }


}

const borrar_usuario = async ( req = request, res = response ) => {

    const { id_usuario } = req.params;

    const fecha_edicion_usuario = new Date();

    try {
        const usuario_borrado = await prisma.usuario.update( { 
                                                                where :{ id_usuario },
                                                                data : {
                                                                    estado_usuario : estados_usuario.eliminado.id_estado,
                                                                    usuarioeditadoen : fecha_edicion_usuario
                                                                } 
                                                            } );
        const { nombre_usuario, id_usuario, estado_usuario, tipo_usuario } = usuario_borrado;

        res.status( 200 ).json( { 
            status : true,
            msg : 'Usuario eliminado con exito',
            usuario : {
                nombre_usuario, 
                id_usuario, 
                estado_usuario,
                tipo_usuario
            }
        } );
    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            status : false,
            msg : 'No se pudo borrar al usuario',
            error
        });
    }
}




const actualizar_usuario = async ( req = request, res = response ) => {

    const { id_usuario } = req.params;

    const { nombreUsuario, contraseñaNueva, estadoUsuario } = req.body;

    const fecha_edicion_usuario = new Date();

    try {
        const usuario_actualizado = await prisma.usuario.update( { 
                                                                where :{ id_usuario },
                                                                data : {
                                                                    estado_usuario : estadoUsuario,
                                                                    usuarioeditadoen : fecha_edicion_usuario,
                                                                    nombre_usuario : nombreUsuario,
                                                                    contrasea : contraseñaNueva
                                                                } 
                                                            } );
        const { nombre_usuario, id_usuario, estado_usuario, tipo_usuario } = usuario_actualizado;

        res.status( 200 ).json( { 
            status : true,
            msg : 'Usuario actualizado con exito',
            usuario : {
                nombre_usuario, 
                id_usuario, 
                estado_usuario,
                tipo_usuario
            }
        } );
    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            status : false,
            msg : 'No se pudo actualizar al usuario',
            error
        });
    }

}





const obtener_usuarios = async ( req = request, res = response ) => {

    //const { descripcion_rol } = req.body;

    // OBTENGO TODOS LOS USUARIOS SIN IMPORTAR SU ESTADO

    try {
        const usuarios = await prisma.$queryRaw`SELECT CAST ( id_usuario AS INTEGER ) AS id_usuario, 
                                                        CAST ( id_acceso AS INTEGER ) AS id_acceso, 
                                                        CAST ( id_socio AS INTEGER ) AS id_socio, tipo_usuario, nombre_usuario, contrasea
                                                    FROM public.Usuario;`;

        res.status( 200 ).json(

            {
                status : true,
                msj : 'Usuarios del sistema',
                usuarios
            }

        );        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener los usuarios del sistema'
        } );
    }


}



const obtener_usuario = async ( req = request, res = response ) => {

    const { id_usuario } = req.params;
    try {
        const usuario = await prisma.$queryRaw`SELECT CAST( A.ID_USUARIO AS INTEGER ) AS ID_USUARIO, 
                                                        CAST ( A.ID_ACCESO AS INTEGER ) AS ID_ACCESO, B.DESCRIPCION_ACCESO,
                                                        CAST ( A.ID_SOCIO AS INTEGER ) AS ID_SOCIO,
                                                        A.TIPO_USUARIO, A.NOMBRE_USUARIO, A.CONTRASEA
                                                    FROM USUARIO A JOIN ACCESOS_USUARIO B ON A.ID_ACCESO = B.ID_ACCESO
                                                WHERE ID_USUARIO = ${ Number(id_usuario) };`;

        res.status( 200 ).json(

            {
                status : true,
                msj : 'Usuario del sistema',
                usuario
            }

        );        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo encontrar al usuario',
            error
        } )
    }



}


const obtener_accesos_usuario = async ( req = request, res = response ) => {

    //const { descripcion_rol } = req.body;

    try {
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
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false
        } );
    }


}



module.exports = {

    actualizar_usuario,
    borrar_usuario,
    crear_usuario,
    obtener_accesos_usuario,
    obtener_usuario,
    obtener_usuarios
};