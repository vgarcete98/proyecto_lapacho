const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const { generar_fecha } = require( '../helpers/generar_fecha' );


const obtener_clases_del_dia = async ( req = request, res = response ) =>{

    // OBTENGO LAS CLASES POR LAS FECHAS INDICADAS 

    try {

        const { fechaDesde, fechaHasta, pagina } = req.query;

        const [ dia_desde, mes_desde, annio_desde ] = fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] = fechaHasta.split( '/' );

        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;

        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;   

        const query = `SELECT A.id_agendamiento, B.id_profesor, B.nombre_profesor, D.id_socio, 
                        		D.nombre_cmp, A.fecha_agendamiento, C.id_mesa, C.desc_mesa, 
                        		A.horario_inicio, A.horario_hasta, A.clase_abonada, A.monto_abonado
                        	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                        	JOIN mesas C ON C.id_mesa = A.id_mesa
                        	JOIN socio D ON D.id_socio = A.id_socio
                        WHERE A.fecha_agendamiento BETWEEN  BETWEEN DATE '${fecha_desde_format}' AND DATE '${fecha_hasta_format}'
                        ${ ( idUsuario === undefined ) ? `` : `AND D.id_socio = ${ idUsuario }` }
                        ORDER BY A.fecha_agendamiento DESC
                        LIMIT 20 OFFSET ${Number(pagina)}`
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
                    idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                    nombreSocio : nombre_cmp,
                    nombreProfesor : nombre_profesor,
                    idProfesor : id_profesor,
                    idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                    mesa : desc_mesa,
                    fechaAgendamiento : fecha_agendamiento, 
                    horarioInicio : horario_inicio, 
                    horarioHasta : horario_hasta,
                    claseAgendada : clase_abonada,
                    montoAbonado : monto_abonado
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



const obtener_clases_del_dia_x_socio = async ( req = request, res = response ) =>{

    // OBTENGO LAS CLASES POR LAS FECHAS INDICADAS 

    try {

        const { fechaDesde, fechaHasta, pagina } = req.query;

        const { idSocio } = req.body;
        //console.log( idSocio );
        const [ dia_desde, mes_desde, annio_desde ] = fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] = fechaHasta.split( '/' );

        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;

        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;   

        const query = `SELECT A.id_agendamiento, B.id_profesor, B.nombre_profesor, D.id_socio, 
                        		D.nombre_cmp, A.fecha_agendamiento, C.id_mesa, C.desc_mesa, 
                        		A.horario_inicio, A.horario_hasta, A.clase_abonada, A.monto_abonado
                        	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                        	JOIN mesas C ON C.id_mesa = A.id_mesa
                        	JOIN socio D ON D.id_socio = A.id_socio
                        WHERE A.fecha_agendamiento BETWEEN DATE '${fecha_desde_format}' AND DATE '${fecha_hasta_format}'
                        ${ ( idUsuario === undefined ) ? `` : `AND D.id_socio = ${ idUsuario }` }
                        ORDER BY A.fecha_agendamiento DESC
                        LIMIT 20 OFFSET ${Number(pagina)}`
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
                    idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                    nombreSocio : nombre_cmp,
                    nombreProfesor : nombre_profesor,
                    idProfesor : id_profesor,
                    idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                    mesa : desc_mesa,
                    fechaAgendamiento : fecha_agendamiento, 
                    horarioInicio : horario_inicio, 
                    horarioHasta : horario_hasta,
                    claseAgendada : clase_abonada,
                    montoAbonado : monto_abonado
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
        const { fechaDesde, fechaHasta, pagina, id_profesor } = req.query;
    
        const [ dia_desde, mes_desde, annio_desde ] = fechaDesde.split( '/' );
    
        const [ dia_hasta, mes_hasta, annio_hasta ] = fechaHasta.split( '/' );
    
        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;
    
        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;   

        const query = `SELECT A.id_agendamiento, B.id_profesor, B.nombre_profesor, D.id_socio, 
                        		D.nombre_cmp, A.fecha_agendamiento, C.id_mesa, C.desc_mesa, 
                        		A.horario_inicio, A.horario_hasta, A.clase_abonada, A.monto_abonado
                        	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                        	JOIN mesas C ON C.id_mesa = A.id_mesa
                        	JOIN socio D ON D.id_socio = A.id_socio
                        WHERE A.fecha_agendamiento BETWEEN  DATE '${fecha_desde_format}' AND DATE '${fecha_hasta_format}'
                                AND B.id_profesor = ${ Number( id_profesor ) }
                        ORDER BY A.fecha_agendamiento DESC
                        LIMIT 20 OFFSET ${Number(pagina)}`;
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
                    idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                    nombreSocio : nombre_cmp,
                    nombreProfesor : nombre_profesor,
                    idProfesor : id_profesor,
                    idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
                    mesa : desc_mesa,
                    fechaAgendamiento : fecha_agendamiento, 
                    horarioInicio : horario_inicio, 
                    horarioHasta : horario_hasta,
                    claseAgendada : clase_abonada,
                    montoAbonado : monto_abonado
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
        const { idSocio, idProfesor, fechaAgendamiento, inicio, fin, idMesa } = req.body;
        
        const { id_agendamiento, id_socio, id_profesor, 
                fecha_agendamiento, horario_inicio, horario_hasta, 
                clase_abonada, monto_abonado } = await prisma.agendamiento_clase.create( { 
                                                                                            data : { 
                                                                                                        id_socio : idSocio,
                                                                                                        id_profesor : idProfesor,
                                                                                                        id_mesa : Number( idMesa ),
                                                                                                        fecha_agendamiento : generar_fecha( fechaAgendamiento ),
                                                                                                        horario_inicio : inicio,
                                                                                                        horario_hasta : fin,
                                                                                                        creadoen : new Date(),
                                                                                                        //clase_eliminada : false,
                                                                                                    } 
                                                                                        } );
        const { nombre_profesor } = await prisma.profesores.findUnique( { where : { id_profesor :  Number( idProfesor )} } );
        const { nombre_cmp } = await prisma.socio.findUnique( { where : { id_socio :  Number( idSocio )} } );
        const { desc_mesa, id_mesa } = await prisma.mesas.findUnique( { where : { id_mesa :  Number( idMesa )} } );

        res.status( 200 ).json( {
            status : true,
            msg : "Clase Creada",
            claseAgendada : {
                idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento) , 
                idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                nombreSocio : nombre_cmp,
                nombreProfesor : nombre_profesor,
                idProfesor : id_profesor,
                idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa) ,
                mesa : desc_mesa,
                fechaAgendamiento : fecha_agendamiento, 
                horarioInicio : horario_inicio, 
                horarioHasta : horario_hasta,
                claseAgendada : clase_abonada,
                montoAbonado : monto_abonado
            }
        } );

    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al insertar el registro : ${error}`,
            //error
        } );

    }



}

const editar_una_clase = async ( req = request, res = response ) =>{

    try {
        const { idSocio, idProfesor, fechaAgendamiento, inicio, fin, idMesa, idAgendamiento } = req.body;
        //console.log ( req.body )
        const { id_agendamiento, id_socio, id_profesor, 
                fecha_agendamiento, horario_inicio, horario_hasta, 
                clase_abonada, monto_abonado } = await prisma.agendamiento_clase.update( { 
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
                idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento) , 
                idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                nombreSocio : nombre_cmp,
                nombreProfesor : nombre_profesor,
                idProfesor : id_profesor,
                idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa) ,
                mesa : desc_mesa,
                fechaAgendamiento : fecha_agendamiento, 
                horarioInicio : horario_inicio, 
                horarioHasta : horario_hasta,
                claseAgendada : clase_abonada,
                montoAbonado : monto_abonado
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
        const { idSocio, idProfesor, fechaAgendamiento, inicio, fin, idMesa, idAgendamiento, monto } = req.body;
        
        const { id_agendamiento, id_socio, id_profesor, 
                fecha_agendamiento, horario_inicio, horario_hasta, 
                clase_abonada, monto_abonado } = await prisma.agendamiento_clase.update( { 
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
                idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento) , 
                idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                nombreSocio : nombre_cmp,
                nombreProfesor : nombre_profesor,
                idProfesor : id_profesor,
                idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa) ,
                mesa : desc_mesa,
                fechaAgendamiento : fecha_agendamiento, 
                horarioInicio : horario_inicio, 
                horarioHasta : horario_hasta,
                claseAgendada : clase_abonada,
                montoAbonado : monto_abonado
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

        const { idSocio, idProfesor, fechaAgendamiento, inicio, fin, idMesa, idAgendamiento } = req.body;
        
        const { id_agendamiento, id_socio, id_profesor, 
                fecha_agendamiento, horario_inicio, horario_hasta, 
                clase_abonada, monto_abonado } = await prisma.agendamiento_clase.delete( { where : { id_agendamiento : Number( idAgendamiento ) } } );

        const { nombre_profesor } = await prisma.profesores.findUnique( { where : { id_profesor :  Number( idProfesor )} } );
        const { nombre_cmp } = await prisma.socio.findUnique( { where : { id_socio :  Number( idSocio )} } );
        const { desc_mesa, id_mesa } = await prisma.mesas.findUnique( { where : { id_mesa :  Number( idMesa )} } );
        res.status( 200 ).json( {
            status : true,
            msg : "Clase Borrada",
            claseAgendada : {
                idAgendamiento : (typeof id_agendamiento === 'bigint' ? Number(id_agendamiento.toString()) : id_agendamiento) , 
                idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                nombreSocio : nombre_cmp,
                nombreProfesor : nombre_profesor,
                idProfesor : id_profesor,
                idMesa : (typeof id_mesa === 'bigint' ? Number(id_mesa.toString()) : id_mesa) ,
                mesa : desc_mesa,
                fechaAgendamiento : fecha_agendamiento, 
                horarioInicio : horario_inicio, 
                horarioHasta : horario_hasta,
                claseAgendada : clase_abonada,
                montoAbonado : monto_abonado
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


module.exports = {

    agendar_una_clase,
    editar_una_clase,
    abonar_una_clase,
    obtener_clases_del_dia,
    obtener_clases_x_profesor_dia,
    eliminar_clase_con_profesor,
    obtener_clases_del_dia_x_socio

}