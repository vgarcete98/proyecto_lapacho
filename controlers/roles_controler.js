const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();




const crear_rol_con_accesos = async (  req = request, res = response  ) =>{

    try {

        const { descripcionRol, accesos } = req.body;

        let accesosRol = [];

        const { id_rol_usuario, descripcion_rol } = await prisma.roles_usuario.create( { 
                                                        data : { 
                                                                    descripcion_rol : descripcionRol,
                                                                    rol__creado_en : new Date(),
                                                                    estado_rol_usuario : 1

                                                                } 
                                                    } );

        for (const element of accesos) {
            
            const { idPathRuta } = accesos[element];
            const acceso_para_el_rol = await prisma.accesos_usuario.create( { 
                                                                data : { 
                                                                    id_ruta_app : Number( idPathRuta ), 
                                                                    id_rol_usuario :  (  typeof( id_rol_usuario ) === 'bigint') ? Number(id_rol_usuario.toString()) : id_rol_usuario,
                                                                    rol_creado_en : new Date(),
                                                                    id_usuario_crea : 1
    
                                                                } } );
            const { id_ruta_app, accion, path_ruta } = await prisma.rutas_app.findUnique( { where : { id_ruta_app : Number( idPathRuta ) } } );
    
            accesosRol.push( {
    
                idRutaApp : id_ruta_app,
                accion,
                pathRuta : path_ruta
                
            } );
        }


        res.status( 200 ).json(

            {
                status : true,
                msg : 'Rol Creado con accesos',
                rol : {
                    idRolUsuario : (  typeof( id_rol_usuario ) === 'bigint') ? Number(id_rol_usuario.toString()) : id_rol_usuario,
                    descripcionRol,
                    accesosRol
                }
            }

        );   
        
    } catch (error) {
        
        res.status( 500 ).json(
            {
                status : false,
                msg : `No se pudo crear el Rol y sus accesos : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );
    }



}





const crear_rol = async ( req = request, res = response ) => {

    
    try {
        const { descripcionRol, idSocio } = req.body;

        const { descripcion_rol, id_rol_usuario, id_usuario_crea_rol, 
                rol_editado_en, id_usuario_edita_rol, rol__creado_en } = await prisma.roles_usuario.create( { data : { 
                                                                        descripcion_rol : descripcionRol, 
                                                                        rol__creado_en : new Date() ,
                                                                        //id_usuario_crea_rol : Number( idSocio ) 
                                                                    } 
                                                            } );
        

        //                                                descripcion_rol )
        //                                            VALUES ( ${ descripcionRol });`;

        res.status( 200 ).json(

            {
                status : true,
                msg : 'Rol Creado',
                rol : { 
                    descripcionRol : descripcion_rol, 
                    idRolUsuario : id_rol_usuario, 
                    idUsuarioCreaRol : id_usuario_crea_rol, 
                    rolEditadoEn : rol_editado_en, 
                    idUsuarioEditaRol : id_usuario_edita_rol, 
                    rolCreadoEn : rol__creado_en 

                }
            }

        );    
    } catch (error) {
        
        res.status( 500 ).json(

            {
                status : false,
                msg : `No se pudo crear el Rol : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );    
        
    }


}


const actualizar_rol = async ( req = request, res = response ) => {

    try {
        const { descripcionRol, idSocio, idRol } = req.body;
        const { descripcion_rol, id_rol_usuario, id_usuario_crea_rol, 
                rol_editado_en, id_usuario_edita_rol, rol__creado_en } = await prisma.roles_usuario.update( { 
                                                                                                                where : { id_rol_usuario : Number( idRol ) },
                                                                                                                data : { 
                                                                                                                    descripcion_rol : descripcionRol,
                                                                                                                    id_usuario_edita_rol : idSocio
                                                                                                                } 
                                                                                                            } );


        //                                                SET descripcion_rol= ${ descripcionRol }
        //                                            WHERE id_rol_usuario = ${id}`;

        res.status( 200 ).json(

            {
                status : true,
                msg : `Rol Editado`,
                rol : { 
                    descripcionRol : descripcion_rol, 
                    idRolUsuario : ( typeof( id_rol_usuario ) === 'bigint' )? Number( id_rol_usuario.toString() ): id_rol_usuario, 
                    idUsuarioCreaRol : id_usuario_crea_rol, 
                    rolEditadoEn : rol_editado_en, 
                    idUsuarioEditaRol : id_usuario_edita_rol, 
                    rolCreadoEn : rol__creado_en 

                }
            }

        );    
    } catch (error) {
        
        res.status( 500 ).json(

            {
                status : false,
                msg : `No se pudo actualizar el Rol : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );    
        
    }





}


const borrar_rol = async ( req = request, res = response ) => {




    try {
        const { descripcionRol, idSocio, idRol } = req.body;


        //                                                SET activacion_rol= false
        //                                            WHERE id_rol_usuario = ${id}`;

        const { descripcion_rol, id_rol_usuario, id_usuario_crea_rol, 
                rol_editado_en, id_usuario_edita_rol, rol__creado_en } = await prisma.roles_usuario.delete( { where : { id_rol_usuario : Number( idRol ) } })


        res.status( 200 ).json(

            {
                status : true,
                msg : 'Rol Borrado',
                rol : { 
                    descripcionRol : descripcion_rol, 
                    idRolUsuario : ( typeof( id_rol_usuario ) === 'bigint' )? Number( id_rol_usuario.toString() ): id_rol_usuario, 
                    idUsuarioCreaRol : id_usuario_crea_rol, 
                    rolEditadoEn : rol_editado_en, 
                    idUsuarioEditaRol : id_usuario_edita_rol, 
                    rolCreadoEn : rol__creado_en 

                }
            }

        ); 
    } catch (error) {
        
        res.status( 500 ).json(

            {
                status : false,
                msg : `No se pudo borrar el Rol : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );    
        
    }


}


const obtener_roles = async ( req = request, res = response ) => {

    
    try {

        //                                                from roles_usuario;`;
        let roles = [], rolesUsuario = [];
        roles = await prisma.roles_usuario.findMany();
        if(roles.length > 0 ) { 
            rolesUsuario = roles.map( ( element ) =>{ 
                                            const { descripcion_rol, id_rol_usuario, id_usuario_crea_rol, 
                                                    rol_editado_en, id_usuario_edita_rol, rol__creado_en } = element;
                                                    return {
                                                        descripcionRol : descripcion_rol, 
                                                        idRolUsuario : ( typeof( id_rol_usuario ) === 'bigint' )? Number( id_rol_usuario.toString() ): id_rol_usuario, 
                                                        idUsuarioCreaRol : id_usuario_crea_rol, 
                                                        rolEditadoEn : rol_editado_en, 
                                                        idUsuarioEditaRol : id_usuario_edita_rol, 
                                                        rolCreadoEn : rol__creado_en 
                                                    };
                                        } 
                                    );
        }

        res.status( 200 ).json(
    
            {
                status : true,
                msg : 'Roles del sistema',
                rolesUsuario
            }
    
        );
        
    } catch (error) {
        
        res.status( 500 ).json(

            {
                status : false,
                msg : `No se pudo obtener los roles: ${error}`,
                //rol_nuevo : descripcionRol
            }

        );    
    }


}



const actualizar_accesos_rol = async ( req = request, res = response ) => {

    try {

    
        const { idRolUsuario, descripcionRol, accesos } = req.body;

        let accesosRol = [];

        for (const element of accesos) {
            
            let { idPathRuta } = accesos[element];
            let validar_acceso = await prisma.accesos_usuario.findUnique( { where : { id_ruta_app : Number( idPathRuta ) } } )
            if ( validar_acceso !== undefined && validar_acceso !== null ){

                let acceso_para_el_rol = await prisma.accesos_usuario.create( { 
                                                                    data : { 
                                                                        id_ruta_app : Number( idPathRuta ), 
                                                                        id_rol_usuario :  (  typeof( id_rol_usuario ) === 'bigint') ? Number(id_rol_usuario.toString()) : id_rol_usuario,
                                                                        rol_creado_en : new Date(),
                                                                        id_usuario_crea : 1
        
                                                                    } } );
                const { id_ruta_app, accion, path_ruta } = await prisma.rutas_app.findUnique( { where : { id_ruta_app : Number( idPathRuta ) } } );
        
                accesosRol.push( {
        
                    idRutaApp : id_ruta_app,
                    accion,
                    pathRuta : path_ruta
                    
                } );

            }
        }

        res.status( 200 ).json(

            {
                status : true,
                msg : 'Accesos actualizados del rol',
                rol : {
                    idRolUsuario : (  typeof( id_rol_usuario ) === 'bigint') ? Number(id_rol_usuario.toString()) : id_rol_usuario,
                    descripcionRol,
                    accesosRol
                }
            }

        );   
        
    } catch (error) {
        
        res.status( 500 ).json(
            {
                status : false,
                msg : `No se pudo crear el Rol y sus accesos : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );
    }


}


const quitar_accesos_rol = async ( req = request, res = response ) => {

    try {

    
        const { idRolUsuario, descripcionRol, accesos } = req.body;

        let accesosRol = [];

        for (const element of accesos) {
            
            let { idPathRuta } = accesos[element];
            let validar_acceso = await prisma.accesos_usuario.findUnique( { where : { id_ruta_app : Number( idPathRuta ) } } )
            if ( validar_acceso !== undefined && validar_acceso !== null ){

                let acceso_para_el_rol = await prisma.accesos_usuario.delete( { where : { id_ruta_app : Number( idPathRuta ) } } );
                const { id_ruta_app, accion, path_ruta } = await prisma.rutas_app.findUnique( { where : { id_ruta_app : Number( idPathRuta ) } } );
        
                accesosRol.push( {
        
                    idRutaApp : id_ruta_app,
                    accion,
                    pathRuta : path_ruta
                    
                } );

            }
        }

        res.status( 200 ).json(

            {
                status : true,
                msg : 'Accesos removidos del rol',
                rol : {
                    idRolUsuario : (  typeof( idRolUsuario ) === 'bigint') ? Number(idRolUsuario.toString()) : idRolUsuario,
                    descripcionRol,
                    accesosRol
                }
            }

        );   
        
    } catch (error) {
        
        res.status( 500 ).json(
            {
                status : false,
                msg : `No se pudo crear el Rol y sus accesos : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );
    }


}

const obtener_accesos_rol = async ( req = request, res = response ) => {

    try {

        const { rol_usuario } = req.query;

        const [ first, ...rest ] = await prisma.roles_usuario.findMany( { where : { descripcion_rol : rol_usuario }  } );

        const { descripcion_rol, id_rol_usuario } = first;

        const query = `SELECT C.path_ruta AS "pathRuta",
                            C.id_ruta_app AS "idRutaApp",
                            CASE WHEN C.id_ruta_app IN ( SELECT id_ruta_app FROM ACCESOS_USUARIO WHERE id_rol_usuario = ${ id_rol_usuario } ) THEN 'S' ELSE 'N' END AS "tieneAcceso"
                        FROM RUTAS_APP C`;
        const resultado = await prisma.$queryRawUnsafe( query );

        let accesoUsuario = {
            idRolUsuario : id_rol_usuario,
            descripcionRol : descripcion_rol,
            tieneAceso : [],
            noTieneAcceso : []

        }

        res.status( 200 ).json(

            {
                status : true,
                msg : 'Accesos del usuario',
                accesoUsuario
            }

        );  
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json(
            {
                status : false,
                msg : `No se pudo crear el Rol y sus accesos : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );
    }




}



module.exports = {  
    actualizar_rol, 
    borrar_rol, 
    crear_rol, 
    obtener_roles,
    crear_rol_con_accesos,
    actualizar_accesos_rol,
    quitar_accesos_rol,
    obtener_accesos_rol
    //obtener_modulos_x_rol
};
