const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const ExcelJS = require('exceljs');


const prisma = new PrismaClient();




const agrega_regreso = async ( req = request, res = response )=>{
    try {
        
        const { id_tipo_egreso, descripcion_egreso, monto_egreso } = req.body;
        const fecha_carga = new Date();


        const nuevo_egreso = await prisma.ingresos.create( { data : {  
                                                                        cargado_en : fecha_carga,
                                                                        monto : monto_egreso,
                                                                        id_socio : 1,
                                                                        id_tipo : id_tipo_egreso
                                                                    } 
                                                        } )

        const { cargado_en, id_socio, monto, id_tipo, descripcion } = nuevo_egreso;

        const nuevoEgreso = {
            cargadoEn : cargado_en,
            idSocio : id_socio,
            monto,
            idTipo : id_tipo,
            descripcion
        }

        res.status( 200 ).json( {
            status : true,
            msg : "Igreso Cargado",
            nuevoEgreso
        } );

    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo cargar el egreso, error : " + error,
            //nuevoIngreso
        } );
    }
}



const borrar_egreso = async ( req = request, res = response )=>{

    //A VER BORRAR EN SI NO SE VA HACER, SOLO CAMBIAR EL ESTADO DE UNA COLUMNA QUE SE LLAMA BORRADO
    try {

        const { idOperacionEgreso } = req.body;

        const fecha_borrado = new Date();
        const borrado_egreso = await prisma.egresos.update( { 
                                                                data : { borrado : true, editado_en : fecha_borrado },
                                                                where : { is_operacion_egreso : idOperacionEgreso }
                                                             } );

        const { is_operacion_egreso, monto, nro_factura, comprobante, descripcion, id_socio, id_tipo   } = borrado_egreso;
        
        res.status( 200 ).json( {
            status : true,
            msg : "Registro Borrado",
            BorradoEgreso : {
                idOperacionEgreso : is_operacion_egreso,
                monto,
                nroFactura : nro_factura,
                comprobante,
                descripcion,
                idSocio : id_socio,
                idTipo : id_tipo
            }
        } );


    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo cargar el egreso, error : " + error,
            //nuevoIngreso
        } );
    }


    
}


const actualizar_egreso = ( req = request, res = response )=>{


    try {
        const {  } = req.body;
    } catch (error) {
        
    }


    
}



const obtener_egresos_x_fecha = async ( req = request, res = response )=>{


    try {
        
        const {  } = req.body;

        const egresos_x_fecha = await prisma.egresos.findMany( { 
                                                                    where : { 
                                                                        cargado_en : { gte : new Date(), lte : new Date() }
                                                                    },
                                                                    orderBy : { cargado_en : 'desc' },
                                                                } );

        let egresosXFecha = [];
        egresos_x_fecha.forEach( ( value )=>{
            const { is_operacion_egreso, cargado_en, comprobante, descripcion, id_tipo, monto, nro_factura } = value;
            egresosXFecha.push( {
                idOperacionEgreso : is_operacion_egreso,
                cargadoEn : cargado_en,
                comprobante,
                descripcion,
                idTipo : id_tipo,
                monto,
                nro_factura
            } );

            
        } );


                
        res.status( 200 ).json( {
            status : true,
            msg : "Registros de las fechas",
            egresosXFecha
        } );

    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los egresos por fecha, error : " + error,
            //nuevoIngreso
        } );
        
    }





    
}


const obtener_egresos_x_fecha_excel = async ( req = request, res = response )=>{
    try {
        
        const {  } = req.body;

        const egresos_x_fecha = await prisma.egresos.findMany( { 
                                                                    where : { 
                                                                        cargado_en : { gte : new Date(), lte : new Date() }
                                                                    },
                                                                    orderBy : { cargado_en : 'desc' },
                                                                } );

        let egresosXFecha = [];
        egresos_x_fecha.forEach( ( value )=>{
            const { is_operacion_egreso, cargado_en, comprobante, descripcion, id_tipo, monto, nro_factura } = value;
            egresosXFecha.push( {
                idOperacionEgreso : is_operacion_egreso,
                cargadoEn : cargado_en,
                comprobante,
                descripcion,
                idTipo : id_tipo,
                monto,
                nro_factura
            } );

            
        } );


                
        res.status( 200 ).json( {
            status : true,
            msg : "Registros de las fechas",
            egresosXFecha
        } );

    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los egresos por fecha, error : " + error,
            //nuevoIngreso
        } );
        
    }
}


const obtener_tipos_egreso = async ( req = request, res = response )=>{

    try {
        
        const tipos_egreso = await prisma.tipos_ingreso.findMany( );

        let tiposEgreso = []

        tipos_egreso.forEach( ( value )=>{
            const { descripcion, id_tipo } = value;
            tiposEgreso.push( { descripcion, idTipo : id_tipo } )
        } );
        res.status( 200 ).json( {
            status : true,
            msg : "Tipos de ingreso",
            tiposEgreso
        } );


    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los tipos de egresos, error : " + error,
            //nuevoIngreso
        } );
    }
}



module.exports = {

    agrega_regreso,
    borrar_egreso,
    actualizar_egreso,
    obtener_egresos_x_fecha,
    obtener_egresos_x_fecha_excel,
    obtener_tipos_egreso

}
