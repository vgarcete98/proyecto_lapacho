const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();



const verificar_existe_clase_agendada_para_reserva = async ( req = request, res = response, next)=> {

    try {
        
        const { horaDesde, horaHasta, idMesa } = req.body;
        const test_clase_query = `SELECT 1 
                                        FROM AGENDAMIENTO_CLASE A 
                                    WHERE (A.horario_inicio, A.horario_hasta) overlaps ('${ horaDesde }'::TIMESTAMP, '${ horaHasta }'::TIMESTAMP)
                                    AND  A.id_mesa = ${ idMesa }`;
        console.log( test_clase_query )                           
        const clases_query = await prisma.$queryRawUnsafe(test_clase_query);       
        if ( clases_query.length > 0 ){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay una clase existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa, Hay una clase existente en ese horario"
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            next()
        }
    } catch (error) {
        
        res.status( 400 ).json( {
            status : false,
            msg : `No se pudo verificar si existe una clase en el horario, error : ${error}`,
            //nuevoIngreso
        } );
    }




}



const verificar_existe_evento_agendado_para_reservas = async ( req = request, res = response, next)=> {

    try {
        
        const { horaDesde, horaHasta } = req.body;
        const test_evento_query = `SELECT 1 
                                        FROM EVENTOS A 
                                    WHERE ( A.FECHA_DESDE_EVENTO, A.FECHA_HASTA_EVENTO ) 
                                        OVERLAPS ('${ horaDesde }'::TIMESTAMP, '${ horaHasta }'::TIMESTAMP) `;
        console.log( test_evento_query )
        const evento_query = await prisma.$queryRawUnsafe(test_evento_query);
        if ( evento_query.length > 0){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay un evento existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa y horario, Hay un evento existente en ese horario"
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            next()
        }
    } catch (error) {
        
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
        const test_evento_query = `SELECT 1 
                                        FROM EVENTOS A 
                                    WHERE ( A.FECHA_DESDE_EVENTO, A.FECHA_HASTA_EVENTO ) 
                                        OVERLAPS ('${ inicio }'::TIMESTAMP, '${ fin }'::TIMESTAMP) `;
        console.log( test_evento_query )
        const evento_query = await prisma.$queryRawUnsafe(test_evento_query);
        if ( evento_query.length > 0){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay un evento existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa y horario, Hay un evento existente en ese horario"
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            next()
        }
    } catch (error) {
        
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

        const test_evento_query = `SELECT 1 
                                        FROM RESERVAS A 
                                    WHERE ( A.HORA_DESDE, A.HORA_HASTA ) 
                                        OVERLAPS ('${ inicio }'::TIMESTAMP, '${ fin }'::TIMESTAMP) `;
        console.log( test_evento_query )
        const evento_query = await prisma.$queryRawUnsafe(test_evento_query);
        if ( evento_query.length > 0){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay una reserva existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa y horario, Hay una reserva existente en ese horario"
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
            next()
        }
    } catch (error) {
        
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
        const test_evento_query = `SELECT 1 
                                        FROM EVENTOS A 
                                    WHERE ( A.FECHA_DESDE_EVENTO, A.FECHA_HASTA_EVENTO ) 
                                        OVERLAPS ('${ horaDesde }'::TIMESTAMP, '${ horaHasta }'::TIMESTAMP) `;
        console.log( test_evento_query )
        const evento_query = await prisma.$queryRawUnsafe(test_evento_query);
        if ( evento_query.length > 0){
            res.status( 400 ).json( {
                status : false,
                msg : "Hay un evento existente en ese horario",
                descripcion : "Favor realizar el cambio de mesa y horario, Hay un evento existente en ese horario"
                //claseAgendada
            } );
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        } else {
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