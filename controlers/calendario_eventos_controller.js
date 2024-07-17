const { request, response } = require('express')

var { format  } = require("date-fns");

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();

const estados_evento = [ 'ACTIVO', 'ELIMINADO', 'SUSPENDIDO' ]


const obtener_todos_los_eventos_calendario = async ( req = request, res = response ) =>{

    try {

        //ENDPOINT QUE DEVUELVE TODO, EVENTOSS, RESERVAS Y CLASES DEL MES
        const { fechaDesde, fechaHasta, pagina, idUsuario } = req.body;

        const fecha_desde_format = new Date ( fechaDesde );

        const fecha_hasta_format = new Date ( fechaHasta );   

        //console.log( format( fecha_desde_format, 'yyyy-MM-dd' ), format( fecha_hasta_format, 'yyyy-MM-dd' ) )
        const query_eventos = `SELECT CAST(A.id_evento_calendario AS INTEGER) AS "idEventoCalendario", 
                                        CAST(B.id_tipo_evento AS INTEGER) AS "idTipoEvento", 
                                        A.fecha_desde_evento AS "horaDesde", 
                                        A.eventocreadoen AS "fechaCreacion", 
                                        A.fecha_hasta_evento AS "horaHasta", 
                                        A.costo AS "costo", 
                                        A.decripcion_evento AS "descripcion", 
                                        A.nombre_evento AS "nombreCmp", 
                                        A.todo_el_dia AS "todoEldia", 
                                        --A.fechaagendamiento AS "fechaAgendamiento",
                                        B.desc_tipo_evento AS "descTipoEvento"
                                    FROM calendario_eventos A JOIN EVENTOS B ON A.id_tipo_evento = B.id_tipo_evento
                                    WHERE A.fecha_desde_evento BETWEEN TIMESTAMP '${ format( fecha_desde_format, 'yyyy-MM-dd' ) }' 
                                                                        AND TIMESTAMP '${ format( fecha_hasta_format, 'yyyy-MM-dd' ) }';`
        const eventosMes =  await prisma.$queryRawUnsafe( query_eventos );  



        const query = `SELECT  CAST(A.id_agendamiento AS INTEGER) AS "idAgendamiento", 
                                B.id_profesor AS "idProfesor", 
                                B.nombre_profesor AS "nombreProfesor", 
                                CAST(A.id_socio AS INTEGER) AS "idSocio", 
                        		D.nombre_cmp AS "nombreCmp", 
                                --A.fecha_agendamiento AS "fechaAgendamiento", 
                                CAST(C.id_mesa AS INTEGER) AS "idMesa", 
                                C.desc_mesa AS "descMesa", 
                        		A.horario_inicio AS "horarioInicio", 
                                A.horario_hasta AS "horarioHasta", 
                                A.clase_abonada AS "claseAgendada", 
                                A.monto_abonado AS "montoAbonado",
                                A.creadoen AS "fechaCreacion"
                        	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                        	JOIN mesas C ON C.id_mesa = A.id_mesa
                        	JOIN socio D ON D.id_socio = A.id_socio
                        WHERE A.fecha_agendamiento BETWEEN TIMESTAMP '${ format( fecha_desde_format, 'yyyy-MM-dd' ) }' 
                                                        AND TIMESTAMP '${ format( fecha_hasta_format, 'yyyy-MM-dd' ) }'
                        ORDER BY A.fecha_agendamiento DESC`;
        //console.log( query );
        let clasesDelDia = [];
        clasesDelDia = await prisma.$queryRawUnsafe( query );  


        const query2 = `SELECT CAST(A.id_socio_reserva AS INTEGER) AS "idSocioReserva", 
                        		C.nombre || ', ' || C.apellido AS "nombreCmp",
                        		--A.fecha_reserva AS "fechaAgendamiento",
                        		A.fecha_creacion AS "fechaCreacion",
                        		A.hora_desde AS "horaDesde",
                        		A.hora_hasta AS "horaHasta",
                        		D.desc_mesa AS "descMesa",
                        		CAST(D.id_mesa AS INTEGER) AS "idMesa"
                        	FROM RESERVAS A JOIN SOCIO B ON A.id_socio = B.id_socio
                        	JOIN PERSONA C ON C.id_persona = B.id_persona
                        	JOIN MESAS D ON D.id_mesa = A.id_mesa
                            JOIN PERSONA F ON F.id_persona = B.id_persona
                        WHERE A.fecha_reserva BETWEEN TIMESTAMP  '${format( fecha_desde_format, 'yyyy-MM-dd' )}' 
                                                    AND TIMESTAMP '${format( fecha_hasta_format, 'yyyy-MM-dd' )}'
                        ORDER BY A.fecha_reserva DESC`;
        //console.log( query );
        const reservasClub = await prisma.$queryRawUnsafe( query2 );

        //console.log(  eventosMes, clasesDelDia, reservasClub )

        res.status( 200 ).json( {
            status : true, 
            msg : 'Todos los eventos en las fechas',
            eventosFecha : {
                eventos : eventosMes,
                clases : clasesDelDia,
                reservas : reservasClub
            }
        } );



        
    } catch (error) {
                //console.log( error );
                res.status( 500 ).json( {
                    status : false,
                    msg : `Ha ocurrido un error al obtener todo lo del mes ${error} `,
                    //error
                } );        
    }



}



const obtener_categorias_x_evento = async ( req = request, res = response ) =>{

    try {
        
        const { id_evento } = req.query;
        const categorias = await prisma.categorias.findMany( { where : { id_evento_calendario : Number( id_evento ) } } )

        let categoriasEvento = [];


        categorias.forEach( ( element ) =>{
            const { descripcion, id_categoria, nombre_categoria, id_evento_calendario } = element;

            categoriasEvento.push( {
                descripcion, 
                idCategoria : id_categoria, 
                nombreCategoria : nombre_categoria, 
                idEventoCalendario : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario) 
            } )
        } )
        console.log( categoriasEvento )
        
        res.status( 200 ).json( {
            status : true,
            msg : "Eventos registrados hasta el momento",
            categoriasEvento,
            cantidad : categoriasEvento.length

        } );


    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al crear el evento en el calendario ${error} `
            //error
        } );   
    }   

}



const crear_categorias_x_evento = async ( req = request, res = response ) =>{

    try {
        
        const { descripcionCategoria, idCategoria, nombreCategoria, idEventoCalendario  } = req.body;
        const { descripcion, id_categoria, nombre_categoria, id_evento_calendario } = await prisma.categorias.create( {
                                                                                                                        data : { 
                                                                                                                            descripcion : descripcionCategoria, 
                                                                                                                            id_categoria : idCategoria, 
                                                                                                                            nombre_categoria : nombreCategoria, 
                                                                                                                            id_evento_calendario : idEventoCalendario
                                                                                                                        } 
                                                                                                                    } );

        let categoriaEvento = { descripcion, 
                                    idCategoria : id_categoria, 
                                    nombreCategoria : nombre_categoria, 
                                    idEventoCalendario : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario)
                            };
                            
        res.status( 200 ).json( {
            status : true,
            msg : "Categoria creada con exito",
            categoriaEvento

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


const editar_categorias_x_evento = async ( req = request, res = response ) =>{
    try {
        
        const { descripcionCategoria, idCategoria, nombreCategoria, idEventoCalendario  } = req.body;
        const { descripcion, id_categoria, nombre_categoria, id_evento_calendario } = await prisma.categorias.update( {
                                                                                                                        data : { 
                                                                                                                            descripcion : descripcionCategoria, 
                                                                                                                            id_categoria : idCategoria, 
                                                                                                                            nombre_categoria : nombreCategoria, 
                                                                                                                            id_evento_calendario : idEventoCalendario
                                                                                                                        },
                                                                                                                        where : { 
                                                                                                                            id_categoria : Number( idCategoria )
                                                                                                                        }
                                                                                                                    } );

        let categoriaEvento = { descripcion, 
                                    idCategoria : id_categoria, 
                                    nombreCategoria : nombre_categoria, 
                                    idEventoCalendario : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario)
                            };
                            
        res.status( 200 ).json( {
            status : true,
            msg : "Categoria editada con exito",
            categoriaEvento

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



const eliminar_categorias_x_evento = async ( req = request, res = response ) =>{

    try {
        
        const { descripcionCategoria, idCategoria, nombreCategoria, idEventoCalendario  } = req.body;
        const { descripcion, id_categoria, nombre_categoria, id_evento_calendario } = await prisma.categorias.delete( {
                                                                                                                        data : { 
                                                                                                                            descripcion : descripcionCategoria, 
                                                                                                                            id_categoria : idCategoria, 
                                                                                                                            nombre_categoria : nombreCategoria, 
                                                                                                                            id_evento_calendario : idEventoCalendario
                                                                                                                        },
                                                                                                                        where : { 
                                                                                                                            id_categoria : Number( idCategoria )
                                                                                                                        }
                                                                                                                    } );

        let categoriaEvento = { descripcion, 
                                    idCategoria : id_categoria, 
                                    nombreCategoria : nombre_categoria, 
                                    idEventoCalendario : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario)
                            };
                            
        res.status( 200 ).json( {
            status : true,
            msg : "Categoria eliminada con exito",
            categoriaEvento

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


const asignar_evento_calendario = async ( req = request, res = response ) =>{

    try {
        // CREA UN NUEVO EVENTO EN EL CALENDARIO
        const { tipoEvento, 
                nombreEvento,
                horaDesde, 
                horaHasta, 
                costoEvento,
                todoEldia, 
                descripcion,
                categorias,
                requerimientos
                /*fechaAgendamiento*/ } = req.body;
    
        const nuevo_evento = await prisma.calendario_eventos.create( { 
                                                                        data : {
                                                                            id_tipo_evento : tipoEvento,
                                                                            fecha_desde_evento : new Date( horaDesde ),
                                                                            fecha_hasta_evento : new Date( horaHasta ),
                                                                            costo : Number( costoEvento ),
                                                                            decripcion_evento : descripcion,
                                                                            eventocreadoen : new Date(),
                                                                            estadoevento : 'ACTIVO',
                                                                            todo_el_dia : (todoEldia  === "S") ? true : false,
                                                                            nombre_evento : nombreEvento,
                                                                            //fechaagendamiento : generar_fecha( fechaAgendamiento )

                                                                        } 
                                                                    } );
        const { fecha_desde_evento, 
                fecha_hasta_evento, 
                costo, 
                decripcion_evento,
                id_tipo_evento,
                todo_el_dia,
                nombre_evento,
                id_evento_calendario,
                eventocreadoen,
                fechaagendamiento } = nuevo_evento;

        let cat= [], 
            reque = [];
        const idEventoCalendario = (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario;
        if ( Number( tipoEvento )  === 5 ) { 

            //QUIERE DECIR QUE SE TRATA DE UN TORNEO
            categorias.forEach( async ( element ) => {


                const { descripcion, nombreCategoria } = element;
                //reque.push( { descripcion, cantidad,  } )
                const nuevo_categoria  = await prisma.categorias.create( { 
                                                                                    data : { 
                                                                                        descripcion,
                                                                                        nombre_categoria : nombreCategoria,
                                                                                        id_evento_calendario : Number( idEventoCalendario )
                                                                                    } 
                                                                                } );


                cat.push( {
                    descripcion : nuevo_categoria.descripcion,
                    nombreCategoria : nuevo_categoria.nombre_categoria,
                    idEventoCalendario : nuevo_categoria.id_evento_calendario
                } )


            } )


            requerimientos.forEach( async ( element ) => {


                const { descripcion, cantidad, costoUnidad } = element;
                //reque.push( { descripcion, cantidad,  } )
                const nuevo_requerimiento  = await prisma.requerimientos.create( { 
                                                                                    data : { 
                                                                                        cantidad, 
                                                                                        costo_unidad : Number( costoUnidad ), 
                                                                                        descripcion, 
                                                                                        id_evento_calendario : Number( idEventoCalendario )
                                                                                    } 
                                                                                } );


                reque.push( {
                    descripcion : nuevo_requerimiento.descripcion,
                    cantidad : nuevo_requerimiento.cantidad,
                    costo : nuevo_requerimiento.costo_unidad,
                    idRequerimiento : nuevo_requerimiento.id_requerimiento
                } )
            } )



        }
        


        res.status( 200 ).json( {
            status : true, 
            msg : 'Evento insertado en calendario',
            nuevoEvento : {
                //------------------------------------------------------------------------------------------------------------------------
                idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                nombreCmp : nombre_evento,
                //fechaAgendamiento : fechaagendamiento,
                fechaCreacion : eventocreadoen,
                horaDesde : fecha_desde_evento,
                horaHasta : fecha_hasta_evento,
                //------------------------------------------------------------------------------------------------------------------------
                descripcion : decripcion_evento,
                costo,
                idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                todoEldia : todo_el_dia,
                categorias : cat,
                requerimientos : reque
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
        //console.log( error );
        res.status( 500 ).json( {  
            status : false,
            msg : `Ha ocurrido un error al procesar la consulta ${ error }`,
            //error
        } );
    }


}




const obtener_eventos_calendario = async ( req = request, res = response ) =>{

    try {
        const { annio } = req.query;        
        const [ fecha_desde_mes, fecha_hasta_mes ] = [ new Date(annio, 0, 1), new Date(annio, 12, 0) ]
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
        const eventosMes =  eventos.map( ( element ) =>{
            const { fecha_desde_evento, 
                    fecha_hasta_evento, 
                    costo, 
                    decripcion_evento,
                    id_tipo_evento,
                    todo_el_dia,
                    nombre_evento,
                    id_evento_calendario,
                    eventocreadoen,
                    fechaagendamiento } = element;

            return {
                //------------------------------------------------------------------------------------------------------------------------
                idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                nombreCmp : nombre_evento,
                //fechaAgendamiento : fechaagendamiento,
                fechaCreacion : eventocreadoen,
                horaDesde : fecha_desde_evento,
                horaHasta : fecha_hasta_evento,
                //------------------------------------------------------------------------------------------------------------------------
                descripcion : decripcion_evento,
                costo,
                idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                todoEldia : todo_el_dia,
            }
        } );

        res.status( 200 ).json( {
            status : true,
            msg : `Eventos del año`,
            eventosMes
        } );

    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `Ha ocurrido un error al obtener los eventos del año : ${error}`
        } );
    }


}


const borrar_evento_calendario = async ( req = request, res = response ) =>{

    // HABRIA QUE VER COMO PROCEDER PARA EL BORRADO PERO EN SINTESIS MEJOR POR UN QUERY PARAM
    
    try {

        const { tipoEvento,  
                nombreEvento,
                horaDesde, 
                horaHasta, 
                costoEvento,
                todoEldia, 
                descripcion,
                fechaAgendamiento,
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
            id_evento_calendario,
            eventocreadoen,
            fechaagendamiento } = borrado_evento;
            
        const costo_eliminado = costo;
        if ( borrado_evento === null || borrado_evento === undefined ){
            res.status( 200 ).json( {
                status : true,
                msg : "Evento no BORRADO",
                //cantidad_registros : borrado_evento
                eventoBorrado : {
                    //------------------------------------------------------------------------------------------------------------------------
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    nombreCmp : nombre_evento,
                    fechaAgendamiento : fechaagendamiento,
                    fechaCreacion : eventocreadoen,
                    horaDesde : fecha_desde_evento,
                    horaHasta : fecha_hasta_evento,
                    //------------------------------------------------------------------------------------------------------------------------
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    todoEldia : todo_el_dia,
                }
            } );
        } else {

            res.status( 200 ).json( {
                status : true,
                msg : "Evento BORRADO",
                //cantidad_registros : borrado_evento
                eventoBorrado : {
                    //------------------------------------------------------------------------------------------------------------------------
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    nombreCmp : nombre_evento,
                    fechaAgendamiento : fechaagendamiento,
                    fechaCreacion : eventocreadoen,
                    horaDesde : fecha_desde_evento,
                    horaHasta : fecha_hasta_evento,
                    //------------------------------------------------------------------------------------------------------------------------
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    todoEldia : todo_el_dia,
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
                horaDesde, 
                horaHasta, 
                costoEvento,
                todoEldia, 
                descripcion,
                fechaAgendamiento,
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
                id_evento_calendario,
                eventocreadoen,
                fechaagendamiento } = actualizacion_evento;                                    

        if( actualizacion_evento > 0 ){
            res.status( 200 ).json( {
                status : true,
                msg : "Evento ACTUALIZADO",
                eventoBorrado : {
                    //------------------------------------------------------------------------------------------------------------------------
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    nombreCmp : nombre_evento,
                    fechaAgendamiento : fechaagendamiento,
                    fechaCreacion : eventocreadoen,
                    horaDesde : fecha_desde_evento,
                    horaHasta : fecha_hasta_evento,
                    //------------------------------------------------------------------------------------------------------------------------
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    todoEldia : todo_el_dia,
                }
            } );
        }else {
            res.status( 200 ).json( {
                status : false,
                msg : "Evento no ACTUALIZADO",
                eventoBorrado : {
                    //------------------------------------------------------------------------------------------------------------------------
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    nombreCmp : nombre_evento,
                    fechaAgendamiento : fechaagendamiento,
                    fechaCreacion : eventocreadoen,
                    horaDesde : fecha_desde_evento,
                    horaHasta : fecha_hasta_evento,
                    //------------------------------------------------------------------------------------------------------------------------
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    todoEldia : todo_el_dia,
                }
            } );
        }   
    } catch (error) {

        //console.log ( error );

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
        res.status( 500 ).json( {

            status : true,
            msg : `Ha ocurrido un error al obtener las inscripciones ${ error }`
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
        //console.log( error );

        res.status( 500 ).json( {
            status : true,
            msg : `Ha ocurrido un error al obtener las inscripciones ${ error }`
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
        const [ fecha_desde_mes, fecha_hasta_mes ] = [ new Date(annio, mes - 1, 1), new Date(annio, mes, 0) ];
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
        const eventosMes =  eventos.map( ( element ) =>{
            const { fecha_desde_evento, 
                    fecha_hasta_evento, 
                    costo, 
                    decripcion_evento,
                    id_tipo_evento,
                    todo_el_dia,
                    nombre_evento,
                    id_evento_calendario,
                    fechaagendamiento,
                    eventocreadoen } = element;

            return {
                    //------------------------------------------------------------------------------------------------------------------------
                    idEventoCalendario : (typeof(id_evento_calendario))? Number(id_evento_calendario.toString()) : id_evento_calendario,
                    nombreCmp : nombre_evento,
                    fechaAgendamiento : fechaagendamiento,
                    fechaCreacion : eventocreadoen,
                    horaDesde : fecha_desde_evento,
                    horaHasta : fecha_hasta_evento,
                    //------------------------------------------------------------------------------------------------------------------------
                    descripcion : decripcion_evento,
                    costo,
                    idTipoEvento : (typeof(id_tipo_evento))? Number(id_tipo_evento.toString()) : id_tipo_evento,
                    todoEldia : todo_el_dia,
            }
        } );

        res.status( 200 ).json( {
            status : true,
            msg : `Eventos del mes`,
            eventosMes
        } );

    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `Ha ocurrido un error al obtener los eventos del mes : ${error}`
        } );
    }



}

const obtener_requerimientos_x_evento = async ( req = request, res = response ) =>{

    try {

        const { id_requerimiento, id_evento } = req.query;

        const requerimientos = await prisma.requerimientos.findMany( { where : { id_evento_calendario : Number( id_evento ) } } )

        let requerimientosEvento = [];


        requerimientos.forEach( ( element ) =>{
            const { cantidad, costo_unidad, descripcion, id_requerimiento, id_evento_calendario } = element;

            requerimientosEvento.push( {
                descripcion, 
                cantidad,
                idRequerimiento : id_requerimiento, 
                costoUnidad : costo_unidad, 
                idEventoCalendario : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario)
            } )
        } )
        
        res.status( 200 ).json( {
            status : true,
            msg : "Requerimientos registrados para el evento",
            requerimientosEvento,
            cantidad : requerimientosEvento.length

        } );


    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al obtener los requerimientos del evento ${error} `,
            //error
        } );   
    }   

}



const crear_requerimientos_x_evento = async ( req = request, res = response ) =>{

    try {


        const { requerimientos } = req.body;
        let requerimientoEvento = [];

        for (const element of requerimientos) {
            
            const { cantidadRequerida, costoUnidad, descripcionRequerimiento, idEventoCalendario } = requerimientos[element];
            const { cantidad, costo_unidad, descripcion, id_requerimiento, id_evento_calendario } = await prisma.requerimientos.create( {
                                                                                                                            data : { 
                                                                                                                                descripcion : descripcionRequerimiento, 
                                                                                                                                cantidad : cantidadRequerida, 
                                                                                                                                costo_unidad : costoUnidad, 
                                                                                                                                id_evento_calendario : idEventoCalendario
                                                                                                                            } 
                                                                                                                        } );

            requerimientoEvento.push( {

                descripcion, 
                cantidad,
                idRequerimiento : id_requerimiento, 
                costoUnidad : costo_unidad, 
                idEventoCalendario : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario)

            } )
        }
                            
        res.status( 200 ).json( {
            status : true,
            msg : "Requerimientos para evento creado con exito",
            requerimientoEvento

        } );


    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al crear el requerimiento para el evento ${error} `,
            //error
        } );   
    }   

}


const editar_requerimientos_x_evento = async ( req = request, res = response ) =>{
    try {

        const { requerimientos } = req.body;
        const requerimientosEditados = [];



        for (const element of requerimientos) {
            const { cantidadRequerida, costoUnidad, descripcionRequerimiento, idEventoCalendario, idRequerimiento } = element;

            const { cantidad, costo_unidad, descripcion,
                    id_evento_calendario, id_requerimiento } = await prisma.requerimientos.update( { 
                                                                                                        data : { 
                                                                                                            costo_unidad : Number( costoUnidad ),
                                                                                                            descripcion : descripcionRequerimiento,
                                                                                                            cantidad : Number( cantidadRequerida )    
                                                                                                        },
                                                                                                        where : {
                                                                                                            AND : [
                                                                                                                { id_requerimiento : Number( idRequerimiento ) },
                                                                                                                { id_evento_calendario : Number( idEventoCalendario ) }
                                                                                                            ] 
                                                                                                        } 
                                                                                                    } );
            requerimientosEditados.push( {
                descripcion, 
                cantidad,
                idRequerimiento : id_requerimiento, 
                costoUnidad : costo_unidad, 
                idEventoCalendario : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario)

            } )
                                                                                

            
        }
        res.status( 200 ).json( {
            status : true,
            msg : "Requerimientos para evento editados con exito",
            requerimientosEditados

        } );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al editar los requerimiento del evento ${error} `,
            //error
        } );   
    }   

}



const eliminar_requerimientos_x_evento = async ( req = request, res = response ) =>{

    try {

        const { requerimientos } = req.body;
        const requerimientosEditados = [];



        for (const element of requerimientos) {
            const { cantidadRequerida, costoUnidad, descripcionRequerimiento, idEventoCalendario, idRequerimiento } = element;

            const { cantidad, costo_unidad, descripcion,
                    id_evento_calendario, id_requerimiento } = await prisma.requerimientos.delete( {    where : {
                                                                                                            AND : [
                                                                                                                { id_requerimiento : Number( idRequerimiento ) },
                                                                                                                { id_evento_calendario : Number( idEventoCalendario ) }
                                                                                                            ] 
                                                                                                        } 
                                                                                                    } );
            requerimientosEditados.push( {
                descripcion, 
                cantidad,
                idRequerimiento : id_requerimiento, 
                costoUnidad : costo_unidad, 
                idEventoCalendario : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario)

            } )
                                                                                

            
        }
        res.status( 200 ).json( {
            status : true,
            msg : "Requerimientos para evento eliminados con exito",
            requerimientosEditados

        } );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar los requerimiento del evento ${error} `,
            //error
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
    obtener_inscripciones_x_evento_no_socios,
    obtener_todos_los_eventos_calendario,
    obtener_categorias_x_evento,
    crear_categorias_x_evento,
    editar_categorias_x_evento,
    eliminar_categorias_x_evento,
    obtener_requerimientos_x_evento,
    eliminar_requerimientos_x_evento,
    editar_requerimientos_x_evento,
    crear_requerimientos_x_evento

}