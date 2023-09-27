const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

//VOY A MANEJAR LOS ESTADOS DE UN PROFESOR A NIVEL DE LOGICA
//COMO LOS ESTADOS SON POCOS, CONVIENE TENERLO A NIVEL DE LOGICA NO A NIVEL DE BASE DE DATOS

const estado_profesor = {

    activo : 'ACTIVO',
    suspendido : 'SUSPENDIDO',
    ya_no_es_profesor : 'BORRADO'
}



const obtener_nomina_profesores = async ( req = request, res = response ) =>{

    try {
        const todos_los_profesores = await prisma.profesores.findMany(); 
        const cantidad_registros = todos_los_profesores.length;
        if ( cantidad_registros === 0 ){
    
            res.status( 200 ).json( 
                {
                    status : false,
                    msg : "No hay registros creados",
                    cantidad_registros
                }
            );
        } else {
            res.status( 200 ).json( 
                {
                    status : false,
                    msg : "Profesores del club",
                    cantidad_registros,
                    todos_los_profesores
                }
            );
    
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( 
            {
                status : false,
                msg : "No se pudo obtener los Profesores del club",
                error
            }
        );
        
    }


}



const obtener_profesor = async ( req = request, res = response ) =>{

    // VOY A OBTENER UN PROFESOR DADO SU ID

    const { id_profesor_cons } = req.params;
    try {
        const profesor = await prisma.profesores.findUnique( { 
                                                                where : {
                                                                    id_profesor : Number(id_profesor_cons)
                                                                } 
                                                            } );
        if ( profesor === null ) {

            res.status( 200 ).json( {
                status : false,
                msg : "No se encontro el profesor mencionado",
                profesor
            } );
        }else {
            res.status( 200 ).json( {
                status : false,
                msg : "Profesor Buscado",
                profesor
            } );
        }
    } catch (error) {
        console.log ( error );
        res.status( 5001 ).json( {
            status : false,
            msg : "No se pudo obtener el Profesor Buscado",
        } );
    }


}

const crear_profesor = async ( req = request, res = response ) =>{

    try {

        const { nombreProfe, precioXHora, contactoProfesor, numeroCedula } = req.body;
        const fecha_creacion = new Date();
        // OPCIONAL SERIA EL PRECIO X HORA
        let nuevo_profesor;
        if ( precioXHora === undefined ){
            nuevo_profesor = await prisma.$executeRaw`INSERT INTO public.profesores(
                                                        creadoen, estado_profesor, nombre_profesor, 
                                                        costo_x_hora, contacto_profesor, cedula)
                                                    VALUES ( ${ fecha_creacion } ,  ${ estado_profesor.activo } ,  
                                                            ${ nombreProfe } ,  ${ 0 } ,  ${ contactoProfesor }, ${ numeroCedula } );`
        }else {
            nuevo_profesor = await prisma.$executeRaw`INSERT INTO public.profesores(
                                                        creadoen, estado_profesor, nombre_profesor, 
                                                        costo_x_hora, contacto_profesor, cedula)
                                                    VALUES ( ${ fecha_creacion } ,  ${ estado_profesor.activo } ,  
                                                            ${ nombreProfe } ,  ${ precioXHora } ,  ${ contactoProfesor }, ${ numeroCedula } );`
    
        }
        res.status( 200 ).json( {
            status : true,
            msg : "Profesor creado con exito",
            nuevo_profesor
        } );


    } catch (error) {

        console.log( error );

        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al crear un profesor",
            error
        } );
    }

}

const actualizar_profesor = async ( req = request, res = response ) =>{

    // SERIA MEJOR METER EL ID DEL PROFESOR EN EL QUERY PARAM Y EN EL BODY LOS DATOS NUEVOS
    const { id_profesor_update } = req.params;
    const { contactoNuevo, nuevoCosto } = req.body;
    const fecha_edicion = new Date();
    
    try {
        const profesor_editado = await prisma.profesores.update( {
            where : {
                id_profesor : Number(id_profesor_update)
            },

            data : {
                contacto_profesor : contactoNuevo,
                costo_x_hora : nuevoCosto,
                editadoen : fecha_edicion
            }
        } );

        res.status( 200 ).json( {
            status : true,
            msg : "Profesor actualizado correctamente",
            profesor_editado
        } );

    } catch ( error ) {
        console.log( error );
        res.status( 400 ).json( {
            status : true,
            msg : "El profesor no se pudo actualizar correctamente",
            //mensaje_error : "Id de profesor no existe",
            error,
            id_profesor_update
        } );

    }


}



const eliminar_profesor = async ( req = request, res = response ) =>{

    // SERIA MEJOR METER EL ID DEL PROFESOR EN EL QUERY PARAM Y EN EL BODY LOS DATOS NUEVOS
    // LO MISMO PARA EDITAR SOLO QUE AQUI EDITO UN SOLO CAMPO

    const { id_profesor_delete } = req.params;
    //const { contacto_nuevo, nuevo_costo } = req.body;
    const fecha_edicion = new Date();
    
    try {
        const profesor_editado = await prisma.profesores.update( {
            where : {
                id_profesor : Number(id_profesor_delete)
            },

            data : {
                //contacto_profesor : contacto_nuevo,
                //costo_x_hora : nuevo_costo,
                editadoen : fecha_edicion,
                estado_profesor : estado_profesor.ya_no_es_profesor
            }
        } );

        res.status( 200 ).json( {
            status : true,
            msg : "Profesor eliminado correctamente",
            profesor_editado
        } );

    } catch ( error ) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "El profesor no se pudo eliminar correctamente",
            mensaje_error : "Id de profesor no existe",
            error,
            id_profesor_delete
        } );

    }
}




module.exports = {
    crear_profesor,
    actualizar_profesor,
    eliminar_profesor,
    obtener_nomina_profesores,
    obtener_profesor
}