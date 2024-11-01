const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const generar_documentos_factura = async ( req = request, res = response )=>{

    try {

        const { nroTimbrado, codEstablecimiento, puntoExpedicion, 
                fechaVencimiento, numeroDesde, numeroHasta,
                rucEmisor, razonSocial } = req.body;

        const timbrado = await prisma.timbrado.create( {  
                                                        data : {
                                                            nro_timbrado : Number( nroTimbrado ),
                                                            fecha_vencimiento : new Date( fechaVencimiento),
                                                            numero_desde : Number( numeroDesde ),
                                                            numero_hasta : Number( numeroHasta ),
                                                            razon_social : razonSocial,
                                                            ruc_emisor : rucEmisor,
                                                            cod_establecimiento : codEstablecimiento,
                                                            punto_expedicion : puntoExpedicion
                                                        }
                                                    } );
        if ( timbrado !== null ){
            console.log( timbrado.numero_desde, timbrado.numero_hasta )
            try {
                
                for (let index = timbrado.numero_desde ; index <= timbrado.numero_hasta; index++) {
                    console.log( "entre al for" )
                    //HAY QUE GENERAR LAS FACTURAS DESDE UN NUMERO HASTA OTRO NUMERO
                    let factura = await prisma.facturas.create( {
                                                                    data : {
                                                                        nro_timbrado : timbrado.nro_timbrado,
                                                                        fecha_emision : null,
                                                                        monto_total : null,
                                                                        nro_factura : `${timbrado.cod_establecimiento}-${timbrado.punto_expedicion}-${index}`,
                                                                        total_iva : null,
                                                                        condicion_venta : null,

                                                                    }
                                                                } );
                }
            } catch (error) {
                console.log( error );
            }

            res.status( 200 ).json( {
                status : true,
                msg : "Timbrado Registrado con exito",
                descripcion : "Todas las facturas fueron generadas con exito"
            } );

        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No Se borro al profesor seleccionado',
                descipcion : `Favor intente realizar el borrado de vuelta`
            } ); 
        }



    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : true,
            msg : `No se pudo obtener los datos para el grafico : ${error}`,
            //data
        } );
    }




}



const obtener_ultimo_nro_factura = async ( req = request, res = response )=>{

    try {

        //PRIMERO BUSCO EL TIMBRADO VALIDO

        const timbrado = await prisma.timbrado.findFirst( { 

            where : { 
                fecha_vencimiento : { 
                    gt : new Date()
                }
            },
            select : {
                nro_timbrado : true
            }
        } );

        const factura = await prisma.facturas.findFirst( { 
                                                                where : { 
                                                                            AND : [ 
                                                                                    { nro_timbrado : timbrado.nro_timbrado },
                                                                                    { fecha_emision : null } 
                                                                                ]
                                                                        },
                                                                select : { 
                                                                    nro_factura : true,
                                                                    nro_timbrado : true
                                                                } 
                                                            } );
        if( factura !== null ) {
            res.status( 200 ).json( {
                status : true,
                msg : "Factura solicitada",
                factura : {
                    nroFactura : factura.nro_factura,
                    timbrado : factura.nro_timbrado
                }
            } );
        }else{
            res.status( 400 ).json( {
                status : false,
                msg : 'No Se encontro una factura valida',
                descipcion : `Favor intente realizar la consulta o registre un timbrado de vuelta`
            } ); 
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : true,
            msg : `No se pudo obtener los datos para el grafico : ${error}`,
            //data
        } );
    }




}



const registrar_datos_factura = async ( req = request, res = response )=>{

    try {


    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : true,
            msg : `No se pudo obtener los datos para el grafico : ${error}`,
            //data
        } );
    }




}




module.exports = {
    generar_documentos_factura,
    obtener_ultimo_nro_factura,
    registrar_datos_factura

}