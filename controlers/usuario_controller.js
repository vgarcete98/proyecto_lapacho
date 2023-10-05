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
    
    let idUsuarioConvertido = 1;
    if ( typeof( id_usuario ) !== Number ){ idUsuarioConvertido = id_usuario };

    const fecha_edicion_usuario = new Date();

    try {
        const usuario_borrado = await prisma.usuario.update( { 
                                                                where :{ id_usuario : idUsuarioConvertido },
                                                                data : {
                                                                    estado_usuario : estados_usuario.eliminado.id_estado,
                                                                    usuarioeditadoen : fecha_edicion_usuario
                                                                } 
                                                            } );
        const { nombre_usuario, id_usuario, estado_usuario, tipo_usuario, usuariocreadoen, usuarioeditadoen } = usuario_borrado;

        res.status( 200 ).json( { 
            status : true,
            msg : 'Usuario eliminado con exito',
            usuario : {
                nombreUsuario : nombre_usuario, 
                //idUsuario : id_usuario, 
                estadoUsuario : estado_usuario,
                tipoUsuario : tipo_usuario,
                usuarioCreadoEn : usuariocreadoen,
                usuarioEditadoEn : usuarioeditadoen
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
    const idUsuarioEditar = Number(id_usuario);
    const { nombreUsuario, contraseñaNueva, estadoUsuario } = req.body;

    const fecha_edicion_usuario = new Date();

    try {

        //const usuario_viejo = await prisma.usuario.findFirst( { where :{ id_usuario : idUsuarioEditar } } );

        //const { nombre_usuario, id_usuario, estado_usuario, tipo_usuario, usuariocreadoen,usuarioeditadoen,   } = usuario_viejo

        const usuario_actualizado = await prisma.usuario.update( { 
                                                                    where :{ id_usuario : idUsuarioEditar },
                                                                    data : {
                                                                        estado_usuario : estadoUsuario,
                                                                        usuarioeditadoen : fecha_edicion_usuario,
                                                                        nombre_usuario : nombreUsuario,
                                                                        contrasea : contraseñaNueva
                                                                    } 
                                                                } );
        const { nombre_usuario, id_usuario, estado_usuario, tipo_usuario, usuariocreadoen,usuarioeditadoen,  } = usuario_actualizado;

        res.status( 200 ).json( { 
            status : true,
            msg : 'Usuario actualizado con exito',
            //usuarioViejo,
            usuario : {
                nombreUsuario : nombre_usuario, 
                //idUsuario : id_usuario, 
                estadoUsuario : estado_usuario,
                tipoUsuario : tipo_usuario,
                creadoEn : usuariocreadoen,
                editadoEn : usuarioeditadoen

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
        const usuarios = await prisma.$queryRaw`SELECT CAST ( id_usuario AS INTEGER ) AS idUsuario, 
                                                        CAST ( id_acceso AS INTEGER ) AS idAcceso, 
                                                        CAST ( id_socio AS INTEGER ) AS id_socio, 
                                                        tipo_usuario AS tipoUsuario, 
                                                        nombre_usuario AS nombreUsuario, 
                                                        contrasea as contrasennia
                                                    FROM public.Usuario;`;
        const usuariosSistema = usuarios.map( ( element ) =>{
            
            const { idusuario, idacceso, id_socio, tipousuario, nombreusuario, contrasennia } = element;
            return {
                idUsuario : idusuario,  
                idAcceso : idacceso, 
                idSocio : id_socio, 
                tipoUsuario : tipousuario, 
                nombreUsuario : nombreusuario, 
                contraseña : contrasennia
            }

        });
        res.status( 200 ).json(

            {
                status : true,
                msj : 'Usuarios del sistema',
                usuariosSistema
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
        const usuario = await prisma.$queryRaw`SELECT CAST( A.ID_USUARIO AS INTEGER ) AS idUsuario, 
                                                        CAST ( A.ID_ACCESO AS INTEGER ) AS idAcceso, 
                                                        B.DESCRIPCION_ACCESO AS descripcionAcceso,
                                                        CAST ( A.ID_SOCIO AS INTEGER ) AS idSocio,
                                                        A.TIPO_USUARIO AS tipoUsuario, 
                                                        A.NOMBRE_USUARIO AS nombreUsuario , 
                                                        A.CONTRASEA AS contrasennia
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




module.exports = {

    actualizar_usuario,
    borrar_usuario,
    crear_usuario,
    obtener_usuario,
    obtener_usuarios
};