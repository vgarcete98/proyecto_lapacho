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






module.exports = {

    obtener_accesos,
    crear_accesos

}