const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();



const comprobar_salto_factura = async ( req = request, res = response, next )=> {

    try {
        const { nroTimbrado, nroFactura } = req.body;
        
        //VOY A BUSCAR SI HAY UNA FACTURA VACIA QUE CORRESPONDE A ESA
        //const factura = "";
        const numeracion = nroFactura.split( '-' ).pop();
        const factura_previas = await prisma.facturas.findMany( { 
                                                                        where : { 
                                                                            AND :[

                                                                                //{ nro_timbrado : Number( nroTimbrado ) },
                                                                                //{ nro_factura : nroFactura },
                                                                                { fecha_emision : null },
                                                                                { ruc_cliente : null },
                                                                                { nro_timbrado : Number( nroTimbrado ) },
                                                                                { numero : { lte : Number(numeracion) }  },
                                                                                { total_iva : null },
                                                                                { condicion_venta : null },
                                                                                
                                                                            ] 
                                                                        },
                                                                        select : {
                                                                            nro_timbrado : true,
                                                                            nro_factura : true
                                                                        } 
                                                                    } );
        
        if ( factura_previas !== null && factura_previas.length > 1 ){

            return res.status( 400 ).json( {
                status : false,
                msg : 'Se salteo la numeracion normal de facturacion',
                descripcion : `Facturas pendientes de verificar y controlar : ${ factura_previas }`
            } );     

        }else {
            next();
        }

    } catch (error) {
        
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al comprobar los saltos de factura",
            //existe
        } );
    }

}




const comprobar_factura_registrada = async ( req = request, res = response, next )=> {

    try {
        const { nroTimbrado, nroFactura } = req.body;
        
        //VOY A BUSCAR SI HAY UNA FACTURA VACIA QUE CORRESPONDE A ESA
        //const factura = "";
        const numeracion = nroFactura.split( '-' ).pop();
        const factura_previas = await prisma.facturas.findFirst( { 
                                                                        where : { 
                                                                            AND :[

                                                                                //{ nro_timbrado : Number( nroTimbrado ) },
                                                                                //{ nro_factura : nroFactura },
                                                                                { fecha_emision : null },
                                                                                { ruc_cliente : null },
                                                                                { nro_timbrado : Number( nroTimbrado ) },
                                                                                { numero : { lte : Number(numeracion) }  },
                                                                                { total_iva : null },
                                                                                { condicion_venta : null },
                                                                                
                                                                            ] 
                                                                        },
                                                                        select : {
                                                                            nro_timbrado : true,
                                                                            nro_factura : true
                                                                        } 
                                                                    } );
        console.log( factura_previas )
        if ( factura_previas === null ){

            return res.status( 400 ).json( {
                status : false,
                msg : 'No existe la numeracion para esa factura',
                descripcion : `Facturas pendientes de verificar y controlar : ${ nroFactura } y timbrado : ${ nroTimbrado }`
            } );     

        }else {
            next();
        }

    } catch (error) {
        
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al comprobar si la factura existe",
            //existe
        } );
    }

}



const comprobar_utilizacion_factura_registrada = async ( req = request, res = response, next )=> {

    try {
        const { nroTimbrado, nroFactura } = req.body;
        
        //VOY A BUSCAR SI HAY UNA FACTURA VACIA QUE CORRESPONDE A ESA
        //const factura = "";
        const numeracion = nroFactura.split( '-' ).pop();
        console.log(numeracion  )
        const factura_previas = await prisma.facturas.findFirst( { 
                                                                        where : { 
                                                                            AND :[

                                                                                //{ nro_timbrado : Number( nroTimbrado ) },
                                                                                //{ nro_factura : nroFactura },
                                                                                { fecha_emision : { not : null } },
                                                                                { ruc_cliente : { not : null } },
                                                                                { nro_timbrado : Number( nroTimbrado ) },
                                                                                { numero : { equals : Number(numeracion) }  },
                                                                                { total_iva : { gt : 0 } },
                                                                                { condicion_venta : { not : null } },
                                                                                
                                                                            ] 
                                                                        },
                                                                        select : {
                                                                            nro_timbrado : true,
                                                                            nro_factura : true
                                                                        } 
                                                                    } );
        console.log( factura_previas )
        if ( factura_previas === null ){

            next();
            
        }else {
            return res.status( 400 ).json( {
                status : false,
                msg : 'Esa factura ya fue utilizada para venta',
                descripcion : `Facturas pendientes de verificar y controlar : ${ nroFactura } y timbrado : ${ nroTimbrado }`
            } );     
        }

    } catch (error) {
        
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al comprobar si la factura existe",
            //existe
        } );
    }

}




module.exports = {
    comprobar_salto_factura,
    comprobar_factura_registrada,
    comprobar_utilizacion_factura_registrada
}





