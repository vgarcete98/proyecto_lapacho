const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();

const estados_evento = [ 'ACTIVO', 'ELIMINADO', 'SUSPENDIDO' ]



const asignar_evento_calendario = async ( req = request, res = response ) =>{

    // CREA UN NUEVO EVENTO EN EL CALENDARIO
    const { tipoEvento, fechaDesde, fechaHasta, costo, descripcion } = req.body;

    const [ fecha_desde_convertido, fecha_hasta_convertido ] = [ generar_fecha( fechaDesde ), generar_fecha( fechaHasta ) ];
    const costo_evento = costo;
    //const descripcion_evento = descripcion;
    try {
        const fecha_creacion = new Date();
        const nuevo_evento = await prisma.calendario_eventos.create( { 
                                                                        data : {
                                                                            id_tipo_evento : tipoEvento,
                                                                            fecha_desde_evento : fecha_desde_convertido,
                                                                            fecha_hasta_evento : fecha_hasta_convertido,
                                                                            costo : costo_evento,
                                                                            decripcion_evento : descripcion,
                                                                            eventocreadoen : fecha_creacion,
                                                                            estadoevento : 'ACTIVO'
                                                                        } 
                                                                    } );
        const { fecha_desde_evento, fecha_hasta_evento, costo, decripcion_evento  } = nuevo_evento;
        res.status( 200 ).json( {
            status : true, 
            msg : 'Evento insertado en calendario',
            nuevoEvento : {
                fechaDesde : fecha_desde_evento,
                fechaHasta : fecha_hasta_evento,
                descripcion : decripcion_evento,
                costo,
                idTipoEvento : tipoEvento
            }
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
        const eventos_del_mes = await prisma.$queryRaw`SELECT CAST ( A.ID_EVENTO_CALENDARIO AS INTEGER ) AS ID_EVENTO_CALENDARIO, 
                                                                B.DESC_TIPO_EVENTO AS DESC_EVENTO, A.COSTO AS COSTO_INSCRIPCION,
                                                                A.FECHA_DESDE_EVENTO AS FECHA_INICIO, A.FECHA_HASTA_EVENTO AS FECHA_FIN
                                                        FROM CALENDARIO_EVENTOS A JOIN EVENTOS B ON A.ID_TIPO_EVENTO = B.ID_TIPO_EVENTO
                                                            WHERE EXTRACT ( MONTH FROM A.FECHA_DESDE_EVENTO ) = EXTRACT ( MONTH FROM CURRENT_DATE )
                                                            AND A.ESTADOEVENTO = 'ACTIVO';`

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
    const eventos_del_mes = await prisma.$queryRaw`SELECT CAST( A.ID_EVENTO_CALENDARIO AS INTEGER) AS ID_EVENTO_CALENDARIO, 
                                                            B.DESC_TIPO_EVENTO AS DESC_EVENTO, A.COSTO AS COSTO_INSCRIPCION,
                                                            A.FECHA_DESDE_EVENTO AS FECHA_INICIO, A.FECHA_HASTA_EVENTO AS FECHA_FIN
                                                        FROM CALENDARIO_EVENTOS A JOIN EVENTOS B ON A.ID_TIPO_EVENTO = B.ID_TIPO_EVENTO
                                                    WHERE EXTRACT ( YEAR FROM A.FECHA_DESDE_EVENTO ) = EXTRACT ( YEAR FROM CURRENT_DATE )
                                                        AND A.ESTADOEVENTO = 'ACTIVO';`

    if ( eventos_del_mes.length === 0 ) {
        // NO HAY EVENTOS EN ESTE MES
        res.status( 200 ).json( {
            status : false,
            msg : "No hay eventos registrados hasta el momento",
            cantidadRegistros : eventos_del_mes.length,
            eventosDelMes : []

        } );

    }else {
        const eventosDelMes = eventos_del_mes.map( ( element )=>{
            const { id_evento_calendario, desc_evento, costo_inscripcion, fecha_inicio, fecha_fin } = element;
            
            return {
                idEventoCalendario : id_evento_calendario,
                descEvento : desc_evento,
                costoInscripcion : costo_inscripcion,
                fechainicio : fecha_inicio,
                fechaFin : fecha_fin
            };
        } );
        res.status( 200 ).json( {
            status : true,
            msg : "Eventos registrados hasta el momento",
            cantidadRegistros : eventos_del_mes.length,
            eventosDelMes

        } );

    }

}


const borrar_evento_calendario = async ( req = request, res = response ) =>{

    // HABRIA QUE VER COMO PROCEDER PARA EL BORRADO PERO EN SINTESIS MEJOR POR UN QUERY PARAM
    
    const { id_evento } = req.params;

    const fecha_borrado = new Date();
    try {
        //---------------------------------------------------------------------------------------------------------------------------------
        /*const borrado_evento = await prisma.$executeRaw`UPDATE public.calendario_eventos
                                                            SET eventoeditadoen= ${ fecha_borrado }, estadoevento= ${ estados_evento [1] }
                                                        WHERE id_evento_calendario = ${ Number(id_evento) };`*/
        const borrado_evento = await prisma.calendario_eventos.update( { 
                                                                            where : { id_evento_calendario : Number(id_evento) },
                                                                            data : {
                                                                                estadoevento : estados_evento [1],
                                                                                eventoeditadoen : fecha_borrado
                                                                            } 
                                                                    } );
        //---------------------------------------------------------------------------------------------------------------------------------    
        const { costo, decripcion_evento, estadoevento, 
                fecha_desde_evento, fecha_hasta_evento, } = borrado_evento;
        const costo_eliminado = costo;
        if ( borrado_evento === null || borrado_evento === undefined ){
            res.status( 200 ).json( {
                status : true,
                msg : "Evento no BORRADO",
                //cantidad_registros : borrado_evento
                eventoBorrado : {
                    costo_eliminado : costo, 
                    descripcion: decripcion_evento, 
                    estadoEvento : estadoevento, 
                    fechaDesdeEvento : fecha_desde_evento, 
                    fechaHastaEvento : fecha_hasta_evento
                }
            } );
        } else {

            res.status( 200 ).json( {
                status : true,
                msg : "Evento BORRADO",
                //cantidad_registros : borrado_evento
                eventoBorrado : {
                    costo_eliminado : costo, 
                    descripcion: decripcion_evento, 
                    estadoEvento : estadoevento, 
                    fechaDesdeEvento : fecha_desde_evento, 
                    fechaHastaEvento : fecha_hasta_evento
                }
            } );
        }    
    } catch (error) {
        console.log( error );
        res.status( 200 ).json( {
            status : false,
            msg : "No se pudo borrar el evento",
            error
        } );
    }



}


const actualizar_evento_calendario = async ( req = request, res = response ) =>{


    // HABRIA QUE VER COMO PROCEDER PARA EL BORRADO PERO EN SINTESIS MEJOR POR UN QUERY PARAM
    const { id_evento } = req.params;
    const { fechaNuevaDesde, fechaNuevaHasta, idTipoEvento,
            estadoEvento, costoNuevo } = req.body;
    console.log( fechaNuevaDesde, fechaNuevaHasta )
    const fecha_actualizacion = new Date();

    try {
        const actualizacion_evento = await prisma.$executeRaw`UPDATE public.calendario_eventos
                                                    SET eventoeditadoen= ${ fecha_actualizacion }, estadoevento= ${ estadoEvento },
                                                        costo = ${ costoNuevo }, fecha_desde_evento = ${ fechaNuevaDesde },
                                                        fecha_hasta_evento = ${ fechaNuevaHasta }
                                                WHERE id_evento_calendario = ${ Number(id_evento) };`

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
    } catch (error) {

        console.log ( error );

        res.status( 200 ).json( {
            status : false,
            msg : "Evento no ACTUALIZADO",
            error
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