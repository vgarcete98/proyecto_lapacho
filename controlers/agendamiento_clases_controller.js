const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')
const { withOptimize } = require("@prisma/extension-optimize");

const prisma = new PrismaClient().$extends(withOptimize( { apiKey: process.env.OPTIMIZE_API_KEY } ));

const { generar_fecha } = require( '../helpers/generar_fecha' );


const obtener_clases_del_dia = async ( req = request, res = response ) =>{

    // OBTENGO LAS CLASES POR LAS FECHAS INDICADAS 

    try {

        const { fechaDesde, fechaHasta, pagina, nombreProfesor, apellidoProfesor,
                nombreSocio, apellidoSocio, cedulaSocio, cedulaProfesor, idUsuario } = req.query;
        console.log( cedulaSocio );
        const [ dia_desde, mes_desde, annio_desde ] = fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] = fechaHasta.split( '/' );

        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;

        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;   

        const query = `SELECT A.id_agendamiento AS "idAgendamiento", 
                                B.id_profesor AS "idProfesor", 
                                B.nombre_profesor AS "nombreProfesor", 
                                D.id_cliente AS "idCliente", 
                        		D.nombre_cmp AS "nombreCmp", 
                                --A.fecha_agendamiento AS "fechaAgendamiento", 
                                C.id_mesa AS "idMesa", 
                                C.desc_mesa AS "descMesa", 
                        		A.horario_inicio AS "horaDesde", 
                                A.horario_hasta AS "horaHasta", 
                                A.clase_abonada AS "claseAgendada", 
                                A.monto_abonado AS "montoAbonado",
                                A.creadoen AS "fechaCreacion"
                        	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                        	JOIN mesas C ON C.id_mesa = A.id_mesa
                            JOIN clases_alumnos F on F.id_agendamiento = A.id_agendamiento
                        	JOIN cliente D ON D.id_cliente = F.id_cliente
                        WHERE A.fecha_agendamiento BETWEEN TIMESTAMP '${fecha_desde_format}' AND TIMESTAMP '${fecha_hasta_format}'
                        ${ ( idUsuario === undefined ) ? `` : `AND D.id_cliente = ${ idUsuario }` }
                        ${ ( nombreProfesor === undefined ) ? `` : `AND B.nombre_profesor LIKE '%${ nombreProfesor }%'` }                        
                        ${ ( apellidoProfesor === undefined ) ? `` : `AND B.nombre_profesor = '%${ apellidoProfesor }%'` }
                        ${ ( nombreSocio === undefined ) ? `` : `AND D.nombre_cmp LIKE '%${ nombreSocio }%'` }
                        ${ ( apellidoSocio === undefined ) ? `` : `AND LIKE '%${ apellidoSocio }%'` }
                        ${ ( cedulaProfesor === undefined ) ? `` : `AND B.cedula = ${ cedulaProfesor }` }
                        ${ ( cedulaSocio === undefined ) ? `` : `AND D.id_socio = ${ idUsuario }` }
                        ORDER BY A.fecha_agendamiento DESC
                        LIMIT 20 OFFSET ${Number(pagina) }`;
        //console.log( query );
        let clases_del_dia, clasesDelDia = [];
        clases_del_dia = await prisma.$queryRawUnsafe( query );  


        if ( clases_del_dia.length === 0 ){
            res.status( 200 ).json( {
                status : false,
                msg : "No se encontraron clases en esas fechas",
                clasesDelDia
            } );
        }else {

            const clasesDelDia = clases_del_dia.map( ( element )=>{
                const { id_agendamiento, id_profesor, nombre_profesor, id_socio, nombre_cmp,
                        id_mesa, desc_mesa, clase_abonada, monto_abonado,
                        /*fechaAgendamiento,*/ horario_inicio, horario_hasta, fechaCreacion } = element;
                return {
                    idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento), 
                    nombreCmp : nombre_cmp,
                    //fechaAgendamiento : fecha_agendamiento, 
                    fechaCreacion,
                    horaDesde : horario_inicio, 
                    horaHasta : horario_hasta,
                    descMesa : desc_mesa,
                    idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                    //----------------------------------------------------------------------------------------
                    idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                    nombreProfesor : nombre_profesor,
                    idProfesor : id_profesor,
                    claseAgendada : clase_abonada,
                    montoAbonado : monto_abonado
                    //----------------------------------------------------------------------------------------
                }
            } );
            res.status( 200 ).json( {
                status : true,
                msg : "Clases de esas fechas",
                clasesDelDia
            } );
        }
    } catch (error) {
        //console.log ( ` Error encontrado ${error}` );

        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al consultar las clases x Fecha : ${error}`,
            //error
        } );
    }



}



const obtener_clases_del_dia_x_socio = async ( req = request, res = response ) =>{

    // OBTENGO LAS CLASES POR LAS FECHAS INDICADAS 

    try {

        const { fechaDesde, fechaHasta, pagina, nombreProfesor, apellidoProfesor,
                nombreSocio, apellidoSocio, cedulaSocio, cedulaProfesor, idUsuario } = req.query;

        const { idSocio } = req.body;
        //console.log( idSocio );
        const [ dia_desde, mes_desde, annio_desde ] = fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] = fechaHasta.split( '/' );

        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;

        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;   

        const query = `SELECT A.id_agendamiento AS "idAgendamiento", 
                                B.id_profesor AS "idProfesor", 
                                B.nombre_profesor AS "nombreProfesor", 
                                D.id_cliente AS "idCliente", 
                        		D.nombre_cmp AS "nombreCmp", 
                                --A.fecha_agendamiento AS "fechaAgendamiento", 
                                C.id_mesa AS "idMesa", 
                                C.desc_mesa AS "descMesa", 
                        		A.horario_inicio AS "horaDesde", 
                                A.horario_hasta AS "horaHasta", 
                                A.clase_abonada AS "claseAgendada", 
                                A.monto_abonado AS "montoAbonado",
                                A.creadoen AS "fechaCreacion"
                        	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                        	JOIN mesas C ON C.id_mesa = A.id_mesa
                            JOIN clases_alumnos F on F.id_agendamiento = A.id_agendamiento
                        	JOIN cliente D ON D.id_cliente = F.id_cliente
                        WHERE A.fecha_agendamiento BETWEEN TIMESTAMP '${fecha_desde_format}' AND TIMESTAMP '${fecha_hasta_format}'
                        ${ ( idUsuario === undefined ) ? `` : `AND D.id_socio = ${ idUsuario }` }
                        ${ ( nombreProfesor === undefined ) ? `` : `AND B.nombre_profesor LIKE '%${ nombreProfesor }%'` }                        
                        ${ ( apellidoProfesor === undefined ) ? `` : `AND B.nombre_profesor = '%${ apellidoProfesor }%'` }
                        ${ ( nombreSocio === undefined ) ? `` : `AND D.nombre_cmp LIKE '%${ nombreSocio }%'` }
                        ${ ( apellidoSocio === undefined ) ? `` : `AND LIKE '%${ apellidoSocio }%'` }
                        ${ ( cedulaProfesor === undefined ) ? `` : `AND B.cedula = ${ cedulaProfesor }` }
                        ${ ( cedulaSocio === undefined ) ? `` : `AND D.id_socio = ${ idUsuario }` }
                        ORDER BY A.fecha_agendamiento DESC
                        LIMIT 20 OFFSET ${Number(pagina) -1 }`
        let clases_del_dia, clasesDelDia = [];
        clases_del_dia = await prisma.$queryRawUnsafe( query );  


        if ( clases_del_dia.length === 0 ){
            res.status( 200 ).json( {
                status : false,
                msg : "No se encontraron clases para el dia de hoy",
                clasesDelDia
            } );
        }else {

            const clasesDelDia = clases_del_dia.map( ( element )=>{
                const { id_agendamiento, id_profesor, nombre_profesor, id_socio, nombre_cmp,
                        id_mesa, desc_mesa, clase_abonada, monto_abonado,
                        /*fechaAgendamiento,*/ horario_inicio, horario_hasta, fechaCreacion } = element;
                return {
                    idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento), 
                    nombreCmp : nombre_cmp,
                    //fechaAgendamiento : fecha_agendamiento, 
                    fechaCreacion,
                    horaDesde : horario_inicio, 
                    horaHasta : horario_hasta,
                    descMesa : desc_mesa,
                    idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                    //----------------------------------------------------------------------------------------
                    idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                    nombreProfesor : nombre_profesor,
                    idProfesor : id_profesor,
                    claseAgendada : clase_abonada,
                    montoAbonado : monto_abonado
                    //----------------------------------------------------------------------------------------
                }
            } );
            res.status( 200 ).json( {
                status : true,
                msg : "Clases para el dia de hoy",
                clasesDelDia
            } );
        }
    } catch (error) {
        //console.log ( ` Error encontrado ${error}` );

        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al consultar las clases x Fecha : ${error}`,
            //error
        } );
    }



}





const obtener_clases_x_profesor_dia = async ( req = request, res = response ) =>{


    // voy a devolver las clases del dia para ese profesor
    try {

        const { fechaDesde, fechaHasta, pagina, nombreProfesor, apellidoProfesor,
                nombreSocio, apellidoSocio, cedulaSocio, cedulaProfesor, idUsuario } = req.query;
    
        const [ dia_desde, mes_desde, annio_desde ] = fechaDesde.split( '/' );
    
        const [ dia_hasta, mes_hasta, annio_hasta ] = fechaHasta.split( '/' );
    
        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;
    
        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;   

        const query = `SELECT SELECT A.id_agendamiento AS "idAgendamiento", 
                                B.id_profesor AS "idProfesor", 
                                B.nombre_profesor AS "nombreProfesor", 
                                D.id_cliente AS "idCliente", 
                        		D.nombre_cmp AS "nombreCmp", 
                                --A.fecha_agendamiento AS "fechaAgendamiento", 
                                C.id_mesa AS "idMesa", 
                                C.desc_mesa AS "descMesa", 
                        		A.horario_inicio AS "horaDesde", 
                                A.horario_hasta AS "horaHasta", 
                                A.clase_abonada AS "claseAgendada", 
                                A.monto_abonado AS "montoAbonado",
                                A.creadoen AS "fechaCreacion"
                        	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                        	JOIN mesas C ON C.id_mesa = A.id_mesa
                            JOIN clases_alumnos F on F.id_agendamiento = A.id_agendamiento
                        	JOIN cliente D ON D.id_cliente = F.id_cliente
                        WHERE A.fecha_agendamiento BETWEEN  TIMESTAMP '${fecha_desde_format}' AND TIMESTAMP '${fecha_hasta_format}'
                                AND B.id_profesor = ${ Number( id_profesor ) }
                                ${ ( nombreProfesor === undefined ) ? `` : `AND B.nombre_profesor LIKE '%${ nombreProfesor }%'` }                        
                                ${ ( apellidoProfesor === undefined ) ? `` : `AND B.nombre_profesor = '%${ apellidoProfesor }%'` }
                                ${ ( cedulaProfesor === undefined ) ? `` : `AND B.cedula = ${ cedulaProfesor }` }
                        ORDER BY A.fecha_agendamiento DESC
                        LIMIT 20 OFFSET ${Number(pagina) - 1}`;
        //console.log( query )
        let clases_del_dia, clasesDelDia = [];
        clases_del_dia = await prisma.$queryRawUnsafe( query ); 

        if ( clases_del_dia.length === 0 ){
            res.status( 200 ).json( {
                status : false,
                msg : "No se encontraron clases para el dia de hoy",
                clasesDelDia
            } );
        }else {

            const clasesDelDia = clases_del_dia.map( ( element )=>{
                const { id_agendamiento, id_profesor, nombre_profesor, id_socio, nombre_cmp,
                        id_mesa, desc_mesa, clase_abonada, monto_abonado,
                        fecha_agendamiento, horario_inicio, horario_hasta } = element;
                return {
                    idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento), 
                    nombreCmp : nombre_cmp,
                    //fechaAgendamiento : fecha_agendamiento, 
                    fechaCreacion,
                    horaDesde : horario_inicio, 
                    horaHasta : horario_hasta,
                    descMesa : desc_mesa,
                    idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                    //----------------------------------------------------------------------------------------
                    idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                    nombreProfesor : nombre_profesor,
                    idProfesor : id_profesor,
                    claseAgendada : clase_abonada,
                    montoAbonado : monto_abonado
                    //----------------------------------------------------------------------------------------
                }
            } );
            res.status( 200 ).json( {
                status : true,
                msg : "Clases para el dia de hoy",
                clasesDelDia
            } );
        }
    } catch (error) {
        //console.log ( ` Error encontrado ${error}` );

        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al consultar las clases x Fecha : ${error}`,
            //error
        } );
    }


}





const agendar_una_clase = async ( req = request, res = response ) =>{

    // VOY A COMPROBAR LAS CLASES QUE HAY EN EL DIA PRIMERO PARA PODER VER SI SE PUEDE RESERVAR O NO
    try {
        const { idCliente, idProfesor, /*fechaAgendamiento,*/ inicio, fin, idMesa } = req.body;
        const fecha_desde_format = new Date ( inicio );

        const fecha_hasta_format = new Date ( fin ); 
        
        let cliente = null;
        if ( idCliente !== null && idCliente !== undefined ){

            cliente = await prisma.cliente.findUnique( { 
                where : { 
                    id_cliente : Number(idCliente) 
                },
                select : {
                    es_socio : true,
                    id_cliente : true
    
                }
            } );
        }

        //AQUI BASICAMENTE HAY UN PROCESO EXTRA CUANDO SE TRATA DE ALGUIEN QUE NO ES SOCIO
        //SE TIENE QUE GENERAR OBVIAMENTE UNA RESERVA CUANDO SE TRATA DE ALGUIEN QUE NO ES UN SOCIO
        //POR QUE APARTE DE LO QUE HAY QUE PAGAR AL PROFESOR TAMBIEN HAY QUE PAGAR POR EL USO DE LA MESA

        const precio_clase = await prisma.precio_clase.findFirst( { 
                                                                    where : {
                                                                        AND : [

                                                                            { id_profesor : Number(idProfesor) },
                                                                            { valido : true }
                                                                        ]
                                                                    },
                                                                    select : {
                                                                        id_profesor : true,
                                                                        precio : true,
                                                                        id_precio_clase : true
                                                                    }
                                                                } );
        //console.log( precio_clase )
        const { id_profesor, precio, id_precio_clase } = precio_clase
        const clase_nueva = await prisma.agendamiento_clase.create( { 
                                                                        data : { 
                                                                                    id_profesor : Number(idProfesor),
                                                                                    id_mesa : Number( idMesa ),
                                                                                    //fecha_agendamiento : generar_fecha( fechaAgendamiento ),
                                                                                    horario_inicio : fecha_desde_format,
                                                                                    horario_hasta : fecha_hasta_format,
                                                                                    clase_abonada : false,
                                                                                    monto_abonado : precio,
                                                                                    fecha_agendamiento : new Date(),
                                                                                    creadoen : new Date(),
                                                                                    id_precio_clase : id_precio_clase,
                                                                                    //monto_abonado : precio_clase.precio,
                                                                                    //precio_clase : precio_clase.precio
                                                                                    //clase_eliminada : false,
                                                                                },
                                                                        select : {
                                                                            id_agendamiento : true
                                                                        } 
                                                                    } );
                                                        
        if ( cliente !== null ){
            const { es_socio, id_cliente } = cliente;
            //QUIERE DECIR QUE SE TRATA DE UN CLIENTE POR LO TANTO HAY QUE AGREGARLE A LA CLASE

            const { id_agendamiento } = clase_nueva;
            const agrega_a_clase = await prisma.clases_alumnos.create( { 
                                                                            data : {  
                                                                                id_agendamiento : id_agendamiento,
                                                                                id_cliente : id_cliente
                                                                            },
                                                                            select : {
                                                                                id_clase_alumno : true
                                                                            } 
                                                                    } );


            if ( es_socio === false ){
                //QUIERE DECIR QUE SE TRATA DE UN CLIENTE POR LO TANTO HAY QUE CREARLE UNA RESERVA ADEMAS DE AGREGARLE A LA CLASE

                const precio_reserva = await prisma.precio_reservas.findFirst( { 
                                                                                    where : { 
                                                                                        valido : true 
                                                                                    },
                                                                                    select : { 
                                                                                        id_precio_reserva : true,
                                                                                        monto_reserva : true
                                                                                    } 
                                                                            } );
                const { id_precio_reserva, monto_reserva } = precio_reserva;
                const nueva_reserva = await prisma.reservas.create( { 
                    data : {
                        id_cliente : Number(idCliente),
                        fecha_creacion : new Date(),
                        //fecha_reserva : generar_fecha( fechaAgendamiento ),
                        fecha_reserva : fecha_desde_format,
                        hora_desde : fecha_desde_format,
                        hora_hasta : fecha_hasta_format,
                        id_mesa : Number( idMesa ),
                        estado : 'PENDIENTE',
                        monto : monto_reserva,
                        creado_en : new Date(),
                        id_precio_reserva : id_precio_reserva,
                        creado_por : 1,
                        //tipo_ingreso : tipoIngreso
                    } 
                });
            }

        }

        if ( clase_nueva !== null ) {
            
            res.status( 200 ).json( {
                status : true,
                msg : "Clase Creada",
                descripcion : "Clase Agendada"
            } );
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : "La clase no logro ser generada",
                descripcion : "Favor verifique que la clase fue generada"
            } );
        }


    } catch (error) {
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al agendar la clase, favor intente de vuelta : ${error}`,
            //error
        } );

    }



}




const agendar_alumno_a_clase = async ( req = request, res = response ) =>{

    // VOY A COMPROBAR LAS CLASES QUE HAY EN EL DIA PRIMERO PARA PODER VER SI SE PUEDE RESERVAR O NO
    try {
        const { idCliente, idProfesor, idAgendamientoClase } = req.body;
        
        let cliente = null;
        if ( idCliente !== null && idCliente !== undefined ){

            cliente = await prisma.cliente.findUnique( { 
                where : { 
                    id_cliente : Number(idCliente) 
                },
                select : {
                    es_socio : true,
                    id_cliente : true
    
                }
            } );
        }

        //AQUI BASICAMENTE HAY UN PROCESO EXTRA CUANDO SE TRATA DE ALGUIEN QUE NO ES SOCIO
        //SE TIENE QUE GENERAR OBVIAMENTE UNA RESERVA CUANDO SE TRATA DE ALGUIEN QUE NO ES UN SOCIO
        //POR QUE APARTE DE LO QUE HAY QUE PAGAR AL PROFESOR TAMBIEN HAY QUE PAGAR POR EL USO DE LA MESA

        const precio_clase = await prisma.precio_clase.findFirst( { 
                                                                    where : {
                                                                        AND : [

                                                                            { id_profesor : Number(idProfesor) },
                                                                            { valido : true }
                                                                        ]
                                                                    },
                                                                    select : {
                                                                        id_profesor : true,
                                                                        precio : true,
                                                                        id_precio_clase : true
                                                                    }
                                                                } );

        const clase_nueva = await prisma.agendamiento_clase.findUnique( { 
                                                                            where: {  id_agendamiento : Number( idAgendamientoClase )},
                                                                            select : {
                                                                                id_agendamiento : true
                                                                            }
                                                                    } );
                                                        
        if ( cliente !== null && clase_nueva !== null){
            const { es_socio, id_cliente } = cliente;
            //QUIERE DECIR QUE SE TRATA DE UN CLIENTE POR LO TANTO HAY QUE AGREGARLE A LA CLASE

            const { id_agendamiento } = clase_nueva;
            const agrega_a_clase = await prisma.clases_alumnos.create( { 
                                                                            data : {  
                                                                                id_agendamiento : id_agendamiento,
                                                                                id_cliente : id_cliente
                                                                            },
                                                                            select : {
                                                                                id_clase_alumno : true
                                                                            } 
                                                                    } );


            if ( es_socio === false ){
                //QUIERE DECIR QUE SE TRATA DE UN CLIENTE POR LO TANTO HAY QUE CREARLE UNA RESERVA ADEMAS DE AGREGARLE A LA CLASE

                const precio_reserva = await prisma.precio_reservas.findFirst( { 
                                                                                    where : { 
                                                                                        valido : true 
                                                                                    },
                                                                                    select : { 
                                                                                        id_precio_reserva : true,
                                                                                        monto_reserva : true
                                                                                    } 
                                                                            } );
                const { id_precio_reserva, monto_reserva } = precio_reserva;
                const nueva_reserva = await prisma.reservas.create( { 
                    data : {
                        id_cliente : Number(idCliente),
                        fecha_creacion : new Date(),
                        //fecha_reserva : generar_fecha( fechaAgendamiento ),
                        fecha_reserva : fecha_desde_format,
                        hora_desde : fecha_desde_format,
                        hora_hasta : fecha_hasta_format,
                        id_mesa : Number( idMesa ),
                        estado : 'PENDIENTE',
                        monto : monto_reserva,
                        creado_en : new Date(),
                        id_precio_reserva : id_precio_reserva,
                        creado_por : 1,
                        //tipo_ingreso : tipoIngreso
                    } 
                });
            }

        }

        if ( clase_nueva !== null ) {
            
            res.status( 200 ).json( {
                status : true,
                msg : "Alumno agregado a la clase",
                descripcion : "Se agrego a l alumno a la clase"
            } );
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : "No se logro agregar al alumno a la clase",
                descripcion : "Favor verifique que la clase fue generada"
            } );
        }


    } catch (error) {
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al agendar la clase, favor intente de vuelta : ${error}`,
            //error
        } );

    }



}

const editar_una_clase = async ( req = request, res = response ) =>{

    try {
        const { idSocio, idProfesor, fechaAgendamiento, inicio, fin, idMesa, idAgendamiento } = req.body;
        //console.log ( req.body )
        const { id_agendamiento, id_socio, id_profesor, 
                //fecha_agendamiento, 
                horario_inicio, horario_hasta, 
                clase_abonada, monto_abonado, creadoen } = await prisma.agendamiento_clase.update( { 
                                                                                            data : { 
                                                                                                        //id_profesor : idProfesor,
                                                                                                        fecha_agendamiento : generar_fecha( fechaAgendamiento ),
                                                                                                        horario_inicio : generar_fecha(inicio),
                                                                                                        horario_hasta : generar_fecha(fin),
                                                                                                        //clase_eliminada : false,
                                                                                                        id_mesa : Number( idMesa ),
                                                                                                        editadoen : new Date(),
                                                                                                    },
                                                                                            where : { id_agendamiento : Number( idAgendamiento ) }
                                                                                        } );
        const { nombre_profesor } = await prisma.profesores.findUnique( { where : { id_profesor :  Number( idProfesor )} } );
        const { nombre_cmp } = await prisma.socio.findUnique( { where : { id_socio :  Number( idSocio )} } );
        const { desc_mesa, id_mesa } = await prisma.mesas.findUnique( { where : { id_mesa :  Number( idMesa )} } );

        res.status( 200 ).json( {
            status : true,
            msg : "Clase Editada",
            claseAgendada : {
                idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento), 
                nombreCmp : nombre_cmp,
                //fechaAgendamiento : fecha_agendamiento, 
                fechaCreacion : creadoen,
                horaDesde : horario_inicio, 
                horaHasta : horario_hasta,
                descMesa : desc_mesa,
                idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                //----------------------------------------------------------------------------------------
                idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                nombreProfesor : nombre_profesor,
                idProfesor : id_profesor,
                claseAgendada : clase_abonada,
                montoAbonado : monto_abonado
                //----------------------------------------------------------------------------------------
            }
        } );

    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al editar el registro : ${error}`,
            //error
        } );

    }


}



const abonar_una_clase = async ( req = request, res = response ) =>{


    try {
        const { idSocio, idProfesor, /*fechaAgendamiento,*/ inicio, fin, idMesa, idAgendamiento, monto } = req.body;
        
        const { id_agendamiento, id_socio, id_profesor, 
                fecha_agendamiento, horario_inicio, horario_hasta, 
                clase_abonada, monto_abonado, creadoen } = await prisma.agendamiento_clase.update( { 
                                                                                            data : { 
                                                                                                        monto_abonado : monto,
                                                                                                        clase_abonada : true
                                                                                                    },
                                                                                            where : { id_agendamiento : Number( idAgendamiento ) }
                                                                                        } );
        const { nombre_profesor } = await prisma.profesores.findUnique( { where : { id_profesor :  Number( idProfesor )} } );
        const { nombre_cmp } = await prisma.socio.findUnique( { where : { id_socio :  Number( idSocio )} } );
        const { desc_mesa, id_mesa } = await prisma.mesas.findUnique( { where : { id_mesa :  Number( idMesa )} } );

        res.status( 200 ).json( {
            status : true,
            msg : "Clase Abonada",
            claseAgendada : {
                idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento), 
                nombreCmp : nombre_cmp,
                fechaAgendamiento : fecha_agendamiento, 
                fechaCreacion : creadoen,
                horaDesde : horario_inicio, 
                horaHasta : horario_hasta,
                descMesa : desc_mesa,
                idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                //----------------------------------------------------------------------------------------
                idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                nombreProfesor : nombre_profesor,
                idProfesor : id_profesor,
                claseAgendada : clase_abonada,
                montoAbonado : monto_abonado
                //----------------------------------------------------------------------------------------
            }
        } );

    } catch (error) {

        //console.log ( error );

        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo abonar por la clase, ocurrio un error ${ error }`,
            //error
        } );
    }


}


const eliminar_clase_con_profesor = async ( req = request, res = response ) =>{

    try {

        const { idSocio, idProfesor, /*fechaAgendamiento,*/ inicio, fin, idMesa, idAgendamiento } = req.body;
        
        const { id_agendamiento, id_socio, id_profesor, 
                fecha_agendamiento, horario_inicio, horario_hasta, 
                clase_abonada, monto_abonado, creadoen } = await prisma.agendamiento_clase.delete( { where : { id_agendamiento : Number( idAgendamiento ) } } );

        const { nombre_profesor } = await prisma.profesores.findUnique( { where : { id_profesor :  Number( idProfesor )} } );
        const { nombre_cmp } = await prisma.socio.findUnique( { where : { id_socio :  Number( idSocio )} } );
        const { desc_mesa, id_mesa } = await prisma.mesas.findUnique( { where : { id_mesa :  Number( idMesa )} } );
        res.status( 200 ).json( {
            status : true,
            msg : "Clase Borrada",
            claseAgendada : {
                idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento), 
                nombreCmp : nombre_cmp,
                //fechaAgendamiento : fecha_agendamiento, 
                fechaCreacion : creadoen,
                horaDesde : horario_inicio, 
                horaHasta : horario_hasta,
                descMesa : desc_mesa,
                idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                //----------------------------------------------------------------------------------------
                idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                nombreProfesor : nombre_profesor,
                idProfesor : id_profesor,
                claseAgendada : clase_abonada,
                montoAbonado : monto_abonado
                //----------------------------------------------------------------------------------------
            }
        } );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al eliminar la clase ${ error }`,
            //error
        } );
    }

}



const obtener_mesas_disponibles_x_horario = async ( req = request, res = response ) => {

    try {

        const { horaDesde, horaHasta } = req.body;  

        //console.log ( new Date( horaDesde ), new Date( horaHasta ) )
        const clases = await prisma.agendamiento_clase.findMany( { 
                                                                    where : {  
                                                                        horario_inicio : { gte : new Date( horaDesde ) },
                                                                        horario_hasta : { lte : new Date( horaHasta ) }
                                                                    },
                                                                    select : {
                                                                        id_mesa : true
                                                                    },
                                                                    distinct : ['id_mesa']
                                                            } );
        
        let mesasDisponibles = [];
        let mesas = [];
        if ( clases !== null && clases !== undefined && clases.length !== 0 ){

            
            mesas = await prisma.mesas.findMany( { 
                                            where : { 
                                                id_mesa : { notIn : clases.map(element => element.id_mesa) }
                                            } 
                                        } );

            mesasDisponibles = mesas.map( element =>({
                idMesa : element.id_mesa,
                descMesa : element.desc_mesa
            }));

    
        }else {
            mesas = await prisma.mesas.findMany( );
            
            mesasDisponibles = mesas.map( element =>({
                idMesa : element.id_mesa,
                descMesa : element.desc_mesa
            }));
            
        }


        if ( mesasDisponibles.length > 0  ) {

            res.status( 200 ).json( {
                status : true,
                msg : "Mesas disponibles en horario seleccionado",
                mesasDisponibles
            } );
        }else {
            res.status( 400 ).json( {
                status : true,
                msg : "No se encuentran mesas disponibles para ese horario",
                descripcion : "Ninguna mesa se encuentra libre, intentelo en otro horario"
            } );
        }
        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al obtener las mesas para ese horario ${ error }`,
            //error
        } );
    }



}






const generar_venta_pago_profesor = async (req = request, res = response)=>{

    try {

        const { inicio, fin, idProfesor } = req.body;

        //VAMOS A CONTAR LA CANTIDAD DE CLASES QUE TUVO ESE PROFESOR DENTRO DEL PERIODO

        const clases_profesor = await prisma.agendamiento_clase.count( { 
                                                                            where : {
                                                                                AND : [
                                                                                    { inicio : { gte : new Date( inicio ) } },
                                                                                    { fin : { lte : new Date( fin ) } },
                                                                                    { id_profesor : Number( idProfesor ) }
                                                                                ]
                                                                            } 
                                                                    } );
        const datos_profesor = await prisma.profesores.findUnique( { 
                                                                        where : { id_profesor : Number(idProfesor) },
                                                                        select : { 
                                                                            id_profesor : true,
                                                                            porc_facturacion : true,
                                                                            precio_clase : true,
                                                                            cedula : true
                                                                        }
                                                                    } );


        const { id_profesor, porc_facturacion, precio_clase } = datos_profesor;



        const periodo_facturacion_clase = await prisma.periodos_facturacion.create( {  
                                                                                        data : {
                                                                                            creado_en : new Date(),
                                                                                            creado_por : 1,
                                                                                            fin : new Date( fin ),
                                                                                            inicio : new Date( inicio ),
                                                                                            monto_total : ( precio_clase*clases_profesor )*porc_facturacion
                                                                                        },
                                                                                        select : { 
                                                                                            monto_total : true,
                                                                                            id_periodo_fact : true
                                                                                        }
                                                                                    } )

        if ( periodo_facturacion_clase !== null ){
            const { monto_total, id_periodo_fact } = periodo_facturacion_clase;
            //ESO SE AGREGA DIRECTO A UNA VENTA PARA EL PROFESOR QUE TIENE QUE ABONAR

            const cliente = await prisma.cliente.findUnique( { 
                                                                where : { cedula : cedula }, 
                                                                select : { 
                                                                    id_cliente : true
                                                                }
                                                            } );

            const { id_cliente } = cliente;

            const descripcion = `COBRO POR USO DEL CLUB, CLASES PARTICULARES`;

            const nueva_venta = await prisma.ventas.create( { 
                                                                data : {
                                                                    creado_en : new Date( ),
                                                                    creado_por : 1,
                                                                    estado : 'PENDIENTE DE PAGO',
                                                                    descripcion_venta : descripcion,
                                                                    monto : monto_total,
                                                                    cedula : cedula,
                                                                    id_agendamiento : null,
                                                                    id_periodo_fact : id_periodo_fact,
                                                                    id_cliente_reserva : null,
                                                                    id_cuota_socio : null,
                                                                    id_cliente : id_cliente,
                                                                    id_inscripcion : null,
                                                                    fecha_operacion : new Date(),
                                                                    id_tipo_ingreso : ingreso_por_cuota.id_tipo_ingreso

                                                                },
                                                                select : { 
                                                                    id_venta : true
                                                                }
                                                            } );

            if (nueva_venta !== null){
                console.log( `VENTA GENERADA CON EXITO PARA CLASES DE PROFESORES` );
                
                res.status( 200 ).json(
                    {
                        status : true,
                        msg : 'Ventas periodo de clases generadas con exito',
                        descripcion : 'El periodo de Clases ingresado fueron generadas como ventas'
                    }
                );
            }else {
                res.status( 400 ).json(
                    {
                        status : true,
                        msg : 'El periodo Seleccionado de Clases no fue agregado a la venta',
                        descripcion : `El periodo Seleccionado de Clases ${inicio} a ${fin} no fue agregado a ventas`
                    }
                );
            }

        

        }
        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al generar la venta para cobro de clases del profesor ${ error }`,
            //error
        } );
    }


}




const obtener_periodos_de_clase_generados = async (req = request, res = response)=>{

    try {

        const { inicio, fin, idProfesor } = req.body;

        //VAMOS A CONTAR LA CANTIDAD DE CLASES QUE TUVO ESE PROFESOR DENTRO DEL PERIODO

        const periodos_facturacion = await prisma.periodos_facturacion.findMany( {  
                                                                                    where : {
                                                                                        AND : [
                                                                                            { inicio : { gte :  new Date(inicio) } },
                                                                                            { fin : { lte: new Date( fin ) } },
                                                                                            { id_profesor : Number( idProfesor ) }
                                                                                        ]
                                                                                    },
                                                                                    include : {
                                                                                        profesores : true
                                                                                    }
                                                                                    ,
                                                                                    select : {
                                                                                        id_periodo_fact : true,
                                                                                        id_profesor : true,
                                                                                        profesores : {
                                                                                            select : {
                                                                                                nombre_profesor : true,
                                                                                                porc_facturacion : true
                                                                                            }
                                                                                        },
                                                                                        inicio : true,
                                                                                        fin : true,
                                                                                        monto_total : true
                                                                                    }

                                                                                } );

        if ( periodos_facturacion !== null ){

            const periodosClase = periodos_facturacion.map( ( element )=>{
                const { id_periodo_fact, id_profesor, nombre_profesor, porc_facturacion, inicio, fin, monto_total  } = element;
                return {
                    idPeriodoClase : id_periodo_fact, 
                    inicio : inicio, 
                    fin : fin,
                    nombreProfesor : nombre_profesor,
                    idProfesor : id_profesor,
                    montoTotal : monto_total,
                    porcFacturacion : porc_facturacion
                    //----------------------------------------------------------------------------------------
                }
            } );            
                
            res.status( 200 ).json(
                {
                    status : true,
                    msg : 'Periodos de clase obtenidos para facturar',
                    periodosClase
                }
            );

        }else {
            res.status( 400 ).json(
                {
                    status : false,
                    msg : 'No existen periodos de clase dentro de ese rango de fechas',
                    descripcion : `El periodo Seleccionado ${inicio} a ${fin} no tiene clases`
                }
            );
        }

        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al obtener los periodos para cobro de clases del profesor ${ error }`,
            //error
        } );
    }


}



module.exports = {

    agendar_una_clase,
    editar_una_clase,
    abonar_una_clase,
    obtener_clases_del_dia,
    obtener_clases_x_profesor_dia,
    eliminar_clase_con_profesor,
    obtener_clases_del_dia_x_socio,
    obtener_mesas_disponibles_x_horario,
    generar_venta_pago_profesor,
    obtener_periodos_de_clase_generados,
    agendar_alumno_a_clase

}