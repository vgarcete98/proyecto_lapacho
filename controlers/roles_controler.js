const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const crear_rol = async ( req = request, res = response ) => {

    const { descripcionRol, idSocio } = req.body;

    try {

        const { descripcion_rol, id_rol_usuario, id_usuario_crea_rol, 
                rol_editado_en, id_usuario_edita_rol, rol__creado_en } = await prisma.roles_usuario.create( { data : { 
                                                                        descripcion_rol : descripcionRol, 
                                                                        rol__creado_en : new Date() ,
                                                                        //id_usuario_crea_rol : Number( idSocio ) 
                                                                    } 
                                                            } );
        
        //const rol_nuevo = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
        //                                                descripcion_rol )
        //                                            VALUES ( ${ descripcionRol });`;

        res.status( 200 ).json(

            {
                status : true,
                msj : 'Rol Creado',
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
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : `No se pudo crear el Rol : ${error}`,
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

        //const rol_editado = await prisma.$executeRaw`UPDATE public.roles_usuario
        //                                                SET descripcion_rol= ${ descripcionRol }
        //                                            WHERE id_rol_usuario = ${id}`;

        res.status( 200 ).json(

            {
                status : true,
                msj : `Rol Editado`,
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
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : `No se pudo actualizar el Rol : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );    
        
    }





}


const borrar_rol = async ( req = request, res = response ) => {


    //const { id } = req.params;
    //const { descripcion_rol } = req.body;
    try {
        const { descripcionRol, idSocio, idRol } = req.body;
        //const rol = await prisma.roles_usuario.findFirst( { where : { id_rol_usuario : id } } );
        //const rol_borrado = await prisma.$executeRaw`UPDATE public.roles_usuario
        //                                                SET activacion_rol= false
        //                                            WHERE id_rol_usuario = ${id}`;

        const { descripcion_rol, id_rol_usuario, id_usuario_crea_rol, 
                rol_editado_en, id_usuario_edita_rol, rol__creado_en } = await prisma.roles_usuario.delete( { where : { id_rol_usuario : Number( idRol ) } })


        res.status( 200 ).json(

            {
                status : true,
                msj : 'Rol Borrado',
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
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : `No se pudo borrar el Rol : ${error}`,
                //rol_nuevo : descripcionRol
            }

        );    
        
    }


}


const obtener_roles = async ( req = request, res = response ) => {

    
    try {
        //const roles_usuario = await prisma.$queryRaw`select CAST ( id_rol_usuario AS INTEGER ) AS id_rol_usuario, descripcion_rol
        //                                                from roles_usuario;`;
        let roles = [], rolesUsuario = [];
        roles = await prisma.roles_usuario.findMany();
        //console.log( roles )
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
                msj : 'Roles del sistema',
                rolesUsuario
            }
    
        );
        
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : `No se pudo obtener los roles: ${error}`,
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
    //obtener_modulos_x_rol
};
