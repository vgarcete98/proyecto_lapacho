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
                                B.porc_descuento AS "porDescuento"
                                --B.creado_en AS "creadoEn"
                            FROM TIPO_SOCIO A JOIN PRECIO_CUOTA B ON A.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                        WHERE B.valido = TRUE`;

        const preciosCuotas = await prisma.$queryRawUnsafe( query );

        res.status( 200 ).json(
            {

                status : true,
                msj : 'Datos de Cuotas de Tipo de Socio',
                preciosCuotas
            }
        );  
        
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

        const { idTipoSocio, descTipoSocio, idPrecioCuota, montoCuota, descTipoDescuento, porDescuento } = req.body;


        const precio_cuota_editado = await prisma.precio_cuota.update( {  
                                                                        data : { 
                                                                            valido : false
                                                                        },
                                                                        where : { 
                                                                            id_precio_cuota : Number( idPrecioCuota )
                                                                        }
                                                                    } )

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

        const actualizacion_cuotas = await prisma.cuotas_socio.updateMany( {
                                                                            data : { 
                                                                                monto_cuota : Number( montoCuota ),

                                                                            },
                                                                            where : {
                                                                                AND :[
                                                                                    { id_cliente : { in : [clientes_a_actualizar] } },
                                                                                    { abonado : false }
                                                                                ]
                                                                            }
                                                                        } )

        res.status( 200 ).json(
            {
                status : true,
                msj : 'Precios de cuotas Actualizado',
                descripcion : `Precio de cuota actualizado para socio : ${ descTipoSocio }`
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

const agregar_precio_de_cuota = async ( req = request, res = response ) => {

    try {

        const { idTipoSocio, descTipoSocio, idPrecioCuota, montoCuota, descTipoDescuento, porDescuento } = req.body;





        res.status( 200 ).json(
            {
                status : true,
                msj : 'Accesos para usuarios',
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



module.exports = {
    obtener_precios_de_cuotas,
    editar_precio_de_cuotas,
    agregar_precio_de_cuota
}


