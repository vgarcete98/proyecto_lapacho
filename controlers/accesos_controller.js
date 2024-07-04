const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const obtener_accesos = async ( req = request, res = response ) => {

    try {
        //OBTIENE TODOS LOS ACCESOS CON SUS ACCIONES CORRESPONDIENTES

        const { accion } = req.query;

        let accesosDisponibles = await prisma.$queryRaw`SELECT C.ID_RUTA_APP AS "idRutaApp", 
                                                C.PATH_RUTA AS "pathRuta", 
                                                C.accion
                                        	FROM rutas_app C
                                            ${ ( accion === undefined ) ? `` : `WHERE C.accion LIKE '%${ accion }%'` } 
                                        ORDER BY C.ID_RUTA_APP`;
        res.status( 200 ).json(
            {
                status : true,
                msj : 'Accesos para usuarios',
                accesosDisponibles
            }
        );      
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo obtener la lista de roles : ${error}`,
            //error
        } );
        
    }


}

const obtener_accesos_rol = async ( req = request, res = response ) => {

    try {
        //OBTIENE LOS ACCESOS ASIGNADOS A ESE ROL Y LOS QUE NO
        let accesos = [];
        const { rol } = req.query;
        const query = `SELECT
                            '[' || STRING_AGG(
                                json_build_object(
                                    'idRutaApp', C.ID_RUTA_APP,
                                    'pathRuta', C.PATH_RUTA,
                                    'accion', C.accion,
                                    'idAcceso', COALESCE(verifica_acceso_rol(C.ID_RUTA_APP, '${rol}'), 0),
                                    'tienePermiso',
                                        CASE 
                                            WHEN C.ID_RUTA_APP IN (
                                                SELECT C.ID_RUTA_APP
                                                FROM ACCESOS_USUARIO A 
                                                JOIN roles_usuario B ON B.id_rol_usuario = A.id_rol_usuario
                                                JOIN rutas_app C ON C.id_ruta_app = A.id_ruta_app
                                                WHERE B.descripcion_rol = '${rol}'
                                            ) 
                                            THEN 'ASIGNADO' 
                                            ELSE 'NO_ASIGNADO' 
                                        END
                                )::TEXT, 
                                ','
                            ) || ']' AS "accesosDisponibles"
                        FROM 
                            rutas_app C ;`
        accesos = await prisma.$queryRawUnsafe( query );
        accesos.forEach((element) => {
            element.accesosDisponibles = JSON.parse( element.accesosDisponibles );
        });
        res.status( 200 ).json(
            {
                status : true,
                msj : 'Accesos para usuarios',
                accesos
            }
        );      
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo obtener la lista de roles : ${error}`,
            //error
        } );
        
    }


}




const editar_modulos = async ( req = request, res = response ) => {

    try {

        const { nombreModulo, idModulo } = req.body;
        const { id_modulo, nombre_modulo } = await prisma.modulos.update( 
                                                                            { 
                                                                                data : { nombre_modulo : nombreModulo },
                                                                                where : { id_modulo : Number( idModulo ) } 
                                                                            }
                                                                             
                                                                        );
        res.status( 200 ).json({
            status : true,
            msj : 'Modulo Editado con exito',
            modulo : {
                idModulo : id_modulo, 
                nombreModulo : nombre_modulo
            }

        });

        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido editar el modulo con exito : ${ error }`,
            //error
        } )
    }


}


const eliminar_modulos = async ( req = request, res = response ) => {

    try {

        const { nombreModulo, idModulo } = req.body;
        const { id_modulo, nombre_modulo } = await prisma.modulos.delete( 
                                                                            { 
                                                                                //data : { nombre_modulo : nombreModulo },
                                                                                where : { id_modulo : Number( idModulo ) } 
                                                                            }
                                                                             
                                                                        );
        res.status( 200 ).json({
            status : true,
            msj : 'Modulo Eliminado con exito',
            modulo : {
                idModulo : id_modulo, 
                nombreModulo : nombre_modulo
            }

        });

        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido eliminar el modulo con exito : ${ error }`,
            //error
        } )
    }


}





const obtener_modulos = async ( req = request, res = response ) => {

    try {
        let modulos, modulos_sistema = [];
        modulos_sistema = await prisma.modulos.findMany();
        modulos = modulos_sistema.map( ( element )=>{  
                                            const { id_modulo, nombre_modulo } = element;
                                            return {
                                                idModulo : id_modulo,
                                                nombreModulo : nombre_modulo
                                            }
                                    } );


        res.status( 200 ).json({
            status : true,
            msj : 'Modulos del sistema',
            modulos

        });

        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido obtener los modulos del sistema : ${ error }`,
            //error
        } )
    }


}






const crear_modulos = async ( req = request, res = response ) => {

    try {

        const { nombreModulo } = req.body;
        const { id_modulo, nombre_modulo } = await prisma.modulos.create( { data : { nombre_modulo : nombreModulo } } );
        res.status( 200 ).json({
            status : true,
            msj : 'Acceso Creado',
            modulo : {
                idModulo : id_modulo, 
                nombreModulo : nombre_modulo
            }

        });

        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido crear el modulo con exito : ${ error }`,
            //error
        } )
    }


}


const crear_accesos = async ( req = request, res = response ) => {

    
    try {
        const { idModulo, funcion, pathRuta } = req.body;

        const { id_modulo, id_ruta_app, accion, path_ruta } = await prisma.rutas_app.create( { data : { 
                                                                                                        accion : funcion, 
                                                                                                        id_modulo : idModulo, 
                                                                                                        path_ruta : pathRuta 
                                                                                                    } 
                                                                                            } );

        res.status( 200 ).json({
            status : true,
            msj : 'Acceso Creado',
            acceso : {
                idModulo : id_modulo, 
                idRutaApp : id_ruta_app, 
                funcion : accion, 
                pathRuta : path_ruta
            }

        });
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido crear el acceso con exito : ${ error }`,
            //error
        } )
    }


}


const asignar_accesos = async ( req = request, res = response ) => {

    try {

        const { idRolUsuario, accesos } = req.body;

        let accesosUsuario = [];


        for ( let element in accesos ){
            console.log( element, accesos[element], idRolUsuario );
            const { idRutaApp } = accesos[element];
            //const query_acceso = `INSERT INTO ACCESOS_USUARIO ( ID_ROL_USUARIO, ID_RUTA_APP )
            //                        VALUES ( ${ idRolUsuario }, ${ idRutaApp } )`
            //console.log( query_acceso )
            //const insert = await prisma.$executeRawUnsafe( query_acceso );
            const acceso_creado = await prisma.accesos_usuario.create( { data : { 
                                                                            id_rol_usuario : idRolUsuario, 
                                                                            id_ruta_app : idRutaApp,

    
                                                                        } 
                                                            } );
            const { path_ruta, accion_ruta } = await prisma.rutas_app.findUnique( { where : { id_ruta_app : idRutaApp } } )
            accesosUsuario.push( { 
                //idAcceso : id_acceso,
                //idRolUsuario : idRolUsuario,
                pathRuta : path_ruta, 
                accion : accion_ruta
    
            } );
            
        }

        res.status( 200 ).json({
            status : true,
            msj : 'Accesos Asignados',
            acceso : {
                idRolUsuario : Number( idRolUsuario ), 
                accesosUsuario
            }

        });
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido crear el acceso con exito : ${ error }`,
            //error
        } )
    }
}



const quitar_accesos = async ( req = request, res = response ) => {

    try {
        //QUITA EL ACCESO ASIGNADO A UN ROL
        const { idRolUsuario, idRutaApp, idSocio, idAcceso } = req.body;

        const { id_acceso, id_rol_usuario, id_ruta_app,  } = await prisma.accesos_usuario.delete( { where : { id_acceso : Number( idAcceso ) } } );

        res.status( 200 ).json({
            status : true,
            msj : 'Acceso quitado',
            acceso : {
                idRolUsuario : id_rol_usuario, 
                idRutaApp : id_ruta_app,
                idAcceso : id_acceso
            }

        });

    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido quitar el acceso al rol con exito : ${ error }`,
            //error
        } )
    }
}


const eliminar_accesos = async ( req = request, res = response ) => {
    try {
        //ELIMINA UN ACCESO CREADO
        const { idRutaApp, pathRuta ,idModulo ,nombreModulo } = req.body;

        const { id_modulo, id_ruta_app, accion, path_ruta } = await prisma.rutas_app.delete( { where : { id_ruta_app : idRutaApp } } );

        res.status( 200 ).json({
            status : true,
            msj : 'Acceso Creado',
            acceso : {
                idModulo : id_modulo, 
                idRutaApp : id_ruta_app, 
                funcion : accion, 
                pathRuta : path_ruta
            }

        });

    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido eliminar el acceso con exito : ${ error }`,
            //error
        } )
    }
}


const editar_accesos = async ( req = request, res = response ) => {
    try {
        const { idModulo, funcion, pathRuta, idRutaApp } = req.body;

        const { id_modulo, id_ruta_app, accion, path_ruta } = await prisma.rutas_app.update( { 
                                                                                                data : { 
                                                                                                        accion : funcion, 
                                                                                                        id_modulo : idModulo, 
                                                                                                        path_ruta : pathRuta 
                                                                                                },
                                                                                                where : { id_ruta_app : idRutaApp } 
                                                                                            } );

        res.status( 200 ).json({
            status : true,
            msj : 'Acceso Creado',
            acceso : {
                idModulo : id_modulo, 
                idRutaApp : id_ruta_app, 
                funcion : accion, 
                pathRuta : path_ruta
            }

        });
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `No se ha podido editar el acceso con exito : ${ error }`,
            //error
        } )
    }
}






module.exports = {
//------------------------------------------------
    obtener_accesos,
    crear_accesos,
    eliminar_accesos,
    editar_accesos,
    asignar_accesos,
    quitar_accesos,
    obtener_accesos_rol,
//------------------------------------------------

//------------------------------------------------
    crear_modulos,
    obtener_modulos,
    editar_modulos,
    eliminar_modulos,
//------------------------------------------------

}