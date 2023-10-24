const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

//VOY A MANEJAR LOS ESTADOS DE UN PROFESOR A NIVEL DE LOGICA
//COMO LOS ESTADOS SON POCOS, CONVIENE TENERLO A NIVEL DE LOGICA NO A NIVEL DE BASE DE DATOS

const estadosProfesor = {

    activo : 'ACTIVO',
    suspendido : 'SUSPENDIDO',
    ya_no_es_profesor : 'BORRADO'
}



const obtener_nomina_profesores = async ( req = request, res = response ) =>{

    try {

        const { cantidad, omitir } = req.query;

        var todos_los_profesores;
        console.log( cantidad, omitir )
        if ( cantidad === undefined && omitir === undefined ) {

            todos_los_profesores = await prisma.profesores.findMany();
        } else {
            todos_los_profesores = await prisma.profesores.findMany(
                                                                { 
                                                                    skip : Number( omitir ),
                                                                    take : Number( cantidad )
                                                                }
                                                            );    
        }

        
        let profesoresFormateado = [];
        todos_los_profesores.forEach( ( elemento )=>{
            
            const { cedula, contacto_profesor, costo_x_hora, 
                    creadoen, editadoen, estado_profesor, 
                    id_profesor, nombre_profesor } = elemento;
            profesoresFormateado.push( { 
                cedula,
                contactoProfesor : contacto_profesor,
                costoXHora : costo_x_hora,
                creadoEn : creadoen,
                editadoEn : editadoen,
                estadoProfesor : estado_profesor,
                idProfesor : id_profesor,
                nombreProfesor : nombre_profesor
            } )
        } );

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
                    status : true,
                    msg : "Profesores del club",
                    cantidadRegistros : cantidad_registros,
                    profesoresFormateado
                }
            );
    
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( 
            {
                status : false,
                msg : "No se pudo obtener los Profesores del club",
                //error
            }
        );
        
    }


}


const obtener_profesor_cedula_nombre = async ( req = request, res = response ) =>{

    // VOY A OBTENER UN PROFESOR DADO SU ID

    //const { id_profesor_cons } = req.params;

    try {
        const { busqueda } = req.query;
        var profesor;
        //console.log( typeof( busqueda ), busqueda );
        if( Number( busqueda ) === NaN || typeof( busqueda ) === 'string') {
            //console.log( typeof( busqueda ), busqueda );
            profesor = await prisma.profesores.findFirst( { where : { 
                                                                        OR : [
                                                                                { nombre_profesor : { startsWith : busqueda, mode: 'insensitive' } },
                                                                                { nombre_profesor : { endsWith : busqueda, mode: 'insensitive' } },
                                                                                { nombre_profesor : { contains : busqueda, mode: 'insensitive' } }
                                                                            ]
                                                                    } 
                                                        } ); 
        }else {
            profesor = await prisma.profesores.findFirst( { where : { cedula : busqueda } } );

       }
        if ( profesor === null || profesor === undefined ) {

            res.status( 200 ).json( {
                status : false,
                msg : "No se encontro el profesor mencionado",
                profesor
            } );

        }else {
            const { cedula, contacto_profesor, costo_x_hora, 
                    creadoen, editadoen, estado_profesor, 
                    id_profesor, nombre_profesor } = profesor;

            const profesorFormateado = {
                cedula,
                contactoProfesor : contacto_profesor,
                costoXHora : costo_x_hora,
                creadoEn : creadoen,
                editadoEn : editadoen,
                estadoProfesor : estado_profesor,
                idProfesor : id_profesor,
                nombreProfe : nombre_profesor
            }
            res.status( 200 ).json( {
                status : true,
                msg : "Profesor Buscado",
                profesorFormateado
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



const obtener_profesor = async ( req = request, res = response ) =>{

    // VOY A OBTENER UN PROFESOR DADO SU ID

    const { id_profesor_cons } = req.params;
    try {
        const profesor = await prisma.profesores.findUnique( { 
                                                                where : {
                                                                    id_profesor : Number(id_profesor_cons)
                                                                } 
                                                            } );
        if ( profesor === null || profesor === undefined ) {

            res.status( 200 ).json( {
                status : false,
                msg : "No se encontro el profesor mencionado",
                profesor
            } );

        }else {
            const { cedula, contacto_profesor, costo_x_hora, 
                    creadoen, editadoen, estado_profesor, 
                    id_profesor, nombre_profesor } = profesor;

            const profesorFormateado = {
                cedula,
                contactoProfesor : contacto_profesor,
                costoXHora : costo_x_hora,
                creadoEn : creadoen,
                editadoEn : editadoen,
                estadoProfesor : estado_profesor,
                idProfesor : id_profesor,
                nombreProfe : nombre_profesor
            }
            res.status( 200 ).json( {
                status : true,
                msg : "Profesor Buscado",
                profesorFormateado
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
        if( typeof( precioXHora ) !== Number ){ precio = Number( precioXHora ) };

        // OPCIONAL SERIA EL PRECIO X HORA
        let nuevo_profesor;
        if ( precioXHora === undefined ){
            //----------------------------------------------------------------------------------------------------------------------------------
            /*nuevo_profesor = await prisma.$executeRaw`INSERT INTO public.profesores(
                                                        creadoen, estado_profesor, nombre_profesor, 
                                                        costo_x_hora, contacto_profesor, cedula)
                                                    VALUES ( ${ fecha_creacion } ,  ${ estado_profesor.activo } ,  
                                                            ${ nombreProfe } ,  ${ 0 } ,  ${ contactoProfesor }, ${ numeroCedula } );`*/
            nuevo_profesor = await prisma.profesores.create( { 
                                                                data : {
                                                                    cedula : numeroCedula,
                                                                    creadoen : fecha_creacion,
                                                                    nombre_profesor : nombreProfe,
                                                                    contacto_profesor : contactoProfesor,
                                                                    costo_x_hora : 0,
                                                                    estado_profesor : estado_profesor.activo
                                                                } 
                                                            } );
            //----------------------------------------------------------------------------------------------------------------------------------

        }else {

            //----------------------------------------------------------------------------------------------------------------------------------    
            /*nuevo_profesor = await prisma.$executeRaw`INSERT INTO public.profesores(
                                                        creadoen, estado_profesor, nombre_profesor, 
                                                        costo_x_hora, contacto_profesor, cedula)
                                                    VALUES ( ${ fecha_creacion } ,  ${ estado_profesor.activo } ,  
                                                            ${ nombreProfe } ,  ${ precio } ,  ${ contactoProfesor }, ${ numeroCedula } );`*/
            //----------------------------------------------------------------------------------------------------------------------------------
            nuevo_profesor = await prisma.profesores.create( { 
                data : {
                    cedula : numeroCedula,
                    creadoen : fecha_creacion,
                    nombre_profesor : nombreProfe,
                    contacto_profesor : contactoProfesor,
                    costo_x_hora : precio,
                    estado_profesor : estadosProfesor.activo
                } 
            } );        

        }

        const { cedula, contacto_profesor, costo_x_hora, 
                creadoen, id_profesor, nombre_profesor } = nuevo_profesor;
        const nuevoProfesorFormateado = {
            cedula,
            contactoProfesor : contacto_profesor,
            costoXHora : costo_x_hora,
            creadoEn : creadoen,
            idProfesor : id_profesor,
            nombreProfe : nombre_profesor
        }
        
        res.status( 200 ).json( {
            status : true,
            msg : "Profesor creado con exito",
            nuevoProfesorFormateado
        } );


    } catch (error) {

        console.log( error );

        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al crear un profesor",
            //error
        } );
    }

}

const actualizar_profesor = async ( req = request, res = response ) =>{

    // SERIA MEJOR METER EL ID DEL PROFESOR EN EL QUERY PARAM Y EN EL BODY LOS DATOS NUEVOS
    const { id_profesor_update } = req.params;
    const { numeroCedula, precioXHora, contactoProfesor, nombreProfe } = req.body;
    const fecha_edicion = new Date();
    
    try {

        const profesor_editado = await prisma.profesores.update( {
            where : {
                id_profesor : Number(id_profesor_update)
            },

            data : {
                contacto_profesor : contactoProfesor,
                costo_x_hora : precioXHora,
                editadoen : fecha_edicion,
                cedula : numeroCedula,
                nombre_profesor : nombreProfe
            }
        } );

        const { cedula, contacto_profesor, costo_x_hora, creadoen, editadoen, 
                estado_profesor, id_profesor, nombre_profesor } = profesor_editado;

        res.status( 200 ).json( {
            status : true,
            msg : "Profesor actualizado correctamente",
            profesorEditado : {
                nombreProfe : nombre_profesor, 
                precioXHora : costo_x_hora, 
                contactoProfesor : contacto_profesor, 
                numeroCedula : cedula,
                creadoEn : creadoen,
                editadoEn : editadoen,
                idProfesor : id_profesor,
                estadoProfesor : estado_profesor
            }
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
                estado_profesor : estadosProfesor.ya_no_es_profesor
                //profesor_borrado : true
            }
        } );

        const { cedula, contacto_profesor, 
                costo_x_hora, creadoen,
                editadoen, estado_profesor, nombre_profesor } = profesor_editado;

        const profesorEditado = {
            cedula,
            contactoProfesor : contacto_profesor,
            costoXHora :costo_x_hora,
            creadoEn : creadoen,
            editadoEn : editadoen,
            estadoProfesor : estado_profesor,
            nombreProfesor : nombre_profesor
        }
        res.status( 200 ).json( {
            status : true,
            msg : "Profesor eliminado correctamente",
            profesorEditado
        } );

    } catch ( error ) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "El profesor no se pudo eliminar correctamente",
            //mensaje_error : "Id de profesor no existe",
            //error,
            //id_profesor_delete
        } );

    }
}




module.exports = {
    crear_profesor,
    actualizar_profesor,
    eliminar_profesor,
    obtener_nomina_profesores,
    obtener_profesor,
    obtener_profesor_cedula_nombre
}