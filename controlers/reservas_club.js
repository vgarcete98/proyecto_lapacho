const { request, response } = require('express')

const { PrismaClient, Prisma } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const axios = require('axios');
const prisma = new PrismaClient();

//const url = env("URL_BASE");

const instance = axios.create({
    baseURL: 'url',
    timeout: 1000,
    //headers: {'X-Custom-Header': 'foobar'}
  });



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


        const [ dia_desde, mes_desde, annio_desde ] = fecha_desde.split( '/' );
    
        const [ dia_hasta, mes_hasta, annio_hasta ] = fecha_hasta.split( '/' );
    
        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;
    
        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;   


        const query = `SELECT A.id_cliente_reserva AS "idClienteReserva", 
                        		B.nombre || ', ' || B.apellido AS "nombreCmp",
                        		A.fecha_reserva AS "fechaAgendamiento",
                        		A.fecha_creacion AS "fechaCreacion",
                        		A.hora_desde AS "horaDesde",
                        		A.hora_hasta AS "horaHasta",
                        		D.desc_mesa AS "descMesa",
                        		CAST(D.id_mesa AS INTEGER) AS "idMesa",
                                A.tipo_ingreso AS "tipoIngreso"
                        	FROM RESERVAS A JOIN CLIENTE B ON A.id_cliente = B.id_cliente
                        	LEFT JOIN MESAS D ON D.id_mesa = A.id_mesa
                        WHERE A.hora_desde BETWEEN TIMESTAMP '${fecha_desde_format}' AND TIMESTAMP '${fecha_hasta_format}'
                                ${ ( idUsuario === undefined ) ? `` : `AND B.id_cliente = ${ idUsuario }` }
                                ${ ( nombre_socio === undefined ) ? `` : `AND B.nombre_cmp  LIKE '%${ nombre_socio }%'` }
                                ${ ( apellido_socio === undefined ) ? `` : `AND B.nombre_cmp  LIKE '%${ apellido_socio }%'` }
                                ${ ( nro_cedula === undefined ) ? `` : `AND B.cedula  = '${ nro_cedula }'` }
                        ORDER BY A.fecha_reserva DESC
                        LIMIT 10 OFFSET ${Number(pagina) -1 };`;
        //console.log( query );
        const reservasClub = await prisma.$queryRawUnsafe( query );
        
        if ( reservasClub.length === 0 ) {

            res.status( 400 ).json( {
                status : false,
                msg : 'No se lograron obtener las Reservas para esas fechas',
                descripcion : `No existe ninguna reserva generada entre esas fechas`
            } );
        } else {
            
            res.status( 200 ).json( {
                reservas : true,
                msg : "Reservas del club para esas fechas",
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

        const { idCliente, horaDesde, horaHasta, idMesa, idPrecioReserva, montoReserva, tipoIngreso } = req.body;
        
        //-----------------------------------------------------------------------------------------
        //PRIMERAMENTE VAMOS A BUSCAR EL PRECIO ESTABLECIDO PARA QUE SEA UN POCO MAS DINAMICO
        let fecha_desde = generar_fecha(horaDesde),
            fecha_hasta = generar_fecha(horaHasta);
        //-----------------------------------------------------------------------------------------

        //console.log( montoReserva );
        //console.log( tipoIngreso );
        const nueva_reserva = await prisma.reservas.create( { 
                                                                    data : {
                                                                        id_cliente : Number(idCliente),
                                                                        fecha_creacion : new Date(),
                                                                        //fecha_reserva : generar_fecha( fechaAgendamiento ),
                                                                        fecha_reserva : new Date(),
                                                                        hora_desde : (tipoIngreso !== 'RESERVA EXPRESS')? fecha_desde : new Date(),
                                                                        hora_hasta : (tipoIngreso !== 'RESERVA EXPRESS')? fecha_hasta : null,
                                                                        id_mesa : (tipoIngreso !== 'RESERVA EXPRESS')? Number(idMesa) : null,
                                                                        estado : 'PENDIENTE',
                                                                        monto : Number(montoReserva),
                                                                        creado_en : new Date(),
                                                                        id_precio_reserva : Number( idPrecioReserva ),
                                                                        creado_por : 1,
                                                                        tipo_ingreso : tipoIngreso
                                                                    } 
                                                                });
        
        if ( nueva_reserva !== null ) {
            const { id_mesa, id_cliente } = nueva_reserva;
            const mesa = await prisma.mesas.findUnique(  { where : { id_mesa : Number(id_mesa) } } );
            const cliente  = await prisma.cliente.findUnique( { where : { id_cliente : Number( id_cliente ) } } );
            if (tipoIngreso !== 'RESERVA EXPRESS') {

                res.status( 200 ).json( {
                    status : true,
                    msg : "Reserva creada exitosamente",
                    descripcion : `Reserva creada, horarios ${ horaDesde }, ${ horaHasta }, Cliente : ${ cliente.apellido }, ${ cliente.nombre }`
                } );
            }else {
                res.status( 200 ).json( {
                    status : true,
                    msg : "Reserva Express creada exitosamente",
                    descripcion : `Reserva express creada, Cliente : ${ cliente.apellido }, ${ cliente.nombre }`
                } );
            }

        }else {
            res.status( 400 ).json( {
                status : true,
                msg : "Reserva creada exitosamente",
                descripcion : `Se ha generado la reserva pero no asi la venta, favor borrar la reserva y volver a generar`
            } );
        }
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Reserva no generada : Ocurrio un error al generar la reserva : ${error}`,
            //error
        } );
        
    }



}


const crear_reserva_en_club_administrador = async ( req = request, res = response ) => {

    try {

        const {  idCliente, horaDesde, horaHasta, idMesa } = req.body;


        const nueva_reserva = await prisma.reservas.create( { data : {
                                                                        id_cliente : Number(idCliente),
                                                                        fecha_creacion : new Date(),
                                                                        
                                                                        //fecha_reserva : generar_fecha( fechaAgendamiento ),
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
            descripcion : `Horario de la reserva ${ hora_desde } a ${ hora_hasta }, en mesa ${ id_mesa } `
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


const obtener_mesas_disponibles_x_horario = async ( req = request, res = response ) => {

    try {
        const { horaDesde, horaHasta } = req.body;

        const reservas = await prisma.reservas.findMany( { 
                                                            where : {  
                                                                hora_desde : { gte : new Date( horaDesde ) },
                                                                hora_hasta : { lte : new Date( horaHasta ) }
                                                            },
                                                            select : {
                                                                id_mesa : true
                                                            },
                                                            distinct : ['id_mesa']
                                                        } );

        let mesasDisponibles = [];
        let mesas = [];
        if ( reservas !== null && reservas !== undefined && reservas.length !== 0 ){

            
            mesas = await prisma.mesas.findMany( { 
                                            where : { 
                                                id_mesa : { notIn : reservas.map(element => element.id_mesa) }
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




const editar_reserva_en_club = async ( req = request, res = response ) => {

    
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


const borrar_reserva_en_club = async ( req = request, res = response ) => {

    try {
        const { idReserva, idSocio, fechaReserva, horaDesde, horaHasta, idMesa } = req.body;
        const reserva_cancelada = await prisma.reservas.update( { 
            where : { id_socio_reserva : Number( idReserva ) },
            data : {  
                estado : 'CANCELADO',
                reserva_editada : new Date(),

            }
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





const realizar_reserva_via_bff = async ( req = request, res = response ) =>{


    try {
        
        const { acceso } = req.body;
        let data = {};

        if ( acceso === 'ADMINISTRADOR' ){

            const { id_socio } = req.body;
            if ( id_socio === undefined || id_socio === null ) {
                throw new Error('Debe proporcionar la clave de usuario para realizar la reserva');
            }else {

                //SE DEBE DE REALIZAR LA PETICION NORMALMENTE
                await instance.post('/user', {
                    firstName: 'Fred',
                    lastName: 'Flintstone'
                })
                .then(function (response) {
                  console.log(response);
                })
                .catch(function (error) {
                  console.log(error);
                });


            }
        }else{

            //REALIZAR EL POST PERO HACIA OTRA RUTA
            await instance.post('/user', {
                firstName: 'Fred',
                lastName: 'Flintstone'
            })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });

        }    
        
    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar la reserva : ${ error }`,
            //error
        } );

    }

}



const agregar_reserva_a_venta = async ( req = request, res = response ) =>{


    try {
        
        const { reservas } = req.body;
        
        let reservas_añadidas = 0;
        let ingreso_por_reserva = await prisma.tipos_ingreso.findFirst( { 
            where : { descripcion : 'ALQUILER CLUB MESAS' },
            select : {
                id_tipo_ingreso : true
            } 
        } );

        for (const element of reservas) {
            
            try {
                let { idReserva } = element;
                
                let reserva = await prisma.reservas.findUnique( { where : { id_cliente_reserva : Number( idReserva ) } } );
                let  { id_cliente_reserva, id_cliente, id_mesa, monto, fecha_reserva } = reserva;
                let cliente = await prisma.cliente.findUnique( { where : { id_cliente : id_cliente } } )

                if ( reserva !== null  ) { 

                    let nueva_venta = await prisma.ventas.create( {
                        data :  {
                            creado_en : new Date(),
                            creado_por : 1,
                            descripcion_venta : `RESERVA DE MESA ${ id_mesa }, ${ cliente.apellido } ${ cliente.nombre }`,
                            monto : monto,
                            estado : 'PENDIENTE DE PAGO',
                            fecha_operacion : new Date(),
                            cedula : cliente.cedula,
                            id_cliente : cliente.id_cliente,
                            id_inscripcion : null,
                            id_cuota_socio : null,
                            id_cliente_reserva : Number(idReserva),
                            id_agendamiento : null,
                            id_tipo_ingreso : ingreso_por_reserva.id_tipo_ingreso
                        }
                    } );
                    console.log( nueva_venta )
                    if( nueva_venta !== null ) {

                        reservas_añadidas += 1;
                    }
                }
            } catch (error) {
                console.log ( error )
            }

        }

        if ( reservas_añadidas > 0 && reservas_añadidas ===  reservas.length){

            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Ventas Creadas',
                    descripcion : `Todas las Ventas fueron generadas con exito`
                }
            );   
        }else {
            res.status( 400 ).json(
                {
    
                    status : true,
                    msg : 'No se lograron crear todas las ventas que se adjunto',
                    descripcion : `Ventas que fueron generadas con exito ${ reservas_añadidas }, Ventas fallidas ${ reservas.length - reservas_añadidas }`
                }
            ); 
        }
        
        
    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar la reserva : ${ error }`,
            //error
        } );

    }

}

const setear_precio_reservas = async ( req = request, res = response ) =>{


    try {
        
        const { fechaPrecio, monto } = req.body;

        const monto_nuevo = await prisma.precio_reservas.create( { 
                                                                    data : {
                                                                        monto_reserva : Number( monto ),
                                                                        creado_en: new Date(),
                                                                        fecha_precio : new Date(fechaPrecio),
                                                                        valido : true,
                                                                        porc_descuento : 0
                                                                    } 
                                                                } );


        if ( monto_nuevo !== null ){

            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Precio de las reservas establecido',
                    descripcion : `El precio nuevo de la reserva fue fijado correctamente`
                }
            );   
        }else {
            res.status( 400 ).json(
                {
    
                    status : false,
                    msg : 'No se logro setear el precio que se adjunto',
                    descripcion : `Favor intente de nuevo, hubo un error al fijar el precio de las reservas`
                }
            ); 
        }
        
        
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
    obtener_mesas_reserva,
    obtener_mesas_disponibles_x_horario,
    realizar_reserva_via_bff,
    crear_reserva_en_club_administrador,
    agregar_reserva_a_venta,
    setear_precio_reservas
};
