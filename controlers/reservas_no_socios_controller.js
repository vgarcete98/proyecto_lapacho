const { request, response } = require('express')

const { PrismaClient, Prisma } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();


const obtener_reservas_en_club_no_socio = async ( req = request, res = response ) => {

    //DEVUELVO TODAS LAS RESERVAS EN EL CLUB
    try {

        const { fecha_desde, 
                fecha_hasta, 
                pagina, 
                nombre,
                apellido,
                nro_cedula  } = req.query;


        const [ dia_desde, mes_desde, annio_desde ] = fecha_desde.split( '/' );
    
        const [ dia_hasta, mes_hasta, annio_hasta ] = fecha_hasta.split( '/' );
    
        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;
    
        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;   


        const query = `SELECT A.ID_RESERVA_NO_SOCIO AS "idReservaNoSocio", 
                                A.ID_MESA AS "idMesa",
                                C.DESC_MESA AS "descMesa",
                                A.NOMBRE || ', ' || A.APELLIDO AS "nombreCmp",
                                A.FECHA_RESERVA AS "fechaReserva",
                                A.HORA_DESDE AS "horaDesde",
                                A.HORA_HASTA AS "horaHasta",
                                A.ABONADO as "abonado",
                                json_agg(
                                json_build_object(
                                'idInvitado', B.id_invitado,
                                'nombreInvitado', B.nombre || ', ' || B.apellido ,
                                'cedula', B.cedula)
                                ) AS "invitados"
                            FROM RESERVA_NO_SOCIO A JOIN INVITADOS B ON A.ID_RESERVA_NO_SOCIO = B.ID_RESERVA_NO_SOCIO
                            JOIN MESAS C ON C.ID_MESA = A.ID_MESA
                        WHERE A.fecha_reserva BETWEEN TIMESTAMP '${fecha_desde_format}' AND TIMESTAMP '${fecha_hasta_format}'
                                ${ ( nombre === undefined ) ? `` : `AND A.nombre  LIKE '%${ nombre }%'` }
                                ${ ( apellido === undefined ) ? `` : `AND A.apellido  LIKE '%${ apellido }%'` }
                                ${ ( nro_cedula === undefined ) ? `` : `AND A.cedula  = '${ nro_cedula }'` }
                        GROUP BY A.ID_RESERVA_NO_SOCIO, 
                                A.ID_MESA,
                                C.DESC_MESA,
                                A.NOMBRE || ', ' || A.APELLIDO,
                                A.FECHA_RESERVA,
                                A.HORA_DESDE,
                                A.HORA_HASTA,
                                A.ABONADO
                        ORDER BY A.fecha_reserva DESC
                        LIMIT 10 OFFSET ${Number(pagina) -1 }`;
        //console.log( query );
        const reservasClubNoSocio = await prisma.$queryRawUnsafe( query );
        
        if ( reservasClubNoSocio.length === 0 ) {
            res.status( 200 ).json( {
                reservas : false,
                msg : "No existen reservas",
                reservasClubNoSocio
            } );
        } else {

            res.status( 200 ).json( {
                reservas : true,
                msg : "Reservas del club",
                reservasClubNoSocio
            } );
        }        
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo obtener las reservas del club ${ error }`,
            //error
        } );

    }

}




const crear_reserva_en_club_no_socio = async ( req = request, res = response ) => {

    try {

        const {  horaDesde, horaHasta, idMesa, invitados, abonado, montoReserva, cantInvitados, nombre, apellido } = req.body;


        const nueva_reserva = await prisma.reserva_no_socio.create( { data : {
                                                                            fecha_reserva : new Date(),
                                                                            fecha_creacion : new Date(),
                                                                            apellido,
                                                                            nombre,
                                                                            
                                                                            //fecha_reserva : generar_fecha( fechaAgendamiento ),
                                                                            hora_desde : generar_fecha(horaDesde),
                                                                            hora_hasta : generar_fecha(horaHasta),
                                                                            id_mesa : idMesa,
                                                                            abonado : abonado,
                                                                            monto_x_hora : Number(montoReserva),    
                                                                            cant_invitados : Number( cantInvitados )
                                                                        } 
                                                                    });
        //console.log( nueva_reserva)
        const { fecha_creacion, fecha_reserva, hora_desde, 
                hora_hasta, id_mesa, cedula, id_reserva_no_socio  } = nueva_reserva;
        
        const { desc_mesa } = await prisma.mesas.findUnique(  { where : { id_mesa : Number(idMesa) } } );

        res.status( 200 ).json( {
            status : true,
            msg : "Reserva creada exitosamente",
            reserva : {
                idNoSocioReserva : id_reserva_no_socio,
                nombreCmp : nueva_reserva.nombre + ', ' + nueva_reserva.apellido,
                cedula,
                //fechaAgendamiento : fecha_reserva,
                fechaCreacion : fecha_creacion,
                horaDesde : hora_desde,
                horaHasta : hora_hasta,
                descMesa : desc_mesa,
                idMesa : Number(typeof( id_mesa ) === 'bigint' ? id_mesa.toString() : id_mesa),
            }
        } );
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Reserva no generada : ${error }`,
            //error
        } );
        
    }



}




const obtener_mesas_disponibles_x_horario = async ( req = request, res = response ) => {

    try {
        const { horaDesde, horaHasta } = req.body;

        const reservas = await prisma.reservas.findMany( { 
                                                                    where : {  
                                                                        hora_desde : { gte : new Date( horaDesde ) },
                                                                        hora_hasta : { lte : new Date( horaHasta ) }
                                                                    }
                                                                } );
        
        let mesasDisponibles = [];
        
        const mesas = await prisma.mesas.findMany( );

        reservas.forEach( ( element ) =>{

            const { id_mesa } = element;

            mesas.forEach( ( element, index ) => { 
                if ( element.id_mesa !== id_mesa ){
                    mesasDisponibles.push( {
                                                idMesa : (typeof(mesas[ index ].id_mesa) === 'bigint') ? Number( mesas[ index ].id_mesa.toString() ) : mesas[ index ].id_mesa,
                                                descMesa : mesas[ index ].desc_mesa
                                            } );

                }
            } );
        } );

        res.status( 200 ).json( {
            status : true,
            msg : "Mesas disponibles en horario seleccionado",
            mesasDisponibles
        } );

        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al obtener las mesas para ese horario ${ error }`,
            //error
        } );
    }



}




const editar_reserva_en_club_no_socio = async ( req = request, res = response ) => {

    
    try {
        const { idReserva, idSocio, fechaAgendamiento, horaDesde, horaHasta, idMesa } = req.body;
    
        const fecha_reserva_editada = new Date();
        const reserva_editada = await prisma.reservas.update( {   where : { id_socio_reserva : Number(idReserva) },
                                                                        data : {
                                                                                    id_socio : idSocio,
                                                                                    //fecha_creacion : fechaDeReserva,
                                                                                    fecha_reserva : generar_fecha( fechaAgendamiento ),
                                                                                    hora_desde : generar_fecha(horaDesde),
                                                                                    hora_hasta : generar_fecha(horaHasta),
                                                                                    id_mesa : idMesa,
                                                                                    reserva_editada : fecha_reserva_editada
                                                                                } 
                                                                    } );

        const { fecha_creacion, fecha_reserva, hora_desde, 
                hora_hasta, id_mesa, id_socio, 
                id_socio_reserva, } = reserva_editada;
        
        const { desc_mesa } = await prisma.mesas.findUnique(  { where : { id_mesa : Number(idMesa) } } );
        const socio  = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );
        //console.log( socio )
        const { id_persona, nombre_cmp } = socio;
        res.status( 200 ).json( {
            status : true,
            msg : "Reserva editada exitosamente",
            reserva : {
                idSocioReserva : idSocio,
                nombreCmp : nombre_cmp,
                //fechaAgendamiento : fecha_reserva,
                fechaCreacion : fecha_creacion,
                horaDesde : hora_desde,
                horaHasta : hora_hasta,
                descMesa : desc_mesa,
                idMesa : Number(typeof( id_mesa ) === 'bigint' ? id_mesa.toString() : id_mesa),
                descTipoReserva : desc_tipo_reserva
            }
        } );
        
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Reserva no generada : ${ extraerMensaje( error.message ) }`,
            //error
        } );
    }


}


const borrar_reserva_en_club_no_socio = async ( req = request, res = response ) => {

    try {
        const { idNoSocioReserva } = req.body;
        const reserva_cancelada = await prisma.reserva_no_socio.delete( { 
            where : { id_reserva_no_socio : Number( idNoSocioReserva ) }
        } );

        const { fecha_creacion, fecha_reserva, hora_desde, 
                hora_hasta, id_mesa, id_reserva_no_socio,
                id_socio_reserva } = reserva_cancelada;
        
        const { desc_mesa } = await prisma.mesas.findUnique(  { where : { id_mesa : Number(id_mesa) } } );

        res.status( 200 ).json( {
            status : true,
            msg : "Reserva eliminada exitosamente",
            reserva : {
                idNoSocioReserva : id_reserva_no_socio,
                nombreCmp : reserva_cancelada.nombre + ', ' + reserva_cancelada.apellido,
                //fechaAgendamiento : fecha_reserva,
                fechaCreacion : fecha_creacion,
                horaDesde : hora_desde,
                horaHasta : hora_hasta,
                descMesa : desc_mesa,
                idMesa : Number(typeof( id_mesa ) === 'bigint' ? Number(id_mesa.toString()) : id_mesa),
            }
        } );

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar la reserva ${error} `,
            //error
        } );
        
    }




}



const obtener_mesas_reserva = async ( req = request, res = response ) =>{


    try {
        
        //const query = `SELECT id_mesa, desc_mesa FROM MESAS`;
        const mesas_disponibles = await prisma.mesas.findMany();
        let mesasDisponibles = [];
        if ( mesas_disponibles.length > 0 ){
            mesas_disponibles.forEach( ( element )=> {
                const { desc_mesa, id_mesa } = element;
                //console.log( element );
                mesasDisponibles.push ( {
                    idMesa : (typeof(id_mesa)==='bigint')? Number( id_mesa.toString() ) : id_mesa,
                    descMesa : desc_mesa
                } )

            } )
        }

        
        res.status( 200 ).json( {
            status : true,
            msg : "Mesas disponibles para reserva",
            mesasDisponibles
        } );
        
        
    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar la reserva : ${ error }`,
            //error
        } );

    }

}





module.exports = {
    obtener_reservas_en_club_no_socio,
    crear_reserva_en_club_no_socio,
    borrar_reserva_en_club_no_socio, 
    editar_reserva_en_club_no_socio,
    obtener_mesas_reserva,
    obtener_mesas_disponibles_x_horario,
};