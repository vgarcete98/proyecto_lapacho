const { request, response } = require('express')

const { PrismaClient, Prisma } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();


const extraerMensaje = (str = '') => {
    //console.log( str )
    const jsonStart = str.indexOf('message:');
    const jsonEnd = str.lastIndexOf('}') + 1;

    const [ mensaje1, mensaje2, ...resto ] = str.substring(jsonStart, jsonEnd).split( ',' ) ;
    return mensaje2;
};


const obtener_reservas_en_club = async ( req = request, res = response ) => {

    //DEVUELVO TODAS LAS RESERVAS EN EL CLUB
    try {

        const { fecha_desde, 
                fecha_hasta, 
                pagina, 
                idUsuario,
                nombre_socio,
                apellido_socio,
                nro_cedula  } = req.query;

        const query = `SELECT CAST(A.id_socio_reserva AS INTEGER) AS "idSocioReserva", 
                        		C.nombre || ', ' || C.apellido AS "nombreCmp",
                        		A.fecha_reserva AS "fechaReserva",
                        		A.fecha_creacion AS "fechaCreacion",
                        		A.hora_desde AS "horaDesde",
                        		A.hora_hasta AS "horaHasta",
                        		D.desc_mesa AS "descMesa",
                        		CAST(D.id_mesa AS INTEGER) AS "idMesa"
                        	FROM RESERVAS A JOIN SOCIO B ON A.id_socio = B.id_socio
                        	JOIN PERSONA C ON C.id_persona = B.id_persona
                        	JOIN MESAS D ON D.id_mesa = A.id_mesa
                            JOIN PERSONA F ON F.id_persona = B.id_persona
                        WHERE A.fecha_reserva BETWEEN TIMESTAMP '${fecha_desde}' AND TIMESTAMP '${fecha_hasta}'
                                ${ ( idUsuario === undefined ) ? `` : `AND B.id_socio = ${ idUsuario }` }
                                ${ ( nombre_socio === undefined ) ? `` : `AND B.nombre_cmp  LIKE '%${ nombre_socio }%'` }
                                ${ ( apellido_socio === undefined ) ? `` : `AND B.nombre_cmp  LIKE '%${ apellido_socio }%'` }
                                ${ ( nro_cedula === undefined ) ? `` : `AND F.cedula  = '${ nro_cedula }'` }
                        ORDER BY A.fecha_reserva DESC
                        LIMIT 10 OFFSET ${Number(pagina) -1 };`;
        console.log( query );
        reservasClub = await prisma.$queryRawUnsafe( query );
        
        if ( reservasClub.length === 0 ) {
            res.status( 200 ).json( {
                reservas : false,
                msg : "No existen reservas",
                reservasClub
            } );
        } else {

            res.status( 200 ).json( {
                reservas : true,
                msg : "Reservas del club",
                reservasClub
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




const crear_reserva_en_club = async ( req = request, res = response ) => {

    try {

        const {  idSocio, fechaReserva, horaDesde, horaHasta, idMesa } = req.body;


        const nueva_reserva = await prisma.reservas.create( { data : {
                                                                        id_socio : Number(idSocio),
                                                                        fecha_creacion : new Date(),
                                                                        fecha_reserva : generar_fecha( fechaReserva ),
                                                                        hora_desde : generar_fecha(horaDesde),
                                                                        hora_hasta : generar_fecha(horaHasta),
                                                                        id_mesa : idMesa,

                                                                    } 
                                                                });
        //console.log( nueva_reserva)
        const { fecha_creacion, fecha_reserva, hora_desde, 
                hora_hasta, id_mesa, id_socio, 
                id_socio_reserva, id_tipo_reserva, reserva_editada, reserva_eliminada } = nueva_reserva;
        
        const { desc_mesa } = await prisma.mesas.findUnique(  { where : { id_mesa : Number(idMesa) } } );
        const socio  = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );
        //console.log( socio )
        const { id_persona, nombre_cmp } = socio;
        res.status( 200 ).json( {
            status : true,
            msg : "Reserva creada exitosamente",
            reserva : {
                idSocioReserva : idSocio,
                nombreCmp : nombre_cmp,
                fechaReserva : fecha_reserva,
                fechaCreacion : fecha_creacion,
                horaDesde : hora_desde,
                horaHasta : hora_hasta,
                descMesa : desc_mesa,
                idMesa : Number(typeof( id_mesa ) === 'bigint' ? id_mesa.toString() : id_mesa),
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







const editar_reserva_en_club = async ( req = request, res = response ) => {

    
    try {
        const { idReserva, idSocio, fechaReserva, horaDesde, horaHasta, idMesa } = req.body;
    
        const fecha_reserva_editada = new Date();
        const reserva_editada = await prisma.reservas.update( {   where : { id_socio_reserva : Number(idReserva) },
                                                                        data : {
                                                                                    id_socio : idSocio,
                                                                                    //fecha_creacion : fechaDeReserva,
                                                                                    fecha_reserva : generar_fecha( fechaReserva ),
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
                fechaReserva : fecha_reserva,
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


const borrar_reserva_en_club = async ( req = request, res = response ) => {

    try {
        const { idReserva, idSocio, fechaReserva, horaDesde, horaHasta, idMesa } = req.body;
        const reserva_cancelada = await prisma.reservas.delete( { 
            where : { id_socio_reserva : Number( idReserva ) }
        } );

        const { fecha_creacion, fecha_reserva, hora_desde, 
                hora_hasta, id_mesa, id_socio, 
                id_socio_reserva, id_tipo_reserva } = reserva_cancelada;
        
        const { desc_mesa } = await prisma.mesas.findUnique(  { where : { id_mesa : Number(idMesa) } } );
        const socio  = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );
        const { id_persona, nombre_cmp } = socio;

        res.status( 200 ).json( {
            status : true,
            msg : "Reserva eliminada exitosamente",
            reserva : {
                idSocioReserva : Number(typeof( id_socio_reserva ) === 'bigint' ? Number(id_socio_reserva.toString()) : id_socio_reserva),
                nombreCmp : nombre_cmp,
                fechaReserva : fecha_reserva,
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
    obtener_reservas_en_club,
    crear_reserva_en_club,
    borrar_reserva_en_club, 
    editar_reserva_en_club,
    obtener_mesas_reserva
};
