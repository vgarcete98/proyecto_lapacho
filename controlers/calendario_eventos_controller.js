const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const estados_evento = [ 'ACTIVO', 'ELIMINADO', 'SUSPENDIDO' ]



const asignar_evento_calendario = async ( req = request, res = response ) =>{

    // CREA UN NUEVO EVENTO EN EL CALENDARIO
    const { tipo_evento, fecha_desde, fecha_hasta, costo } = req.body;

    try {
        const fecha_creacion = new Date();
        const nuevo_evento = await prisma.calendario_eventos.create( { 
                                                                        data : {
                                                                            id_tipo_evento : tipo_evento,
                                                                            fecha_desde_evento : fecha_desde,
                                                                            fecha_hasta_evento : fecha_hasta,
                                                                            costo,
                                                                            eventocreadoen : fecha_creacion
                                                                        } 
                                                                    } );
        res.status( 200 ).json( {
            status : true, 
            msg : 'Evento insertado en calendario',
            nuevo_evento
        } );
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'Ha ocurrido un error al crear el evento en el calendario',
            error
        } );        
    }


}



const obtener_eventos_x_fecha_calendario = async ( req = request, res = response ) =>{

    // OBTIENE TODOS LOS EVENTOS DEL MES EN EL CALENDARIO
    try {
            const eventos_del_mes = await prisma.$queryRaw`SELECT A.ID_EVENTO_CALENDARIO, B.DESC_TIPO_EVENTO AS DESC_EVENTO, A.COSTO AS COSTO_INSCRIPCION,
                                                            A.FECHA_DESDE_EVENTO AS FECHA_INICIO, A.FECHA_HASTA_EVENTO AS FECHA_FIN
                                                        FROM CALENDARIO_EVENTOS A JOIN EVENTOS B ON A.ID_TIPO_EVENTO = B.ID_TIPO_EVENTO
                                                    WHERE EXTRACT ( MONTH FROM A.FECHA_DESDE_EVENTO ) = EXTRACT ( MONTH FROM CURRENT_DATE )
                                                            AND A.ESTADO_EVENTO = 'ACTIVO';`

    if ( eventos_del_mes.length === 0 ) {
        // NO HAY EVENTOS EN ESTE MES
        res.status( 200 ).json( {
            status : false,
            msg : "No hay eventos registrados hasta el momento",
            cantidad_registros : eventos_del_mes.length,
            eventos_del_mes

        } );

    }else {
        res.status( 200 ).json( {
            status : true,
            msg : "Eventos registrados hasta el momento",
            cantidad_registros : eventos_del_mes.length,
            eventos_del_mes

        } );

    }      
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {  
            status : false,
            msg : 'Ha ocurrido un error al procesar la consulta',
            error
        } );
    }


}




const obtener_eventos_calendario = async ( req = request, res = response ) =>{

    // OBTIENE TODOS LOS EVENTOS DEL AÑO
    const eventos_del_mes = await prisma.$queryRaw`SELECT A.ID_EVENTO_CALENDARIO, B.DESC_TIPO_EVENTO AS DESC_EVENTO, A.COSTO AS COSTO_INSCRIPCION,
                                                            A.FECHA_DESDE_EVENTO AS FECHA_INICIO, A.FECHA_HASTA_EVENTO AS FECHA_FIN
                                                        FROM CALENDARIO_EVENTOS A JOIN EVENTOS B ON A.ID_TIPO_EVENTO = B.ID_TIPO_EVENTO
                                                    WHERE EXTRACT ( YEAR FROM A.FECHA_DESDE_EVENTO ) = EXTRACT ( YEAR FROM CURRENT_DATE )
                                                        AND A.ESTADO_EVENTO = 'ACTIVO';`

    if ( eventos_del_mes.length === 0 ) {
        // NO HAY EVENTOS EN ESTE MES
        res.status( 200 ).json( {
            status : false,
            msg : "No hay eventos registrados hasta el momento",
            cantidad_registros : eventos_del_mes.length,
            eventos_del_mes

        } );

    }else {
        res.status( 200 ).json( {
            status : true,
            msg : "Eventos registrados hasta el momento",
            cantidad_registros : eventos_del_mes.length,
            eventos_del_mes

        } );

    }

}


const borrar_evento_calendario = async ( req = request, res = response ) =>{

    // HABRIA QUE VER COMO PROCEDER PARA EL BORRADO PERO EN SINTESIS MEJOR POR UN QUERY PARAM
    const { evento_a_borrar } = req.query;

    const fecha_borrado = new Date();

    const borrado_evento = await prisma.$executeRaw`UPDATE public.calendario_eventos
                                                        SET eventoeditadoen= ${ fecha_borrado }, estadoevento= ${ estados_evento [1] }
                                                    WHERE id_evento_calendario = ${ evento_a_borrar };`
    if ( borrado_evento > 0 ){
        res.status( 200 ).json( {
            status : true,
            msg : "Evento BORRADO",
            cantidad_registros : borrado_evento
        } );
    } else {
        res.status( 200 ).json( {
            status : false,
            msg : "Evento no BORRADO",
            cantidad_registros : borrado_evento
        } );
    }


}


const actualizar_evento_calendario = async ( req = request, res = response ) =>{


    // HABRIA QUE VER COMO PROCEDER PARA EL BORRADO PERO EN SINTESIS MEJOR POR UN QUERY PARAM
    const { id_evento, fecha_nueva_desde, fecha_nueva_hasta,
            estado_evento, costo_nuevo } = req.body;

    const fecha_actualizacion = new Date();

    const actualizacion_evento = await prisma.$executeRaw`UPDATE public.calendario_eventos
                                                        SET eventoeditadoen= ${ fecha_actualizacion }, estadoevento= ${ estado_evento },
                                                            costo = ${ costo_nuevo }, fecha_desde_evento = ${ fecha_nueva_desde },
                                                            fecha_hasta_evento = ${ fecha_nueva_hasta }
                                                    WHERE id_evento_calendario = ${ id_evento };`

    if( actualizacion_evento > 0 ){
        res.status( 200 ).json( {
            status : true,
            msg : "Evento ACTUALIZADO",
            cantidad_registros : borrado_evento
        } );
    }else {
        res.status( 200 ).json( {
            status : false,
            msg : "Evento no ACTUALIZADO",
            cantidad_registros : borrado_evento
        } );
    }

}





module.exports = {
    asignar_evento_calendario,
    obtener_eventos_calendario,
    borrar_evento_calendario,
    actualizar_evento_calendario,
    obtener_eventos_x_fecha_calendario

}