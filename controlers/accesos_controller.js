const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const obtener_accesos = async ( req = request, res = response ) => {

    try {
        const accesos_para_usuarios = await prisma.$queryRaw`select CAST ( id_acceso AS INTEGER ) AS id_acceso, 
                                                        CAST ( id_rol_usuario AS INTEGER ) AS id_rol_usuario , 
                                                    descripcion_acceso
                                                from accesos_usuario;`;

        const accesos = accesos_para_usuarios.map( ( element )=>{
            const { id_acceso, descripcion_acceso } = element;
            return {
                idAcceso : id_acceso,
                descripcionAcceso : descripcion_acceso
            }
        } )
        res.status( 200 ).json(
            {
                status : true,
                msj : 'Accesos para usuarios',
                accesos

            }
        );      
    } catch (error) {
        console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : 'No se pudo obtener la lista de roles',
            //error
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
            status : true,
            msj : 'Acceso Creado',
            descripcionAcceso

        });
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se ha podido crear el acceso con exito',
            //error
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
            //error
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
            //error
        } );
    }


}




const obtener_rutas_aplicacion = async ( req = request, res = response )=>{


    try {

        const rutas_aplicacion_y_tipos = await prisma.rutas_app.findMany( );
                                                                
        if ( rutas_aplicacion_y_tipos.length > 0 ){

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Rutas de la aplicacion',
                    rutas : rutas_aplicacion_y_tipos
                }

            );  


        }else {


            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se encontraron rutas',
                    rutas : rutas_aplicacion_y_tipos
                }

            );  

        }




    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al consultar las rutas de la aplicacion',
            //error
        } );
    }





}



const obtener_rutas_de_usuario = async ( req = request, res = response )=>{

    try {
        const { id_usuario } = req.body;  
        
        const rutas_de_usuario = await prisma.$queryRaw`SELECT A.ID_ACCESO, A.DESCRIPCION, B.ID_ROL_USUARIO
                                                            B.DESCRIPCION_ROL, C.ID_RUTA_HABILITADA, D.PATH_RUTA
                                                        FROM ACCESOS_USUARIO A
                                                        JOIN ROLES_USUARIO B ON A.ID_ROL_USUARIO = B.ID_ROL_USUARIO
                                                        JOIN RUTAS_HABILITADAS_ROL C ON B.ID_ROL_USUARIO = C.ID_ROL_USUARIO
                                                        JOIN RUTAS_APP D ON D.ID_RUTA_APP = C.ID_RUTA_APP`
        
        if ( rutas_aplicacion_y_tipos.length > 0 ){

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Rutas de aplicacion',
                    rutas : rutas_de_usuario
                }

            );  


        }else {


            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se encontraron rutas',
                    rutas : rutas_aplicacion_y_tipos
                }

            );  

        }
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al consultar las rutas habilitadas de usuario',
            //error
        } );
    }






}



const agregar_permiso_a_usuario = async ( req = request, res = response )=>{


    try {


        const { id_socio, id_ruta_habilitar } = req.body;

        const socio = await prisma.socio.findUnique( { where : { id_socio : Number( id_socio ) } } );

        const { id_acceso } = socio;

        const acceso = prisma.accesos_usuario.findUnique( { where : { id_acceso : Number( id_acceso ) } } );

        const { id_rol_usuario } = acceso;

        const id_rol_usuario_habilitar = id_rol_usuario;
        const nuevo_permiso = await prisma.rutas_habilitadas_rol.create( { 
                                                                            data : {
                                                                                id_rol_usuario : Number( id_rol_usuario_habilitar ),
                                                                                id_ruta_app : id_ruta_habilitar,
                                                                            }
                                                                        } )

        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al agregar el permiso al usuario',
            //error
        } );
    }





}




module.exports = {

    obtener_accesos,
    crear_accesos,
    obtener_accesos_usuarios,
    obtener_acceso_usuario,
    obtener_rutas_aplicacion,
    obtener_rutas_de_usuario,
    agregar_permiso_a_usuario

}