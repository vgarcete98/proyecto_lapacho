const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const MESES_INGLES = [ 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER' ];
const MESES_ESPAÑOL = [ 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AUGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DECIEMBRE' ];



const realizar_pago_socio = async ( req = request, res = response ) => {

    try {
        const { idSocio, 
                idCuotaSocio, 
                nroFactura, 
                numeroCedula, 
                descripcionPago } = req.body;

        //----------------------------------------------------------------------------------------------------------------------------
        const { nombre_cmp } = await prisma.socio.findUnique( { where : { id_socio : Number( idSocio ) } } );

        const { monto_cuota, id_tipo_cuota } = await prisma.cuotas_socio.findUnique( { where : { id_cuota_socio : Number( idCuotaSocio ) } } )

        const { desc_tipo_cuota } = await prisma.tipo_cuota.findUnique( { where : { id_tipo_cuota  } } )
        const pago_socio  = await prisma.pagos_socio.create( {   
                                                                data : {  
                                                                    id_cuota_socio : Number( idCuotaSocio ),
                                                                    monto_abonado : Number( monto_cuota ),
                                                                    nro_factura : nroFactura,
                                                                    fecha_pago : new Date(),
                                                                } 
                                                            } );
        //----------------------------------------------------------------------------------------------------------------------------
        const { id_cuota_socio, fecha_pago, monto_abonado, nro_factura } = pago_socio;
        const idCuotaPagada = id_cuota_socio;
        const { fecha_vencimiento } = await prisma.cuotas_socio.update( { 
                                                                            where : { id_cuota_socio : idCuotaPagada },
                                                                            data : { 
                                                                                        pago_realizado : true,
                                                                                        fecha_pago_realizado : new Date(),
                                                                                        descripcion : descripcionPago 
                                                                                    }
                                                                    } );


        if ( pago_socio === null || pago_socio === undefined){
    
            res.status( 400 ).json(
    
                {
                    status : false,
                    msg : 'No se pudo realizar el pago del socio',
                    pagoSocio : {
                        idCuotaSocio,
                        nombreSocio : nombre_cmp,
                        idSocio,
                        fechaVencimiento : fecha_vencimiento,
                        cuotaMes : MESES_ESPAÑOL[ fecha_vencimiento.getMonth() ],
                        numeroMes : (fecha_vencimiento.getMonth() + 1).toString(),
                        cedula : numeroCedula,
                        fechaPago : fecha_pago,
                        monto : monto_abonado,
                        //nroFactura : nro_factura
                    }
                }
            );
    
        }else {
            res.status( 200 ).json(
    
                {
                    status : true,
                    msg : 'Pago Realizado con exito',
                    pagoSocio : {
                        idCuotaSocio,
                        nombreSocio : nombre_cmp,
                        idSocio,
                        fechaVencimiento : fecha_vencimiento,
                        cuotaMes : MESES_ESPAÑOL[ fecha_vencimiento.getMonth() ],
                        numeroMes : (fecha_vencimiento.getMonth() + 1).toString(),
                        cedula : numeroCedula,
                        fechaPago : fecha_pago,
                        monto : monto_abonado,
                        //nroFactura : nro_factura
                    }
                }
            );
        }
    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : `No se finalizo el pago de cuota  ${ error }`,
            //error
        } );
    }

}




const anular_pagos_cliente = async ( req = request, res = response ) =>{

    try {
        
        const { id_cuota } = req.params;


        //ANTES DE PROCEDER AL BORRADO


        const pago_cuota = await prisma.pagos_socio.findFirst(  { where : { id_cuota_socio : Number(id_cuota) } } );
        const { id_pago_socio } = pago_cuota;

        const cuota_anulada = await prisma.pagos_socio.delete(  { 
                                                                    where : { 
                                                                                id_pago_socio : Number( ( typeof( id_pago_socio ) === 'bigint' )? String( id_pago_socio ): id_pago_socio ) 
                                                                            } 
                                                                } );
        
        const revocar_pago = await prisma.cuotas_socio.update( 
                                                                {
                                                                    where : {
                                                                        id_cuota_socio : cuota_anulada.id_cuota_socio
                                                                    },
                                                                    data : {
                                                                        fecha_pago_realizado : null,
                                                                        pago_realizado : false
                                                                    }
                                                                }
                                                                );

        
        
        res.status( 200 ).json( {
            status : true,
            msg : 'Pago anulado con exito',
            //error
        } );

    } catch (error) {

        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se ha podido procesar la insercion del registro',
            //error
        } );
        
    }

}


const generar_venta_cuota_socio= async ( req = request, res = response ) => {

    try {
        
        const { cuotas } = req.body;
        let pagoCuotas = [];
        let venta_socio = { };
        let ventas_de_cuotas = 0; 
        let query = ``;

        let ingreso_por_cuota = await prisma.tipos_ingreso.findFirst( { 
                                                                        where : { descripcion : 'CUOTAS' },
                                                                        select : {
                                                                            id_tipo_ingreso : true
                                                                        } 
                                                                    } );
        try {
            let cuota ;
            for (let element in cuotas) {
                //----------------------------------------------------------------------------------------------------------------------------
                let { idSocioCuota } = cuotas[element];
                cuota = await prisma.cuotas_socio.findUnique( { 
                                                                where : { 
                                                                            id_cuota_socio : Number( idSocioCuota ),

                                                                        },
                                                                include : {
                                                                    cliente : {
                                                                        select :{
                                                                            cedula : true
                                                                        }
                                                                    },
                                                                }
                                                            } );
                if ( cuota !== null ){
                    let { descripcion, id_cliente, id_cuota_socio, monto_cuota, cliente} = cuota;
                    let { cedula } = cliente;
                    let venta = await prisma.ventas.create( { 
                                                                data : {
                                                                    creado_en : new Date( ),
                                                                    creado_por : 1,
                                                                    estado : 'PENDIENTE DE PAGO',
                                                                    descripcion_venta : descripcion,
                                                                    monto : monto_cuota,
                                                                    cedula : cedula,
                                                                    id_agendamiento : null,
                                                                    id_cliente_reserva : null,
                                                                    id_cuota_socio : id_cuota_socio,
                                                                    id_cliente : id_cliente,
                                                                    id_inscripcion : null,
                                                                    fecha_operacion : new Date(),
                                                                    id_tipo_ingreso : ingreso_por_cuota.id_tipo_ingreso

                                                                }
                                                            } );
                    if( venta !== null ) {
                        console.log( 'Venta generada' );
                        ventas_de_cuotas += 1;
                        let cuota_actualizada = await prisma.cuotas_socio.update( { 
                            where : { id_cuota_socio : id_cuota_socio  },
                            data : {
                                estado : 'PENDIENTE DE PAGO'
                            } 
                        
                        } );
                    }
                    //----------------------------------------------------------------------------------------------------------------------------

                }else {
                    console.log( `No existe la cuota con id ${ idCuotaSocio }` );
                }
            }
            
        } catch (error) {
            console.log( error );
        }

        if ( cuotas.length === ventas_de_cuotas && ventas_de_cuotas > 0) { 

            res.status( 200 ).json(
                {
                    status : true,
                    msg : 'Ventas de cuotas generadas con exito',
                    descripcion : 'Todas las cuotas fueron generadas como ventas'
                }
            );
        }else {
            res.status( 400 ).json(
                {
                    status : true,
                    msg : 'Solo algunas ventas de cuotas fueron generadas con exito',
                    descripcion : `Cantidad de ventas de cuotas procesadas ${ ventas_de_cuotas }, cantidad enviada ${ cuotas.length }`
                }
            );
        }

    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : `No se finalizo el pago de cuotas ${ error }`,
            //error
        } );
    }

}


const realizar_cobro_clases_socio = async ( req = request, res = response ) => {

    try {



        
    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : `No se finalizo el pago de cuotas ${ error }`,
            //error
        } );
    }


}



const realizar_cobro_evento_socio = async ( req = request, res = response ) => {

    try {






        
    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : `No se finalizo el pago de cuotas ${ error }`,
            //error
        } );
    }


}


const generar_mov_caja = async ( req = request, res = response ) => {

    try {






        
    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : `No se finalizo el pago de cuotas ${ error }`,
            //error
        } );
    }


}


const generar_venta_reserva = async ( req = request, res = response ) => {

    try {

        const {  } = req.body;





        
    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : `No se finalizo el pago de cuotas ${ error }`,
            //error
        } );
    }


}











module.exports = {
    realizar_pago_socio,
    realizar_cobro_clases_socio,
    realizar_cobro_evento_socio,
    anular_pagos_cliente,
    generar_venta_cuota_socio
    
}



