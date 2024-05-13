const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const obtener_reservas_en_club = async ( req = request, res = response ) => {

    //DEVUELVO TODAS LAS RESERVAS EN EL CLUB
    try {

        const { fecha_desde, fecha_hasta, pagina  } = req.query;

        const query = `SELECT A.id_socio_reserva, 
                        		C.nombre || ', ' || C.apellido AS nombre_cmp,
                        		A.fecha_reserva,
                        		A.fecha_creacion,
                        		A.hora_desde,
                        		A.hora_hasta,
                        		D.desc_mesa,
                        		D.id_mesa,
                        		F.desc_tipo_reserva
                        	FROM RESERVAS A JOIN SOCIO B ON A.id_socio = B.id_socio
                        	JOIN PERSONA C ON C.id_persona = B.id_persona
                        	JOIN MESAS D ON D.id_mesa = A.id_mesa
                        	JOIN TIPO_RESERVA F ON F.id_tipo_reserva = A.id_tipo_reserva
                        WHERE A.fecha_reserva BETWEEN DATE '${fecha_desde}' AND DATE '${fecha_hasta}'
                        ORDER BY A.fecha_reserva DESC
                        LIMIT 20 OFFSET ${Number(pagina)};`;
        let reservas_club = [];
        let reservasClub = [];
        reservas_club = await prisma.$queryRawUnsafe( query );
        
        if ( reservas_club.length === 0 ) {
            res.status( 200 ).json( {
                reservas : false,
                msg : "No existen reservas",
                reservasClub
            } );
        } else {

            reservasClub = reservas_club.map( ( element )=> { 
                
                const { id_socio_reserva, nombre_cmp, fecha_reserva, 
                        fecha_creacion, hora_desde, hora_hasta,
                        desc_mesa, id_mesa, desc_tipo_reserva } = element;
                return {
                    idSocioReserva : id_socio_reserva,
                    nombreCmp : nombre_cmp,
                    fechaReserva : fecha_reserva,
                    fechaCreacion : fecha_creacion,
                    horaDesde : hora_desde,
                    horaHasta : hora_hasta,
                    descMesa : desc_mesa,
                    idMesa : id_mesa,
                    descTipoReserva : desc_tipo_reserva
                };


            });


            res.status( 200 ).json( {
                reservas : true,
                msg : "Reservas del club",
                reservasClub
            } );
        }        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener las reservas del club',
            //error
        } );

    }

}




const crear_reserva_en_club = async ( req = request, res = response ) => {

    try {

        //id_socio_reserva, 
        //nombre || ' ' || C.apellido AS nombre_cmp,
        //fecha_reserva,
        //fecha_creacion,
        //hora_desde,
        //hora_hasta,
        //desc_mesa,
        //id_mesa,
        //desc_tipo_reserva


        const { idTipo, idSocio, fechaReserva, horaDesde, horaHasta, idMesa } = req.body;
        //console.log( req.body )
        const fechaDeReserva = new Date();
        
        const [ dia, mes, annio ] = fechaReserva.split( "/" );
        //console.log ( new Date( annio, mes, dia ) );
        const nueva_reserva = await prisma.reservas.create( { data : {
                                                                        id_socio : Number(idSocio),
                                                                        fecha_creacion : fechaDeReserva,
                                                                        id_tipo_reserva : Number(idTipo),
                                                                        fecha_reserva : new Date( annio, Number(mes) -1, dia ),
                                                                        hora_desde : horaDesde,
                                                                        hora_hasta : horaHasta,
                                                                        id_mesa : idMesa
                                                                    } 
                                                                });

        const { fecha_creacion, fecha_reserva, hora_desde, 
                hora_hasta, id_mesa, id_socio, 
                id_socio_reserva, id_tipo_reserva, reserva_editada, reserva_eliminada } = nueva_reserva;
        
        const { desc_mesa } = await prisma.mesas.findUnique(  { where : { id_mesa : Number(idMesa) } } );
        const socio  = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );
        //console.log( socio )
        const { id_persona, nombre_cmp } = socio;
        const { desc_tipo_reserva } = await prisma.tipo_reserva.findUnique( { where : { id_tipo_reserva : Number( idTipo ) } } );
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
                descTipoReserva : desc_tipo_reserva
            }
        } );
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Reserva no generada : ${error}`,
            //error
        } );
        
    }



}





const editar_reserva_en_club = async ( req = request, res = response ) => {

    
    try {
        const { id_reserva } = req.params;
        const { idTipo, idSocio, fechaReserva, horaDesde, horaHasta, idMesa } = req.body;
    
        const fecha_reserva_editada = new Date();
        const [ dia, mes, annio ] = fechaReserva.split( "/" );
        const reserva_editada = await prisma.reservas.update( {   where : { id_socio_reserva : id_reserva },
                                                                        data : {
                                                                                    id_socio : idSocio,
                                                                                    //fecha_creacion : fechaDeReserva,
                                                                                    id_tipo_reserva : idTipo,
                                                                                    fecha_reserva : new Date( annio, Number(mes) -1, dia ),
                                                                                    hora_desde : horaDesde,
                                                                                    hora_hasta : horaHasta,
                                                                                    id_mesa : idMesa,
                                                                                    reserva_editada : fecha_reserva_editada
                                                                                } 
                                                                    } );

        const { fecha_creacion, fecha_reserva, hora_desde, 
                hora_hasta, id_mesa, id_socio, 
                id_socio_reserva, id_tipo_reserva } = reserva_editada;
        
        const { desc_mesa } = await prisma.mesas.findUnique(  { where : { id_mesa : Number(idMesa) } } );
        const socio  = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );
        //console.log( socio )
        const { id_persona, nombre_cmp } = socio;
        const { desc_tipo_reserva } = await prisma.tipo_reserva.findUnique( { where : { id_tipo_reserva : Number( idTipo ) } } );
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
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al editar la reserva",
            //error
        } );
    }


}


const borrar_reserva_en_club = async ( req = request, res = response ) => {

    try {

        //id_socio_reserva, 
        //nombre || ' ' || C.apellido AS nombre_cmp,
        //fecha_reserva,
        //fecha_creacion,
        //hora_desde,
        //hora_hasta,
        //desc_mesa,
        //id_mesa,
        //desc_tipo_reserva
        
        const { id_reserva_socio } = req.params;
    
        const fecha_reserva_editada = new Date();

        const reserva_cancelada = await prisma.reservas.delete( { 
            where : { id_socio_reserva : id_reserva_socio }
        } );

        const { fecha_creacion, fecha_reserva, hora_desde, 
                hora_hasta, id_mesa, id_socio, 
                id_socio_reserva, id_tipo_reserva } = reserva_editada;
        
        const { desc_mesa } = await prisma.mesas.findUnique(  { where : { id_mesa : Number(idMesa) } } );
        const socio  = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );
        //console.log( socio )
        const { id_persona, nombre_cmp } = socio;
        const { desc_tipo_reserva } = await prisma.tipo_reserva.findUnique( { where : { id_tipo_reserva : Number( idTipo ) } } );

        res.status( 200 ).json( {
            status : true,
            msg : "Reserva eliminada exitosamente",
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
                mesasDisponibles.push ( {
                    idMesa : id_mesa,
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
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al eliminar la reserva",
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
