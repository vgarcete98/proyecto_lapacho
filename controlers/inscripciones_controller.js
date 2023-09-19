
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const inscribirse_a_evento = async ( req = request, res = response ) =>{

    // NECESITO REGISTRAR UNA INSCRIPCION 
    const { id_socio, id_evento, abonado } = req.body;
    const fecha_inscripcion = new Date(); // La fecha en la que se inscribio el socio
    
    // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
    try {
        const nueva_inscripcion = await prisma.inscripciones.create( { 
                                                                        data : {
                                                                            id_socio,
                                                                            id_evento_calendario : id_evento,
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
            nueva_inscripcion,
            error

        } );
    }


}


const inscribirse_a_evento_no_socios = async ( req = request, res = response ) =>{

    // NECESITO REGISTRAR UNA INSCRIPCION 
    const { id_evento, nombre_jugador, abonado,  } = req.body;
    const fecha_inscripcion = new Date(); // La fecha en la que se inscribio el socio
    
    // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
    try {
        const nueva_inscripcion = await prisma.inscripciones_no_socios.create( { 
                                                                                    data : {
                                                                                        id_evento_calendario_no_socio : id_evento,
                                                                                        nombre_jugador,
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


}



const abonar_x_inscripcion = async ( req = request, res = response ) =>{

    const { id_inscripcion } = req.query;
    
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
            inscripcion_abonada
        } );
                
    }

}

const ver_inscripciones_x_evento = async ( req = request, res = response ) =>{

    const { id_evento } = req.query;

    try {
        
        const inscripciones = await prisma.inscripciones.findMany( {
                                                                    where : { id_evento_calendario : id_evento }
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
            cant_inscripciones : 0
        } );

    }


}



module.exports = {

    abonar_x_inscripcion,
    editar_inscripcion,
    inscribirse_a_evento,
    ver_inscripciones_x_evento,
    inscribirse_a_evento_no_socios
}