const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();

const estados_evento = [ 'ACTIVO', 'ELIMINADO', 'SUSPENDIDO' ]



const asignar_evento_calendario = async ( req = request, res = response ) =>{

    try {
        // CREA UN NUEVO EVENTO EN EL CALENDARIO
        const { tipoEvento, 
                nombreEvento,
                fechaDesde, 
                fechaHasta, 
                costoEvento,
                todoEldia, 
                descripcion } = req.body;
    
        const nuevo_evento = await prisma.calendario_eventos.create( { 
                                                                        data : {
                                                                            id_tipo_evento : tipoEvento,
                                                                            fecha_desde_evento : generar_fecha( fechaDesde ),
                                                                            fecha_hasta_evento : generar_fecha( fechaHasta ),
                                                                            costo : Number( costoEvento ),
                                                                            decripcion_evento : descripcion,
                                                                            eventocreadoen : new Date(),
                                                                            estadoevento : 'ACTIVO',
                                                                            todo_el_dia : (todoEldia  === "S") ? true : false,
                                                                            nombre_evento : nombreEvento,

                                                                        } 
                                                                    } );
        const { fecha_desde_evento, 
                fecha_hasta_evento, 
                costo, 
                decripcion_evento,
                id_tipo_evento,
                todo_el_dia,
                nombre_evento,
                id_evento_calendario } = nuevo_evento;
        res.status( 200 ).json( {
            status : true, 
            msg : 'Evento insertado en calendario',
            nuevoEvento : {
                fechaDesde : fecha_desde_evento,
                fechaHasta : fecha_hasta_evento,
                descripcion : decripcion_evento,
                costo,
                idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                todoEldia : todo_el_dia,
                nombreEvento : nombre_evento
            }
        } );
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al crear el evento en el calendario ${error} `,
            //error
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
            //error
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
    
    try {

        const { tipoEvento, 
                nombreEvento,
                fechaDesde, 
                fechaHasta, 
                costoEvento,
                todoEldia, 
                descripcion,
                idEvento } = req.body;
    
        const fecha_borrado = new Date();
        //---------------------------------------------------------------------------------------------------------------------------------
        /*const borrado_evento = await prisma.$executeRaw`UPDATE public.calendario_eventos
                                                            SET eventoeditadoen= ${ fecha_borrado }, estadoevento= ${ estados_evento [1] }
                                                        WHERE id_evento_calendario = ${ Number(id_evento) };`*/
        const borrado_evento = await prisma.calendario_eventos.delete( { where : { id_evento_calendario : Number(idEvento) } } );
        //---------------------------------------------------------------------------------------------------------------------------------    
        const { fecha_desde_evento, 
            fecha_hasta_evento, 
            costo, 
            decripcion_evento,
            id_tipo_evento,
            todo_el_dia,
            nombre_evento,
            id_evento_calendario } = borrado_evento;
            
        const costo_eliminado = costo;
        if ( borrado_evento === null || borrado_evento === undefined ){
            res.status( 200 ).json( {
                status : true,
                msg : "Evento no BORRADO",
                //cantidad_registros : borrado_evento
                eventoBorrado : {
                    fechaDesde : fecha_desde_evento,
                    fechaHasta : fecha_hasta_evento,
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    todoEldia : todo_el_dia,
                    nombreEvento : nombre_evento
                }
            } );
        } else {

            res.status( 200 ).json( {
                status : true,
                msg : "Evento BORRADO",
                //cantidad_registros : borrado_evento
                eventoBorrado : {
                    fechaDesde : fecha_desde_evento,
                    fechaHasta : fecha_hasta_evento,
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    todoEldia : todo_el_dia,
                    nombreEvento : nombre_evento
                }
            } );
        }    
    } catch (error) {
        //console.log( error );
        res.status( 200 ).json( {
            status : false,
            msg : `No se pudo borrar el evento  ${ error }`,
            error
        } );
    }



}


const actualizar_evento_calendario = async ( req = request, res = response ) =>{


    
    try {
        // HABRIA QUE VER COMO PROCEDER PARA EL BORRADO PERO EN SINTESIS MEJOR POR UN QUERY PARAM

        const { tipoEvento, 
                nombreEvento,
                fechaDesde, 
                fechaHasta, 
                costoEvento,
                todoEldia, 
                descripcion,
                idEvento,
                idSocio } = req.body;
    
        //console.log( fechaNuevaDesde, fechaNuevaHasta )
        const fecha_actualizacion = new Date();
        const actualizacion_evento = await prisma.calendario_eventos.update( { 
                                                                                where : { id_evento_calendario : Number( idEvento ) },
                                                                                data : {  
                                                                                    costo : costoEvento,
                                                                                    fecha_desde_evento : generar_fecha(fechaDesde),
                                                                                    fecha_hasta_evento : generar_fecha( fechaHasta ),
                                                                                    todo_el_dia : todoEldia,
                                                                                    decripcion_evento : descripcion,
                                                                                    id_tipo_evento : tipoEvento,
                                                                                    nombre_evento : nombreEvento,
                                                                                    eventoeditadoen : new Date(),
                                                                                }
                                                                            } );

        const { fecha_desde_evento, 
                fecha_hasta_evento, 
                costo, 
                decripcion_evento,
                id_tipo_evento,
                todo_el_dia,
                nombre_evento,
                id_evento_calendario } = actualizacion_evento;                                    

        if( actualizacion_evento > 0 ){
            res.status( 200 ).json( {
                status : true,
                msg : "Evento ACTUALIZADO",
                eventoBorrado : {
                    fechaDesde : fecha_desde_evento,
                    fechaHasta : fecha_hasta_evento,
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    todoEldia : todo_el_dia,
                    nombreEvento : nombre_evento
                }
            } );
        }else {
            res.status( 200 ).json( {
                status : false,
                msg : "Evento no ACTUALIZADO",
                eventoBorrado : {
                    fechaDesde : fecha_desde_evento,
                    fechaHasta : fecha_hasta_evento,
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    todoEldia : todo_el_dia,
                    nombreEvento : nombre_evento
                }
            } );
        }   
    } catch (error) {

        console.log ( error );

        res.status( 200 ).json( {
            status : false,
            msg : `Evento no ACTUALIZADO  ${ error }`,
            error
        } );    
    }



}




const obtener_inscripciones_x_evento = async ( req = request, res = response ) =>{


    try {
        // ACA TENGO QUE OBTENER TODAS LAS INSCRIPCIONES, YA SEAN SOCIOS O NO
        const { id_evento } = req.params;

        const query_inscripciones_socios = `SELECT A.id_inscripcion, A.id_socio, B.nombre_cmp, A.fecha_inscripcion, 
                                                    A.desc_inscripcion, CASE A.abonado WHEN True THEN 'Si' ELSE 'No' END AS pagado
                                                    FROM INSCRIPCIONES A JOIN SOCIO B ON A.id_socio = B.id_socio
                                                    JOIN CALENDARIO_EVENTOS C ON A.id_evento_calendario = C.id_evento_calendario
                                                WHERE A.id_evento_calendario = ${ Number( id_evento ) }`;
        let inscripciones_socios, inscripcionesSocios = [];


        inscripciones_socios = await prisma.$queryRawUnsafe( query );
        
        if ( inscripciones_socios.length > 0 ) {

            inscripciones_socios.forEach( ( element )=>{
                //const { id_inscripcion, id_socio, nombre_cmp, fecha_inscripcion,  } = element;
    
                inscripcionesSocios.push( { 
                    idInscripcion : element.id_inscripcion,
                    idSocio : element.id_socio,
                    nombreCmp : element.nombre_cmp,
                    fechaInscripcion : fecha_inscripcion,
                    descripcion : element.desc_inscripcion,
                    pagado : element.pagado
                } );
    
            } );
        }


        res.status( 200 ).json( {
            status : true,
            msg : "Inscripciones del evento ",
            inscripcionesSocios
        } );

    } catch (error) {
        console.log( error );


        res.status( 500 ).json( {

            status : true,
            msg : "Ha ocurrido un error al obtener las inscripciones "
        } );
        
    }


}



const obtener_inscripciones_x_evento_no_socios = async ( req = request, res = response ) =>{


    try {

        //AHORA LAS INSCRIPCIONES DE LOS NO SOCIOS
        const inscripciones_no_socios = await prisma.inscripciones_no_socios.findMany( { where : { id_evento_calendario_no_socio : Number( id_evento ) } } );
        let inscripcionesNoSocios = [];

        if ( inscripciones_no_socios.length > 0 ){
            inscripciones_no_socios.forEach( ( element ) => { 

                inscripcionesNoSocios.push( {

                    idInscripcion : element.id_inscripcion_no_socio,
                    nombreCmp : element.nombre_jugador,
                    fechaInscripcion : fecha_inscripcion,
                    descripcion : element.desc_inscripcion,
                    pagado : (element.abonado === true) ? 'Si' : 'No'
                    
                } );
                
            });


        }

        res.status( 200 ).json( {
            status : true,
            msg : "Inscripciones del evento ",
            inscripcionesNoSocios
        } );


    } catch (error) {
        console.log( error );

        res.status( 500 ).json( {

            status : true,
            msg : "Ha ocurrido un error al obtener las inscripciones "
        } );
        
    }


}






const obtener_tipos_de_evento = async (req = request, res = response)=>{

    try {

        const tipos_evento = await prisma.eventos.findMany();

        const { id_tipo_evento, desc_tipo_evento, color } = tipos_evento;

        const tiposEventos = tipos_evento.map( ( element )=>{
            const { id_tipo_evento, desc_tipo_evento, color } = element;

            return { 
                idTipoEvento : (typeof(id_tipo_evento) ==='bigint') ? Number(id_tipo_evento.toString()) : id_tipo_evento ,
                descTipoEvento : desc_tipo_evento,
                color
            };
        } );

        res.status( 200 ).json( {
            status : true,
            msg : "Tipos de evento disponibles",
            tiposEventos
        } );

        
    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `Ha ocurrido un error al obtener las inscripciones : ${error}`
        } );
    }






}




const obtener_eventos_del_mes = async (req  =request, res = response)=>{

    try {

        const { mes } = req.query;        
        const annio = new Date().getFullYear();
        const [ fecha_desde_mes, fecha_hasta_mes ] = [ new Date(annio, mes - 1, 1), new Date(annio, mes, 0) ]
        console.log( fecha_desde_mes, fecha_hasta_mes )
        const eventos = await prisma.calendario_eventos.findMany( { 
                                                                    where : {  

                                                                            fecha_desde_evento : { 
                                                                                gte : fecha_desde_mes
                                                                            },
                                                                            fecha_hasta_evento : {
                                                                                lte : fecha_hasta_mes
                                                                            }
                                                                    } 
                                                                } );
        //const eventos = await prisma.calendario_eventos.findMany();
        //console.log( eventos );
        const eventosMes =  eventos.map( ( element ) =>{
            console.log( element );
            const { fecha_desde_evento, 
                    fecha_hasta_evento, 
                    costo, 
                    decripcion_evento,
                    id_tipo_evento,
                    todo_el_dia,
                    nombre_evento,
                    id_evento_calendario} = element;

            return {
                fechaDesde : fecha_desde_evento,
                fechaHasta : fecha_hasta_evento,
                descripcion : decripcion_evento,
                costo,
                idTipoEvento : (typeof(id_tipo_evento) === 'bigint')? Number(id_tipo_evento.toString()) : id_tipo_evento,
                idEventoCalendario : (typeof(id_evento_calendario) === 'bigint')? Number(id_evento_calendario.toString()) : id_evento_calendario,
                todoEldia : todo_el_dia,
                nombreEvento : nombre_evento
            }
        } );

        res.status( 200 ).json( {
            status : true,
            msg : `Eventos del mes`,
            eventosMes
        } );

    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `Ha ocurrido un error al obtener las inscripciones : ${error}`
        } );
    }



}



module.exports = {
    obtener_tipos_de_evento,
    obtener_eventos_del_mes,
    asignar_evento_calendario,
    obtener_eventos_calendario,
    borrar_evento_calendario,
    actualizar_evento_calendario,
    obtener_eventos_x_fecha_calendario,
    obtener_inscripciones_x_evento,
    obtener_inscripciones_x_evento_no_socios

}