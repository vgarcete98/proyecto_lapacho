const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();




const obtener_precios_de_cuotas = async ( req = request, res = response ) => {

    try {
        //OBTIENE TODOS LOS ACCESOS CON SUS ACCIONES CORRESPONDIENTES

        const query = `SELECT A.id_tipo_socio AS "idTipoSocio",
                                A.desc_tipo_socio AS "descTipoSocio",
                                B.id_precio_cuota AS "idPrecioCuota",
                                B.monto_cuota AS "montoCuota",
                                B.desc_tipo_descuento AS "descTipoDescuento",
                                B.porc_descuento AS "porDescuento",
                                (COUNT(*) OVER() ) :: integer AS cantidad,
                                B.creado_en AS "creadoEn"
                            FROM TIPO_SOCIO A JOIN PRECIO_CUOTA B ON A.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                        WHERE B.valido = TRUE`;

        const preciosCuotas = await prisma.$queryRawUnsafe( query );

        if ( preciosCuotas.lenght !== 0 ){

            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Datos de Cuotas de Tipo de Socio',
                    preciosCuotas
                }
            );  
        }else {
            res.status( 400 ).json(
                {
    
                    status : false,
                    msg : 'Datos de Cuotas de Tipo de Socio',
                    descripcion : " No se obtuvo el dato de los precios de cuotas, favor setee los mismos"
                }
            );  
        }
        
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo obtener la lista de precio de cuotas : ${error}`,
            //error
        } );
        
    }


}


const editar_precio_de_cuotas = async ( req = request, res = response ) => {

    try {

        const { idTipoSocio, descTipoSocio, montoCuota, descTipoDescuento, porDescuento } = req.body;

        const precio_cuota_editado = await prisma.precio_cuota.updateMany( {  
                                                                        data : { 
                                                                            valido : false
                                                                        },
                                                                        where : { 
                                                                            AND : [
                                                                                
                                                                                { id_tipo_socio : Number( idTipoSocio ) },
                                                                                { valido : true }

                                                                            ]
                                                                        }
                                                                    } );
        console.log( precio_cuota_editado )
        const { count } = precio_cuota_editado;
        //VEO SI ES QUE SE PUDO EDITAR EFECTIVAMENTE EL ULTIMO PRECIO DE ESA CUOTA
        if (  count > 0 ) {
            const nueva_cuota = await prisma.precio_cuota.create( {
                                                                    data : {
                                                                        monto_cuota : Number( montoCuota ),
                                                                        desc_precio_cuota : "",
                                                                        desc_tipo_descuento : descTipoDescuento,
                                                                        porc_descuento : porDescuento,
                                                                        id_tipo_socio : Number( idTipoSocio ),
                                                                        valido : true
                                                                    }
                                                                } );
    
            const { monto_cuota, id_tipo_socio } = nueva_cuota;
    
            const clientes_a_actualizar = await prisma.cliente.findMany( { 
                                                                            where : { id_tipo_socio : Number( idTipoSocio ) },
                                                                            select : {
                                                                                id_cliente : true
                                                                            } 
                                                                    } );
            console.log( clientes_a_actualizar.map( element => element.id_cliente) )
            const actualizacion_cuotas = await prisma.cuotas_socio.updateMany( {
                                                                                data : { 
                                                                                    monto_cuota : Number( montoCuota ),
    
                                                                                },
                                                                                where : {
                                                                                    AND :[
                                                                                        { id_cliente : { in : clientes_a_actualizar.map( element => element.id_cliente ) } },
                                                                                        { fecha_pago_realizado : null },
                                                                                        { estado : 'PENDIENTE' }
                                                                                    ]
                                                                                }
                                                                            } );
            const cantidad_socios_actualizado = actualizacion_cuotas.count;
            if ( cantidad_socios_actualizado === 0  ){
                res.status( 400 ).json(
                    {
                        status : true,
                        msg : 'Precios de cuotas Actualizado pero no se actualizaron las cuotas de cliente',
                        descripcion : `No se logro actualizar todos los precios de los socios`
                    }
                ); 
            }
            res.status( 200 ).json(
                {
                    status : true,
                    msg : 'Precios de cuotas Actualizado',
                    descripcion : `Precio de cuota actualizado para socio : ${ descTipoSocio }`
                }
            );      

        }else {
            res.status( 200 ).json(
                {
                    status : true,
                    msg : 'No se logro editar siquiera el precio de las cuotas',
                    descripcion : `Favor intente de nuevo realizar la actualizacion`
                }
            );     
        }
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo editar la lista de precio de las cuotas : ${error}`,
            //error
        } );
        
    }


}

const agregar_precio_de_cuota = async ( req = request, res = response ) => {

    try {

        const { idTipoSocio, descTipoSocio, idPrecioCuota, montoCuota, descTipoDescuento, porDescuento } = req.body;


        res.status( 200 ).json(
            {
                status : true,
                msg : 'Accesos para usuarios',
                accesosDisponibles
            }
        );      
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo obtener la lista de roles : ${error}`,
            //error
        } );
        
    }


}




const editar_precio_de_reservas = async ( req = request, res = response ) => {

    try {

        const {  montoReserva, descTipoDescuento, porDescuento } = req.body;


        const nuevo_precio = await prisma.precio_reservas.create( { 
                                                                    data : {
                                                                        monto_reserva : Number( montoReserva ),
                                                                        porc_descuento : Number( porDescuento ),
                                                                        desc_tipo_descuento : descTipoDescuento,
                                                                        creado_en : new Date(),
                                                                        fecha_precio : new Date(),
                                                                        valido : true
                                                                    },
                                                                    select : {
                                                                        id_precio_reserva : true
                                                                    }
                                                                } );
        if ( nuevo_precio !== null ){
            const { id_precio_reserva } = nuevo_precio;
            //HAY QUE ACTUALIZAR TODOS LOS DEMAS PRECIOS PARA QUE SOLO TOME EL ULTIMO QUE SE ESTABLECIO
            const actualizar_precios = await prisma.precio_reservas.updateMany( { 
                                                                                data : {
                                                                                    valido : false,

                                                                                },
                                                                                where : {
                                                                                    AND : [

                                                                                        { valido : true },
                                                                                        { 
                                                                                            id_precio_reserva :{
                                                                                                not : id_precio_reserva
                                                                                            } 
                                                                                        }
                                                                                    ]
                                                                                } 
                                                                            } );
            if ( actualizar_precios.count !== 0 ){
                console.log( `Precios de reservas actualizado` );

                res.status( 200 ).json(
                    {
                        status : true,
                        msg : 'Accesos para usuarios',
                        descripcion : 'Se ha actualizado el precio de las reservas'
                    }
                );      

            }else {
                
            }                                                              
        }else {
            res.status( 400 ).json(
                {
                    status : true,
                    msg : 'No se actualizo ningun precio de reserva',
                    descripcion : 'No se ha actualizado el precio de las reservas'
                }
            );   
        }


    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo actualizar el precio de las reservas : ${error}`,
            //error
        } );
        
    }


}



const obtener_precio_de_reservas = async ( req = request, res = response ) => {

    try {

        //VAMOS A TOMAR EL ULTIMO PRECIO DE RESERVA QUE TENEMOS
        const ultimo_precio_reservas = await prisma.precio_reservas.findFirst( { 
                                                                                    where : {
                                                                                        valido : true
                                                                                    },
                                                                                    orderBy : {
                                                                                        id_precio_reserva : 'desc'
                                                                                    },
                                                                                    select : {
                                                                                        id_precio_reserva : true,
                                                                                        monto_reserva : true,
                                                                                        fecha_precio : true,
                                                                                        creado_en : true,
                                                                                        valido : true
                                                                                    }
                                                                                } );
        if ( ultimo_precio_reservas !== null ) {

            const { id_precio_reserva, monto_reserva, fecha_precio, creado_en, valido } = ultimo_precio_reservas;
            res.status( 200 ).json(
                {
                    status : true,
                    msg : 'Ultimo precio de reserva seteado',
                    precioReserva : {
                        idPrecioReserva : id_precio_reserva, 
                        montoReserva : monto_reserva, 
                        fechaPrecio : fecha_precio, 
                        creadoEn : creado_en, 
                        valido
                    }
                }
            );    
        }else {

            res.status( 400 ).json(
                {
                    status : true,
                    msg : 'No se pudo obtener el ultimo precio de reserva disponible',
                    descripcion : 'Verifique si tiene precios de reserva creados'
                }
            );      
        }


    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo obtener la lista de precios de reservas : ${error}`,
            //error
        } );
        
    }


}










module.exports = {
    obtener_precios_de_cuotas,
    editar_precio_de_cuotas,
    agregar_precio_de_cuota,
    editar_precio_de_reservas,
    obtener_precio_de_reservas
}


