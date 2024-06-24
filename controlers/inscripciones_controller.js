
const { request, response, query } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



/*
id_inscripcion AS "idInscripcion", 
id_socio AS "idSocio", 
id_evento_calendario AS "idEventoCalendario", 
desc_inscripcion AS "descInscripcion", 
fecha_inscripcion AS "fechaInscripcion", 
abonado AS "abonado", 
inscripcioncreadoen AS "inscripcionCreadoEn", 
estadoinscripcion AS "estadoInscripcion", 
inscripcioneditadoen AS "inscripcionEditadoEn"
*/


const inscribirse_a_evento = async ( req = request, res = response ) =>{
    
    try {
        
        // NECESITO REGISTRAR UNA INSCRIPCION 
        // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
        const { idSocio, idEvento, montoAbonado, categorias } = req.body;

        let cat = []
        const { abonado, desc_inscripcion, estadoinscripcion, 
                fecha_inscripcion, id_evento_calendario, id_inscripcion,
                id_socio, inscripcioncreadoen, inscripcioneditadoen } = await prisma.inscripciones.create( { 
                                                                        data : {
                                                                            id_socio : idSocio,
                                                                            id_evento_calendario : idEvento,
                                                                            abonado,
                                                                            inscripcioncreadoen : new Date(),
                                                                        } 
                                                                    } );

        categorias.forEach( async ( element ) =>{

            const { idCategoria } = element;
            const detalle_inscripcion = await prisma.inscripcion_evento_categria_socio.create( { 
                                                                                                    data : {
                                                                                                        id_evento_calendario : Number(idEvento),
                                                                                                        id_categoria : Number(idCategoria),
                                                                                                        id_inscripcion : id_inscripcion
                                                                                                    } 
                                                                                                });

            cat.push( await prisma.categorias.findUnique( { where : { id_categoria : Number( idCategoria ) } } ));
            
        } )

        const { nombre_cmp, nombre, apellido } = await prisma.socio.findUnique( 
                                                                {

                                                                    where : { id_socio } ,
                                                                    include : {  
                                                                        persona : {
                                                                            select : {
                                                                                apellido : true ,
                                                                                nombre : true
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            );



        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion registrada",
            nuevaInscripcion : {
                "idInscripcion" : id_inscripcion , 
                "idSocio" : id_socio , 
                "idEventoCalendario" : id_evento_calendario, 
                "descInscripcion" : desc_inscripcion , 
                "fechaInscripcion" :fecha_inscripcion , 
                "abonado" : abonado , 
                "inscripcionCreadoEn" : inscripcioncreadoen, 
                "estadoInscripcion" : estadoinscripcion, 
                "inscripcionEditadoEn" : inscripcioneditadoen,
                "nombreSocio" : nombre_cmp,
                nombreCmp : `${ nombre } ${ apellido }`,
                categorias : cat.map( ( element ) => {  return { idCategoria : element.id_categoria, nombreCategoria : element.nombre_categoria }  } )
            },
        } );        
        


    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo ingresar el registro  ${ error }`,
            //nueva_inscripcion,
            //error

        } );
    }


}


const inscribirse_a_evento_no_socios = async ( req = request, res = response ) =>{

    try {
        // NECESITO REGISTRAR UNA INSCRIPCION 
        const { idEvento, nombreJugador, montoAbonado  } = req.body;
        
        // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
        const { abonado, desc_inscripcion, editadoen,
                estado_inscripcion, fecha_inscripcion, 
                id_evento_calendario_no_socio , id_inscripcion_no_socio } = await prisma.inscripciones_no_socios.create( { 
                                                                                    data : {
                                                                                        id_evento_calendario_no_socio : idEvento,
                                                                                        nombre_jugador : nombreJugador,
                                                                                        abonado : montoAbonado,
                                                                                        fecha_inscripcion : new Date() ,

                                                                                    } 
                                                                                } );
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion generada con exito",
            nuevaInscripcion : {
                "idInscripcion" : id_inscripcion_no_socio , 
                "idSocio" : id_socio , 
                "idEventoCalendario" : id_evento_calendario_no_socio, 
                "descInscripcion" : desc_inscripcion , 
                "fechaInscripcion" :fecha_inscripcion , 
                "abonado" : abonado , 
                "inscripcionCreadoEn" : inscripcioncreadoen, 
                "estadoInscripcion" : estado_inscripcion, 
                "inscripcionEditadoEn" : editadoen,
                "nombreSocio" : nombre_cmp,
                nombreCmp : `${ nombre } ${ apellido }`
            }
        } );


    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo crear el registro ${ error }`,
        } );
        
    }


}






const editar_inscripcion = async ( req = request, res = response ) =>{

    
    try {
    
        const { idSocio, idEvento, montoAbonado, idInscripcion, descripcion, estadoInscripcion } = req.body;
        
        const { abonado, desc_inscripcion, editadoen,
                estado_inscripcion, fecha_inscripcion, 
                id_evento_calendario_no_socio , id_inscripcion_no_socio } = await prisma.inscripciones.update( { 
                                                                            where : { 
                                                                                        AND :[
                                                                                                { id_inscripcion : Number( idInscripcion ) },
                                                                                                { id_evento_calendario : Number( idEvento ) },
                                                                                                { id_socio : Number( idSocio ) }
                                                                                        ]
                                                                                    }, 
                                                                            data : {
                                                                                abonado : montoAbonado,
                                                                                desc_inscripcion : (descripcion === undefined) ? '' : 'ACTUALIZACION DE INSCRIPCION',
                                                                                estadoinscripcion : (estadoInscripcion === undefined) ? false : true
                                                                            }
                                                                        } );

        const { nombre_cmp, nombre, apellido } = await prisma.socio.findUnique( 
                                                                                {
                                                                                    where : { id_socio } ,
                                                                                    include : {  
                                                                                        persona : {
                                                                                            select : {
                                                                                                apellido : true ,
                                                                                                nombre : true
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            );
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            InscripcionEditada : {
                "idInscripcion" : id_inscripcion_no_socio , 
                "idSocio" : id_socio , 
                "idEventoCalendario" : id_evento_calendario_no_socio, 
                "descInscripcion" : desc_inscripcion , 
                "fechaInscripcion" :fecha_inscripcion , 
                "abonado" : abonado , 
                "inscripcionCreadoEn" : inscripcioncreadoen, 
                "estadoInscripcion" : estado_inscripcion, 
                "inscripcionEditadoEn" : editadoen,
                "nombreSocio" : nombre_cmp,
                nombreCmp : `${ nombre } ${ apellido }`
            }
        } );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false, 
            msg : `No se pudo editar la inscripcion  ${ error }`,
            //error
        } );
    }


}



const editar_inscripcion_no_socio = async ( req = request, res = response ) =>{

    
    try {
        const { id_inscripcion } = req.params;
        const { descripcion, estadoInscripcion, abonado, } = req.body;

        const inscripcion_editada = await prisma.inscripciones_no_socios.update ( { 
                                                                                    where :  { id_inscripcion_no_socio : id_inscripcion },
                                                                                    data : {
                                                                                        abonado,
                                                                                        desc_inscripcion : descripcion,
                                                                                        estado_inscripcion : estadoInscripcion
                                                                                    }
                                                                                } );
        res.status( 200 ).json( {
            status : true,
            msg : 'Inscripcion editada con exito',
            inscripcion_editada

        } );
    } catch (error) {

        console.log( error )

        res.status( 500 ).json( {

        } );
        
    }
        

}


const abonar_x_inscripcion = async ( req = request, res = response ) =>{
    
    try {
        const { idSocio, idEvento, montoAbonado, idInscripcion, descripcion, estadoInscripcion } = req.body;
        
        const { abonado, desc_inscripcion, editadoen,
                estado_inscripcion, fecha_inscripcion, 
                id_evento_calendario_no_socio , id_inscripcion_no_socio } = await prisma.inscripciones.update( { 
                                                                            where : { 
                                                                                        AND :[
                                                                                                { id_inscripcion : Number( idInscripcion ) },
                                                                                                { id_evento_calendario : Number( idEvento ) },
                                                                                                { id_socio : Number( idSocio ) }
                                                                                        ]
                                                                                    }, 
                                                                            data : {
                                                                                abonado : montoAbonado,
                                                                                desc_inscripcion : (descripcion === undefined) ? '' : 'ACTUALIZACION DE INSCRIPCION',
                                                                                estadoinscripcion : (estadoInscripcion === undefined) ? false : true
                                                                            }
                                                                        } );

        const { nombre_cmp, nombre, apellido } = await prisma.socio.findUnique( 
                                                                                {
                                                                                    where : { id_socio } ,
                                                                                    include : {  
                                                                                        persona : {
                                                                                            select : {
                                                                                                apellido : true ,
                                                                                                nombre : true
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            );
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            InscripcionEditada : {
                "idInscripcion" : id_inscripcion_no_socio , 
                "idSocio" : id_socio , 
                "idEventoCalendario" : id_evento_calendario_no_socio, 
                "descInscripcion" : desc_inscripcion , 
                "fechaInscripcion" :fecha_inscripcion , 
                "abonado" : abonado , 
                "inscripcionCreadoEn" : inscripcioncreadoen, 
                "estadoInscripcion" : estado_inscripcion, 
                "inscripcionEditadoEn" : editadoen,
                "nombreSocio" : nombre_cmp,
                nombreCmp : `${ nombre } ${ apellido }`
            }
        } );  

    } catch (error) {

        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo actualizar el registro",
            //inscripcion_abonada
        } );
                
    }

}

const abonar_x_inscripcion_no_socio = async ( req = request, res = response ) =>{

    const { id_inscripcion } = req.params;
    
    try {
        const inscripcion_abonada = await prisma.inscripciones_no_socios.update( { 
                                                                            where : { id_inscripcion_no_socio : id_inscripcion }, 
                                                                            data : {
                                                                                abonado : true

                                                                            }
                                                                    } );
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            inscripcion_abonada
        } );    

    } catch (error) {

        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo actualizar el registro",
            //inscripcion_abonada
        } );
                
    }

}



const ver_inscripciones_x_evento = async ( req = request, res = response ) =>{

    
    try {
        const { id_evento } = req.params;
        
        const query = `SELECT   A.id_inscripcion AS "idInscripcion", 
                                A.id_socio AS "idSocio", 
                                A.id_evento_calendario AS "idEventoCalendario", 
                                A.desc_inscripcion AS "descInscripcion", 
                                A.fecha_inscripcion AS "fechaInscripcion", 
                                A.abonado AS "abonado", 
                                A.inscripcioncreadoen AS "inscripcionCreadoEn", 
                                A.estadoinscripcion AS "estadoInscripcion", 
                                A.inscripcioneditadoen AS "inscripcionEditadoEn",
                                B.nombre_cmp as "nombreSocio",
                                CONCAT( C.nombre, ' ', C.apellido ) as "nombreCmp"
                            FROM inscripciones JOIN SOCIO B ON A.id_socio = B.id_socio
                        WHERE id_evento_calendario = ${ id_evento };`
        const inscripciones = await prisma.$queryRawUnsafe( query )
        const cantInscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cantInscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }


}

const ver_inscripciones_x_evento_no_socio = async ( req = request, res = response ) =>{

    
    try {
        const { id_evento } = req.params;
        
        const inscripciones = await prisma.inscripciones_no_socios.findMany( {
                                                                                where : { id_evento_calendario_no_socio : id_evento }
                                                                            } );
        const cant_inscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cant_inscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }


}




const ver_todas_las_inscripciones_x_evento = async ( req = request, res = response  ) =>{
        
    try {
        const { id_evento } = req.params;
        
        const inscripciones = await prisma.inscripciones_no_socios.findMany( {
                                                                    where : { id_evento_calendario_no_socio : id_evento }
                                                                } );
        const cant_inscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cant_inscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }
}





module.exports = {

    abonar_x_inscripcion,
    editar_inscripcion,
    inscribirse_a_evento,
    ver_inscripciones_x_evento,
    inscribirse_a_evento_no_socios,
    abonar_x_inscripcion_no_socio,
    editar_inscripcion_no_socio,
    ver_inscripciones_x_evento_no_socio,
    ver_todas_las_inscripciones_x_evento
}