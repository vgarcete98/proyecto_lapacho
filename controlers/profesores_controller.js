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



    try {
        const { busqueda, cedula } = req.query;
        let profesores;
        if( (busqueda ) !== null && busqueda !== undefined ) {
            profesores = await prisma.profesores.findMany( { where : { 
                                                                nombre_profesor : {
                                                                    contains : busqueda,
                                                                    mode : 'insensitive'
                                                                }
                                                            },
                                                            select : {
                                                                costo_x_hora : true,
                                                                cedula : true,
                                                                id_profesor : true,
                                                                porc_facturacion : true,
                                                                contacto_profesor : true,
                                                                nombre_profesor : true,
                                                                estado_profesor : true
                                                            }
                                                        } ); 
        }else if ( cedula !== null & cedula !== undefined ){
            profesores = await prisma.profesores.findMany( { 
                                                            where : { cedula : busqueda },
                                                            select : {
                                                                costo_x_hora : true,
                                                                cedula : true,
                                                                id_profesor : true,
                                                                porc_facturacion : true,
                                                                contacto_profesor : true,
                                                                nombre_profesor : true,
                                                                estado_profesor : true
                                                            }
                                                        } );

        }else {
            profesores = await prisma.profesores.findMany();
        }

        if ( profesores === null || profesores === undefined ) {

            res.status( 200 ).json( {
                status : false,
                msg : "No se encontro el profesor mencionado",
                profesores
            } );

        }else {

            const profesoresFormateado = profesores.map( element => {
                const { costo_x_hora, precio_clase, cedula, 
                        id_profesor, porc_facturacion, contacto_profesor,
                        nombre_profesor, estado_profesor} = element;
                return { 
                        cedula,
                        contactoProfesor : contacto_profesor,
                        costoXHora : costo_x_hora,
                        estadoProfesor : estado_profesor,
                        idProfesor : id_profesor,
                        nombreProfesor : nombre_profesor,
                        porcFacturacion : porc_facturacion
                    };
            });
            res.status( 200 ).json( {
                status : true,
                msg : "Profesores Buscados",
                profesoresFormateado
            } );
        } 

    } catch (error) {
        console.log ( error );
        res.status( 500 ).json( {
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

        const { nombreProfe, precioXHora, contactoProfesor, 
                numeroCedula, crearUsuario, nombreUsuario, password } = req.body;
        const fecha_creacion = new Date();


        //CREO AL PROFESOR
        let nuevo_profesor = await prisma.profesores.create( { 
                                                            data : {
                                                                cedula : numeroCedula,
                                                                creadoen : fecha_creacion,
                                                                nombre_profesor : nombreProfe,
                                                                contacto_profesor : contactoProfesor,
                                                                costo_x_hora : Number( precioXHora ),
                                                                estado_profesor : estadosProfesor.activo
                                                            } 
                                                        } );

        
        if ( nuevo_profesor !== null ) {

            // OPCIONAL SERIA EL PRECIO X HORA
            let precio_profesor = await prisma.precio_clase.create(  { 
                                                                        data : {  
                                                                            precio : Number( precioXHora ),
                                                                            creado_en : new Date(),
                                                                            id_profesor : nuevo_profesor.id_profesor,
                                                                            porc_descuento : 0,
                                                                            valido : true 
                                                                        } 
                                                                    });
            //AHORA VAMOS A CREAR AL USUARIO DE ESE PROFESOR

            if ( crearUsuario !== null && crearUsuario !== undefined ){

                const rol_profesor = await prisma.roles_usuario.findFirst( { 
                                                                                select : {
                                                                                    id_rol_usuario : true,
                                                                                },
                                                                                where : {
                                                                                    AND :[ 
                                                                                        { descripcion_rol : 'PROFESOR' },
                                                                                        { estado_rol_usuario : 'ACTIVO' }
                                                                                    ]
                                                                                }
                                                                        } );
                let nuevo_usuario = await prisma.cliente.create( { 
                                                                    data : {
                                                                        apellido : nombreProfe,
                                                                        nombre : nombreProfe,
                                                                        nombre_cmp : nombreProfe,
                                                                        nombre_usuario : nombreUsuario,
                                                                        cedula : numeroCedula,
                                                                        password : password,
                                                                        creadoen : new Date(),
                                                                        es_socio : false,
                                                                        id_rol_usuario : rol_profesor.id_rol_usuario
                                                                    } 
                                                                } );

                if( nuevo_usuario !== null ) { 
                    res.status( 200 ).json( {
                        status : true,
                        msg : "Profesor creado con exito",
                        descripcion : "El profesor ha sido creado junto con su respectivo usuario"
                    } );
                }else {                    
                    res.status( 400 ).json( {
                        status : true,
                        msg : "Profesor creado con exito",
                        descripcion : "El profesor ha sido creado, pero no asi su usuario"
                    } );
                }

            }else {
                res.status( 200 ).json( {
                    status : true,
                    msg : "Profesor creado con exito",
                    descripcion : "El profesor ha sido creado"
                } );
            }
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : "El profesor no logro ser creado",
                descripcion : "No se ha creado al profesor, favor intente de nuevo"
            } );
        }

    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al crear un profesor",
            //error
        } );
    }

}

const actualizar_profesor = async ( req = request, res = response ) =>{

    // SERIA MEJOR METER EL ID DEL PROFESOR EN EL QUERY PARAM Y EN EL BODY LOS DATOS NUEVOS
    
    try {
        const { idProfesor, nombreProfe, precioXHora, contactoProfesor, 
                numeroCedula, crearUsuario, nombreUsuario, password } = req.body;
        const fecha_edicion = new Date();

        
        const profesor_editado = await prisma.profesores.update( {
            where : {
                id_profesor : Number(idProfesor)
            },

            data : {
                contacto_profesor : contactoProfesor,
                costo_x_hora : precioXHora,
                editadoen : fecha_edicion,
                cedula : numeroCedula,
                nombre_profesor : nombreProfe
            },
            select :{
                id_profesor : true
            }
        } );


        //NUEVO PARAMETRO, AHORA SETEAMOS LOS PRECIOS DE LOS PROFESORES PARA TENER UN HISTORICO
        const { id_profesor } = profesor_editado;
        //----------------------------------------------------------------------
        const editar_precios = await prisma.precio_clase.updateMany( {
            where : { 
                AND :[
                    { id_profesor : id_profesor },
                    { valido : true }
                ]

            },
            data : { 
                valido : false,
            }
        } );
        //----------------------------------------------------------------------
        const precio_nuevo = await prisma.precio_clase.create( {
            data : {
                precio : Number(precioXHora),
                creado_en : new Date(),
                valido : true,
                id_profesor : id_profesor,
                porc_descuento : 0,
                
            }
        } )




        if (profesor_editado !== null ){ 
            // OPCIONAL SERIA EL PRECIO X HORA

            //---------------------------------------------------------------------------
            let anular_precio_anterior = await prisma.precio_clase.updateMany( { 
                                                                                data : { valido : false }, 
                                                                                where : { 
                                                                                    AND : [
                                                                                        { valido : true },
                                                                                        { id_profesor : profesor_editado.id_profesor } 
                                                                                    ]
                                                                                } 
                                                                            } )
            let precio_profesor = await prisma.precio_clase.create(  { 
                data : {  
                    precio : Number( precioXHora ),
                    creado_en : new Date(),
                    id_profesor : profesor_editado.id_profesor,
                    porc_descuento : 0,
                    valido : true 
                } 
            });
            //---------------------------------------------------------------------------

            if (crearUsuario !== null && crearUsuario !== undefined) {
                const rol_profesor = await prisma.roles_usuario.findFirst( { 
                                                                                select : {
                                                                                    id_rol_usuario : true,
                                                                                },
                                                                                where : {
                                                                                    AND :[ 
                                                                                        { descripcion_rol : 'PROFESOR' },
                                                                                        { estado_rol_usuario : 'ACTIVO' }
                                                                                    ]
                                                                                }
                                                                        } );
                let nuevo_usuario = await prisma.cliente.upsert( { 
                                                                    where :{ cedula : numeroCedula },
                                                                    update : {
                                                                        apellido : nombreProfe,
                                                                        nombre : nombreProfe,
                                                                        nombre_cmp : nombreProfe,
                                                                        nombre_usuario : nombreUsuario,
                                                                        cedula : numeroCedula,
                                                                        password : password,
                                                                        creadoen : new Date(),
                                                                        es_socio : false,
                                                                        id_rol_usuario : rol_profesor.id_rol_usuario
                                                                    },
                                                                    create : {
                                                                        apellido : nombreProfe,
                                                                        nombre : nombreProfe,
                                                                        nombre_cmp : nombreProfe,
                                                                        nombre_usuario : nombreUsuario,
                                                                        cedula : numeroCedula,
                                                                        password : password,
                                                                        creadoen : new Date(),
                                                                        es_socio : false,
                                                                        id_rol_usuario : rol_profesor.id_rol_usuario
                                                                    },

                                                                } );

                if( nuevo_usuario !== null ) { 
                    res.status( 200 ).json( {
                        status : true,
                        msg : "Profesor actualizado con exito",
                        descripcion : "El profesor ha sido actualizado junto con su respectivo usuario"
                    } );
                }else {
                    res.status( 400 ).json( {
                        status : true,
                        msg : "Profesor actualizado con exito",
                        descripcion : "El profesor ha sido actualizado, pero no asi su usuario"
                    } );
                }
            }else {
                res.status( 200 ).json( {
                    status : true,
                    msg : "Profesor actualizado correctamente",
                    descripcion : 'Se ha actualizado al profesor'
                } );
            }
        }


    } catch ( error ) {
        console.log( error );
        res.status( 400 ).json( {
            status : true,
            msg : "El profesor no se pudo actualizar correctamente",
        } );

    }


}



const eliminar_profesor = async ( req = request, res = response ) =>{

    // SERIA MEJOR METER EL ID DEL PROFESOR EN EL QUERY PARAM Y EN EL BODY LOS DATOS NUEVOS
    // LO MISMO PARA EDITAR SOLO QUE AQUI EDITO UN SOLO CAMPO
    try {
        const { idProfesor } = req.query;
        const profesor_editado = await prisma.profesores.update( {
            where : {
                id_profesor : Number(idProfesor)
            },

            data : {
                //contacto_profesor : contacto_nuevo,
                //costo_x_hora : nuevo_costo,
                editadoen : new Date(),
                estado_profesor : estadosProfesor.ya_no_es_profesor
                //profesor_borrado : true
            }
        } );

        if ( profesor_editado !== null ){ 
            
            res.status( 200 ).json( {
                status : true,
                msg : "Profesor eliminado correctamente",
                descripcion : "El profesor ha sido borrado"
            } );
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No Se borro al profesor seleccionado',
                descripcion : `Favor intente realizar el borrado de vuelta`
            } ); 
        }

    } catch ( error ) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "El profesor no se pudo eliminar correctamente",
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