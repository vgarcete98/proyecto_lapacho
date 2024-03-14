const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


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
        const { id_usuario } = req.params;  

        const socio = await prisma.socio.findUnique( { where : { id_socio : Number(id_usuario) } } );

        const { id_acceso } = socio;

        const acceso_socio = await prisma.accesos_usuario.findUnique({ where : { id_acceso : Number(id_acceso) } } ) 


        const { id_rol_usuario } = acceso_socio;

        
        const rutas_de_usuario = await prisma.$queryRaw`SELECT A.ID_ACCESO, A.DESCRIPCION, B.ID_ROL_USUARIO
                                                            B.DESCRIPCION_ROL, C.ID_RUTA_HABILITADA, D.PATH_RUTA
                                                        FROM ACCESOS_USUARIO A
                                                        JOIN ROLES_USUARIO B ON A.ID_ROL_USUARIO = B.ID_ROL_USUARIO
                                                        JOIN RUTAS_HABILITADAS_ROL C ON B.ID_ROL_USUARIO = C.ID_ROL_USUARIO
                                                        JOIN RUTAS_APP D ON D.ID_RUTA_APP = C.ID_RUTA_APP
                                                        WHERE B.ID_ROL_USUARIO = ${ id_rol_usuario }`
        
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
                                                                        } );

        const { id_ruta_app, id_ruta_habilitada } = nuevo_permiso;

        res.status( 200 ).json(

            {
                status : true,
                msj : 'Permiso Agregado a usuario',
                permiso : {
                    idRutaApp : id_ruta_app,
                    idRutaHabilitada : id_ruta_habilitada,
                    idRutaHabilitada : id_ruta_habilitada
                }
            }

        );                                                     
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al agregar el permiso al usuario',
            //error
        } );
    }





}




const quitar_permiso_a_usuario = async ( req = request, res = response )=>{


    try {


        const { idSocio, idRutaQuitar } = req.body;

        const socio = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );

        const { id_acceso } = socio;

        const acceso = prisma.accesos_usuario.findUnique( { where : { id_acceso : Number( id_acceso ) } } );

        const { id_rol_usuario } = acceso;

        const idRolUsuario = id_rol_usuario;
        const permiso_borrado = await prisma.rutas_habilitadas_rol.delete( { 
                                                                            where : {
                                                                                AND : [ 
                                                                                    { id_rol_usuario : Number( idRolUsuario ) }, 
                                                                                    { id_ruta_app : Number( idRutaQuitar ) }
                                                                                ]
                                                                            }
                                                                        } );
        const { id_ruta_app, id_ruta_habilitada } = permiso_borrado;

        res.status( 200 ).json(

            {
                status : true,
                msj : 'Permiso Borrado a usuario',
                permiso : {
                    idRutaApp : id_ruta_app,
                    idRutaBorrada : id_ruta_habilitada,
                    idRutaHabilitada : id_ruta_habilitada
                }
            }

        );  
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al agregar el permiso al usuario',
            //error
        } );
    }





}



const obtener_rutas_de_usuario_faltantes = async ( req = request, res = response )=>{

    try {
        const { id_usuario } = req.body;  

        const socio = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );

        const { id_acceso } = socio;

        const acceso = prisma.accesos_usuario.findUnique( { where : { id_acceso : Number( id_acceso ) } } );

        const { id_rol_usuario } = acceso;

        const idRolUsuario = id_rol_usuario;
        
        const rutas_de_usuario_faltantes = await prisma.$queryRaw`SELECT * FROM RUTAS_APP A 
                                                                    WHERE A.id_ruta_app NOT IN ( SELECT C.ID_RUTA_HABILITADA
                                                                                            FROM ACCESOS_USUARIO A
                                                                                            JOIN ROLES_USUARIO B ON A.ID_ROL_USUARIO = B.ID_ROL_USUARIO
                                                                                            JOIN RUTAS_HABILITADAS_ROL C ON B.ID_ROL_USUARIO = C.ID_ROL_USUARIO
                                                                                            JOIN RUTAS_APP D ON D.ID_RUTA_APP = C.ID_RUTA_APP
                                                                                        WHERE B.id_rol_usuario = ${idRolUsuario})`;
        
        if ( rutas_de_usuario_faltantes.length > 0 ){

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Rutas de aplicacion',
                    rutas_de_usuario_faltantes
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




module.exports = { agregar_permiso_a_usuario, 
                    obtener_rutas_aplicacion, 
                    obtener_rutas_de_usuario, 
                    quitar_permiso_a_usuario,
                    obtener_rutas_de_usuario_faltantes }