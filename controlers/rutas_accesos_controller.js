const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const obtener_rutas_aplicacion = async ( req = request, res = response )=>{


    try {

        const rutas_aplicacion_y_tipos = await prisma.rutas_app.findMany( );
                                                                
        const rutasAplicacion = [];
        
        if ( rutas_aplicacion_y_tipos.length > 0 ){

            rutas_aplicacion_y_tipos.forEach( ( value ) =>{

                const { id_ruta_app, path_ruta, id_tipo_ruta_app } = value;
                rutasAplicacion.push( { 
                    idRutaApp : id_ruta_app,
                    pathRuta : path_ruta

                } );

            } );

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Rutas de la aplicacion',
                    rutas : rutasAplicacion
                }

            );  


        }else {


            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se encontraron rutas',
                    //rutas : rutas_aplicacion_y_tipos
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
        //console.log ( id_usuario );
        let rutas_de_usuario = [];
        rutas_de_usuario = await prisma.$queryRaw`SELECT A.ID_SOCIO, A.NOMBRE_USUARIO, B.ID_ACCESO AS ACCESO, B.DESCRIPCION_ACCESO,
                                                    		C.ID_ROL_USUARIO, C.DESCRIPCION_ROL, D.ID_RUTA_HABILITADA, D.ID_RUTA_APP, F.PATH_RUTA
                                                    	FROM SOCIO A 
                                                    	JOIN ACCESOS_USUARIO B ON A.id_acceso_socio = B.id_acceso
                                                    	JOIN ROLES_USUARIO C ON B.id_rol_usuario = C.id_rol_usuario
                                                    	JOIN RUTAS_HABILITADAS_ROL D ON D.id_rol_usuario = C.id_rol_usuario
                                                    	JOIN RUTAS_APP F ON F.id_ruta_app = D.id_ruta_app
                                                    WHERE A.ID_SOCIO =  ${ Number(id_usuario) }`;
        //console.log( rutas_de_usuario )
        if ( rutas_de_usuario.length > 0 ){


            const rutas = rutas_de_usuario.map( ( value )=>{

                const { id_socio, nombre_usuario, acceso, descripcion_acceso,
                        id_rol_usuario, descripcion_rol, id_ruta_habilitada, id_ruta_app, path_ruta } = value;
                
                return {
                    idSocio : typeof(id_socio) === 'bigint' ? Number( String( id_socio ) ): id_socio , 
                    nombreUsuario : nombre_usuario, 
                    acceso : typeof(acceso) === 'bigint' ? Number( String( acceso ) ): acceso, 
                    descripcionAcceso : descripcion_acceso,
                    idRolUsuario : typeof(id_rol_usuario) === 'bigint' ? Number( String( id_rol_usuario ) ): id_rol_usuario, 
                    descripcionRol : descripcion_rol,
                    idRutaHabilitada : id_ruta_habilitada, 
                    idRutaApp : id_ruta_app, 
                    pathRuta : path_ruta 
                }
            } );
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Rutas de Usuario',
                    rutas
                }

            );  


        }else {


            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se encontraron rutas',
                    //rutas : rutas_aplicacion_y_tipos
                }

            );  

        }
    } catch (error) {
        console.log( error );
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

        const { id_usuario } = req.params;
        const { idRutaQuitar } = req.body;

        const socio = await prisma.socio.findUnique( { where : { id_socio : Number( id_usuario ) } } );

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

        const { id_usuario } = req.params;  
        //console.log ( id_usuario );
        let rutas_faltantes = [];
        rutas_faltantes = await prisma.$queryRaw`SELECT ID_RUTA_APP, PATH_RUTA
                                                        FROM RUTAS_APP 
                                                    WHERE ID_RUTA_APP NOT IN ( SELECT D.ID_RUTA_APP
                                                                                   FROM SOCIO A 
                                                                                   JOIN ACCESOS_USUARIO B ON A.id_acceso_socio = B.id_acceso
                                                                                   JOIN ROLES_USUARIO C ON B.id_rol_usuario = C.id_rol_usuario
                                                                                   JOIN RUTAS_HABILITADAS_ROL D ON D.id_rol_usuario = C.id_rol_usuario
                                                                                   JOIN RUTAS_APP F ON F.id_ruta_app = D.id_ruta_app
                                                                               WHERE A.ID_SOCIO =  ${ Number(id_usuario) } )`;
        //console.log( rutas_de_usuario )
        if ( rutas_faltantes.length > 0 ){


            const rutas = rutas_faltantes.map( ( value )=>{

                const { id_ruta_app, path_ruta } = value;
                
                return {
                    idRutaApp : id_ruta_app, 
                    pathRuta : path_ruta 
                }
            } );
            res.status( 200 ).json(
                {
                    status : true,
                    msj : 'Rutas de Usuario Faltantes',
                    rutas
                }
            );  


        }else {
            res.status( 200 ).json(
                {
                    status : false,
                    msj : 'No le faltan permisos a ese usuario',
                    //rutas : rutas_aplicacion_y_tipos
                }
            );  
        }

    } catch (error) {
        console.log( error )
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