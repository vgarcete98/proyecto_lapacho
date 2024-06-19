
const { request, response, query } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const inscribirse_a_evento = async ( req = request, res = response ) =>{

    // NECESITO REGISTRAR UNA INSCRIPCION 
    const { idSocio, idEvento, abonado } = req.body;
    const fecha_inscripcion = new Date(); // La fecha en la que se inscribio el socio
    
    // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
    try {
        const nueva_inscripcion = await prisma.inscripciones.create( { 
                                                                        data : {
                                                                            id_socio : idSocio,
                                                                            id_evento_calendario : idEvento,
                                                                            abonado,
                                                                            inscripcioncreadoen : fecha_inscripcion,

                                                                        } 
                                                                    } )
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion registrada",
            nueva_inscripcion,
        } );        
        


    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo ingresar el registro",
            //nueva_inscripcion,
            //error

        } );
    }


}


const inscribirse_a_evento_no_socios = async ( req = request, res = response ) =>{

    // NECESITO REGISTRAR UNA INSCRIPCION 
    const { idEvento, nombreJugador, abonado,  } = req.body;
    const fecha_inscripcion = new Date(); // La fecha en la que se inscribio el socio
    
    // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
    try {
        const nueva_inscripcion = await prisma.inscripciones_no_socios.create( { 
                                                                                    data : {
                                                                                        id_evento_calendario_no_socio : idEvento,
                                                                                        nombre_jugador : nombreJugador,
                                                                                        abonado,
                                                                                        fecha_inscripcion ,

                                                                                    } 
                                                                                } );
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion generada con exito",
            nueva_inscripcion
        } );


    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo crear el registro",
        } );
        
    }


}






const editar_inscripcion = async ( req = request, res = response ) =>{

    const { id_inscripcion } = req.params;

    const { descripcion, estadoInscripcion, abonado } = req.body;

    try {
        
        const inscripcion_editada = await prisma.inscripciones.update( { 
                                                                            where : { id_inscripcion }, 
                                                                            data : {
                                                                                abonado,
                                                                                desc_inscripcion : descripcion,
                                                                                estadoinscripcion : estadoInscripcion
                                                                            }
                                                                        } );
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            inscripcion_editada
        } );

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false, 
            msg : 'No se pudo editar la inscripcion',
            //error
        } );
    }


}



const editar_inscripcion_no_socio = async ( req = request, res = response ) =>{

    const { id_inscripcion } = req.params;

    try {
        const { descripcion, estadoInscripcion, abonado } = req.body;

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

    const { id_inscripcion } = req.params;
    
    try {
        const inscripcion_abonada = await prisma.inscripciones.update( { 
                                                                            where : { id_inscripcion }, 
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
        
        const query = `SELECT id_inscripcion AS "idInscripcion", 
                                id_socio AS "idSocio", 
                                id_evento_calendario AS "idEventoCalendario", 
                                desc_inscripcion AS "descInscripcion", 
                                fecha_inscripcion AS "fechaInscripcion", 
                                abonado AS "abonado", 
                                inscripcioncreadoen AS "inscripcionCreadoEn", 
                                estadoinscripcion AS "estadoInscripcion", 
                                inscripcioneditadoen AS "inscripcionEditadoEn"
                            FROM inscripciones
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


module.exports = {

    abonar_x_inscripcion,
    editar_inscripcion,
    inscribirse_a_evento,
    ver_inscripciones_x_evento,
    inscribirse_a_evento_no_socios,
    abonar_x_inscripcion_no_socio,
    editar_inscripcion_no_socio,
    ver_inscripciones_x_evento_no_socio
}