const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();



const verificar_existe_clase_agendada_para_reserva = async ( req = request, res = response, next)=> {

    try {
        
        const { horaDesde, horaHasta } = req.body;

        const clase = await prisma.agendamiento_clase.findFirst( { 
                                                                    where : {
                                                                        
                                                                        AND :[
                                                                            { horario_hasta : { lte : new Date ( horaHasta ) } },
                                                                            { horario_inicio : { lte : new Date( horaDesde ) } }
                                                                        ] 
                                                                    } 
                                                                } );
        
        if ( clase !== null){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay una clase existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa, Hay una clase existente en ese horario"
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            //console.log ( "clase que coincide, no se puede reservar" );
            next()
        }
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `No se pudo verificar si existe la clase, error : ${error}`,
            //nuevoIngreso
        } );
    }




}



const verificar_existe_evento_agendado_para_reservas = async ( req = request, res = response, next)=> {

    try {
        
        const { horaDesde, horaHasta } = req.body;

        const evento = await prisma.eventos.findFirst( { 
                                                                    where : {
                                                                        
                                                                        AND :[
                                                                            { fecha_desde_evento : { lte : new Date ( horaHasta ) } },
                                                                            { fecha_hasta_evento : { lte : new Date( horaDesde ) } }
                                                                        ] 
                                                                    } 
                                                                } );
        
        if ( evento !== null){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay un evento existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa y horario, Hay un evento existente en ese horario"
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            //console.log ( "clase que coincide, no se puede reservar" );
            next()
        }
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `No se pudo verificar si existe el evento, error : ${error}`,
            //nuevoIngreso
        } );
    }


}




const verificar_existe_evento_agendado_para_clases = async ( req = request, res = response, next)=> {

    try {
        
        const { inicio, fin } = req.body;

        const evento = await prisma.eventos.findFirst( { 
            where : {
                
                AND :[
                    { fecha_desde_evento : { lte : new Date ( inicio ) } },
                    { fecha_hasta_evento : { lte : new Date( fin ) } }
                ] 
            } 
        } );

        if ( evento !== null ){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay un evento existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa y horario, Hay un evento existente en ese horario"
                //claseAgendada
            } );
        // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            //console.log ( "clase que coincide, no se puede reservar" );
            next()
        }
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
        status : false,
        msg : `No se pudo verificar si existe el evento, error : ${error}`,
        //nuevoIngreso
        } );
    }




}




const verificar_existe_reserva_agendada_para_clases = async ( req = request, res = response, next)=> {

    try {
        
        const { inicio, fin } = req.body;

        const reserva = await prisma.reservas.findFirst( { 
            where : {
                
                AND :[
                    { hora_desde : { lte : new Date ( inicio ) } },
                    { hora_hasta : { lte : new Date( fin ) } }
                ] 
            } 
        } );

        if ( reserva !== null ){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay un evento existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa y horario, Hay un evento existente en ese horario"
                //claseAgendada
            } );
        // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            //console.log ( "clase que coincide, no se puede reservar" );
            next()
        }
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
        status : false,
        msg : `No se pudo verificar si existe el evento, error : ${error}`,
        //nuevoIngreso
        } );
    }




}





const verificar_existe_evento_agendado_para_reservas_express = async ( req = request, res = response, next)=> {

    try {
        
        const { horaDesde, horaHasta, tipoIngreso } = req.body;

        const evento = await prisma.eventos.findFirst( { 
                                                                    where : {
                                                                        
                                                                        AND :[
                                                                            { fecha_desde_evento : { lte : new Date () } },
                                                                            { fecha_hasta_evento : { lte : new Date() } }
                                                                        ] 
                                                                    } 
                                                                } );
        
        if ( evento !== null){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay un evento existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa y horario, Hay un evento existente en ese horario"
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            //console.log ( "clase que coincide, no se puede reservar" );
            next()
        }
    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `No se pudo verificar si existe el evento, error : ${error}`,
            //nuevoIngreso
        } );
    }


}


module.exports = {

    verificar_existe_clase_agendada_para_reserva,
    verificar_existe_reserva_agendada_para_clases,
    verificar_existe_evento_agendado_para_clases,
    verificar_existe_evento_agendado_para_reservas,
    verificar_existe_evento_agendado_para_reservas_express

}