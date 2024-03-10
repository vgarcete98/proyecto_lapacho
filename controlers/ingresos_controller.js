const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const ExcelJS = require('exceljs');




const agregar_ingreso = async ( req = request, res = response )=>{


    try {
        
        const { id_tipo_ingreso, descripcion_ingreso, monto_ingreso } = req.body;
        const fecha_carga = new Date();


        const nuevo_ingreso = await prisma.ingresos.create( { data : {  
                                                                        cargado_en : fecha_carga,
                                                                        monto : monto_ingreso,
                                                                        id_socio : 1,
                                                                        id_tipo : id_tipo_ingreso
                                                                    } 
                                                        } )

        const { cargado_en, id_socio, monto, id_tipo, descripcion } = nuevo_egreso;

        const nuevoIngreso = {
            cargadoEn : cargado_en,
            idSocio : id_socio,
            monto,
            idTipo : id_tipo,
            descripcion
        }

        res.status( 200 ).json( {
            status : true,
            msg : "Igreso Cargado",
            nuevoIngreso
        } );

    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo cargar el ingreso, error : " + error,
            //nuevoIngreso
        } );
    }

}



const borrar_ingreso = async ( req = request, res = response )=>{

//A VER BORRAR EN SI NO SE VA HACER, SOLO CAMBIAR EL ESTADO DE UNA COLUMNA QUE SE LLAMA BORRADO
try {

    const { idOperacionEgreso } = req.body;

    const fecha_borrado = new Date();
    const borrado_egreso = await prisma.ingresos.update( { 
                                                            data : { borrado : true, editado_en : fecha_borrado },
                                                            where : { column_d_operacion_ingreso : idOperacionEgreso }
                                                         } );

    const { id_operacion_ingreso, monto, nro_factura, descripcion, id_socio, id_tipo   } = borrado_egreso;
    
    res.status( 200 ).json( {
        status : true,
        msg : "Registro Borrado",
        BorradoIngreso : {
            idOperacionIngreso : id_operacion_ingreso,
            monto,
            nroFactura : nro_factura,
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


const actualizar_ingreso = async ( req = request, res = response )=>{


    
    
}



const obtener_ingresos_x_fecha = async ( req = request, res = response )=>{
    
}


const obtener_ingresos_x_fecha_excel = async ( req = request, res = response )=>{
    
}



const obtener_tipos_ingreso = async ( req = request, res = response )=>{

    try {
        
        const tipos_ingresos = await prisma.tipos_ingreso.findMany( );

        let tiposIngreso = []

        tipos_ingresos.forEach( ( value )=>{
            const { descripcion, id_tipo } = value;
            tiposIngreso.push( { descripcion, idTipo : id_tipo } )
        } );
        res.status( 200 ).json( {
            status : true,
            msg : "Tipos de ingreso",
            tiposIngreso
        } );


    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los tipos de ingresos, error : " + error,
            //nuevoIngreso
        } );
    }
}







module.exports = {

    agregar_ingreso,
    borrar_ingreso,
    actualizar_ingreso,
    obtener_ingresos_x_fecha,
    obtener_ingresos_x_fecha_excel,
    obtener_tipos_ingreso

}