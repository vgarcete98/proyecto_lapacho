const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const obtener_accesos = async ( req = request, res = response ) => {

    try {
        const accesos = await prisma.$queryRaw`select CAST ( id_acceso AS INTEGER ) AS id_acceso, 
                                                        CAST ( id_rol_usuario AS INTEGER ) AS id_rol_usuario , 
                                                    descripcion_acceso
                                                from accesos_usuario;`;

        res.status( 200 ).json(
            {
                status : 'OK',
                msj : 'Accesos para usuarios',
                accesos

            }
        );      
    } catch (error) {
        console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : 'No se pudo obtener la lista de roles',
            error
        } );
        
    }


}




const crear_accesos = async ( req = request, res = response ) => {

    const { idRolUsuario, descripcionAcceso } = req.body;

    try {
        const nuevo_acceso = await prisma.$executeRaw`INSERT INTO public.accesos_usuario(
            id_rol_usuario, descripcion_acceso)
            VALUES ( ${ idRolUsuario }, ${ descripcionAcceso } );`

        res.status( 200 ).json({
            status : 'OK',
            msj : 'Acceso Creado',
            descripcionAcceso

        });
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se ha podido crear el acceso con exito',
            error
        } )
    }


}

const obtener_accesos_usuarios= async ( req = request, res = response ) => {

    //const { descripcion_rol } = req.body;

    // OBTENGO LOS ACCESOS QUE POSEEN CADA UNO DE LOS USUARIOS DE LA APLICACION
    try {
        const usuarios_acceso = await prisma.$queryRaw`SELECT CAST ( A.ID_USUARIO AS INTEGER ) AS idUsuario, 
                                                                CAST ( A.ID_SOCIO AS INTEGER ) AS idSocio, 
                                                                A.TIPO_USUARIO AS tipoUsuario, A.NOMBRE_USUARIO AS nombreUsuario,
                                                                CAST ( B.ID_ACCESO AS INTEGER ) AS idAcceso, 
                                                                B.DESCRIPCION_ACCESO AS descripcionAcceso
                                                        FROM USUARIO A JOIN ACCESOS_USUARIO B
                                                            ON A.ID_ACCESO = B.ID_ACCESO;`;
        if ( usuarios_acceso.length === 0 ) {

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'No existen Accesos de usuario para mostrar ',
                    usuariosAcceso : usuarios_acceso
                }

            );
        } else {

            const usuariosAcceso = usuarios_acceso.map( ( element ) => {
                
                const { idusuario, idsocio, tipousuario, nombreusuario, idacceso, descripcionacceso } = element;
                return {
                    idUsuario : idusuario,
                    idSocio : idsocio,
                    tipoUsuario : tipousuario,
                    nombreUsuario : nombreusuario,
                    idAcceso : idacceso,
                    descripcionAcceso : descripcionacceso
                }

            });

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Accesos de usuario',
                    usuariosAcceso
                }

            );      
        }
      
    } catch (error) {

        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al consultar los accesos de usuario',
            error
        } );
    }


}



const obtener_acceso_usuario= async ( req = request, res = response ) => {

    const { id_usuario } = req.params;

    // OBTENGO LOS ACCESOS QUE POSEEN CADA UNO DE LOS USUARIOS DE LA APLICACION
    try {
        const usuario_acceso = await prisma.$queryRaw`SELECT CAST ( A.ID_USUARIO AS INTEGER ) AS idUsuario, 
                                                                CAST ( A.ID_SOCIO AS INTEGER ) AS idSocio, 
                                                                A.TIPO_USUARIO AS tipoUsuario, A.NOMBRE_USUARIO AS nombreUsuario,
                                                                CAST ( B.ID_ACCESO AS INTEGER ) AS idAcceso, 
                                                                B.DESCRIPCION_ACCESO AS descripcionAcceso
                                                        FROM USUARIO A JOIN ACCESOS_USUARIO B ON A.ID_ACCESO = B.ID_ACCESO
                                                        WHERE A.ID_USUARIO = ${ Number(id_usuario) };`;
        if ( usuario_acceso.length === 0 ) {

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'No existen Accesos de usuario para mostrar ',
                    usuariosAcceso : usuarios_acceso
                }

            );
        } else {

            
            const usuarioAcceso = usuario_acceso.map( ( element ) => {
                
                const { idusuario, idsocio, tipousuario, nombreusuario, idacceso, descripcionacceso } = element;
                return {
                    idUsuario : idusuario,
                    idSocio : idsocio,
                    tipoUsuario : tipousuario,
                    nombreUsuario : nombreusuario,
                    idAcceso : idacceso,
                    descripcionAcceso : descripcionacceso
                }

            });
            const [ primer_resultado, ...resto  ] = usuarioAcceso;
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Accesos de usuario',
                    usuarioAcceso : primer_resultado
                }

            );      
        }
      
    } catch (error) {
        
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al consultar los accesos de usuario',
            error
        } );
    }


}




module.exports = {

    obtener_accesos,
    crear_accesos,
    obtener_accesos_usuarios,
    obtener_acceso_usuario

}