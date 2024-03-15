const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const ExcelJS = require('exceljs');


const workbook_ingresos = new ExcelJS.Workbook();

workbook_ingresos.addWorksheet('Reportes_Ingresos');


const reporte_excel_ingresos = workbook_ingresos.getWorksheet( 'Reportes_Ingresos' );



// AÑADO LAS COLUMNAS QUE VA TENER MI ARCHIVO EXCEL

//------------------------------------------------------------------------------
//column_d_operacion_ingreso, cargado_en, editado_en, descripcion, id_socio, id_tipo, monto
reporte_excel_ingresos.columns = [
                                    { header: 'column_d_operacion_ingreso', key: 'Numero de Operacion', width: 10 },
                                    { header: 'cargado_en', key: 'Fecha de Carga', width: 10 },
                                    { header: 'editado_en', key: 'Fecha de Edicion', width: 10 },
                                    { header: 'descripcion', key: 'Descripcion', width: 10 },
                                    { header: 'id_socio', key: 'Numero de Socio', width: 10 },
                                    { header: 'id_tipo', key: 'Numero de Tipo de carga', width: 10 },
                                    { header: 'monto', key: 'Monto de Ingreso', width: 10 },
                                ];
//------------------------------------------------------------------------------



const agregar_ingreso = async ( req = request, res = response )=>{


    try {
        
        const { idTipoIngreso, descripcionIngreso, montoIngreso, idSocio } = req.body;
        const fecha_carga = new Date();

        /*  
        "idTipoIngreso" : 1, 
        "descripcionIngreso" : 'GANACIA TORNEO 13/03/2024', 
        "montoIngreso" : 1.000.000,
        "idSocio" : 1
        
        */



        const nuevo_ingreso = await prisma.ingresos.create( { data : {  
                                                                        cargado_en : fecha_carga,
                                                                        editado_en : fecha_carga,
                                                                        monto : montoIngreso,
                                                                        id_socio : idSocio,
                                                                        id_tipo : idTipoIngreso,
                                                                        descripcion : descripcionIngreso,
                                                                        borrado : false,
                                                                    } 
                                                        } );

        const { cargado_en, id_socio, monto, id_tipo, descripcion } = nuevo_ingreso;
        //console.log( nuevo_ingreso );
        
        const nuevoIngreso = {
            cargadoEn : cargado_en,
            idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
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

    const { id_ingreso } = req.params;

    const fecha_borrado = new Date();
    const borrado_ingreso = await prisma.ingresos.update( { 
                                                            data : { borrado : true, editado_en : fecha_borrado },
                                                            where : { column_d_operacion_ingreso : Number(id_ingreso) }
                                                        } );

    const { column_d_operacion_ingreso, monto, nro_factura, descripcion, id_socio, id_tipo   } = borrado_ingreso;
    
    res.status( 200 ).json( {
        status : true,
        msg : "Registro Borrado",
        BorradoIngreso : {
            idOperacionIngreso : column_d_operacion_ingreso,
            monto,
            nroFactura : nro_factura,
            descripcion,
            idSocio :  (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
            idTipo : id_tipo
        }
    } );


} catch (error) {
    console.log( error );
    const { code, meta} = error;
    const { cause } = meta;
    if ( code ===  'P2025' ){
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo actualizar el ingreso, El mismo no se encontro, error : " + cause,
            //nuevoIngreso
        } );
    }else{
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo actrualizar el ingreso, error : " + error,
            //nuevoIngreso
        } );        
    }

}


    
}



const obtener_ingresos = async ( req = request, res = response )=>{

    try {
        console.log( req.query );
        
        const { fechaDesde, fechaHasta, pagina } = req.query;

        const [ dia_desde, mes_desde, annio_desde ] =  fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] =  fechaHasta.split( '/' );


        const fecha_desde = new Date( Number(annio_desde), Number(mes_desde) -1 , Number(dia_desde)  );

        const fecha_hasta = new Date( Number(annio_hasta), Number(mes_hasta) -1 , Number(dia_hasta) );

        const query = await prisma.$queryRaw`SELECT A.column_d_operacion_ingreso AS id_operacion_ingreso,
                                            		A.id_socio, 
                                                    B.nombre_usuario, 
                                                    B.nombre_cmp,
                                            		A.id_tipo AS id_tipo_ingreso, 
                                                    C.descripcion AS tipo_ingreso,
                                            		A.descripcion AS comentario, 
                                                    A.monto, 
                                                    A.cargado_en AS fecha_carga,
                                            		A.editado_en as fecha_actualizacion		
                                            FROM INGRESOS A JOIN SOCIO B ON A.id_socio = B.id_socio
                                            JOIN TIPOS_INGRESO C ON A.id_tipo = C.id_tipo
                                            WHERE A.cargado BETWEEN ${fecha_desde} AND ${fechaHasta}
                                            LIMIT 20 OFFSET ${pagina}
                                            ORDER BY A.cargado DESC`

        const ingresosXFecha = []

        if ( query.length > 0 ){

            query.forEach( ( value )=>{

                const { id_operacion_ingreso ,
                        id_socio, 
                        nombre_usuario, 
                        nombre_cmp,
                        id_tipo ,
                        tipo_ingreso,
                        comentario, 
                        monto, 
                        fecha_carga,
                        fecha_actualizacion  } = value;

                ingresosXFecha.push( {
                        idOperacionIngreso : id_operacion_ingreso ,
                        idSocio : id_socio, 
                        nombreUsuario : nombre_usuario, 
                        nombreCmp : nombre_cmp,
                        idTipo : id_tipo , 
                        nroFactura : nro_factura,
                        tiposIngreso : tipo_ingreso,
                        comentario, 
                        monto, 
                        fechaCarga : fecha_carga,
                        fechaActualizacion : fecha_actualizacion 
                } )
            });



        }


        res.status( 200 ).json( {
            status : true,
            msj : `Ingresos de las fechas ${fechaDesde } y ${ fechaHasta }`,
            ingresosXFecha                        
        } );


    } catch (error) {
        console.log( error );

        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los ingresos, error : " + error,
            //nuevoIngreso
        } );




    }




}














const actualizar_ingreso = async ( req = request, res = response )=>{


    try {
        const { idOperacionIngreso, montoNuevo, descripcionNueva, nroFacturaNuevo } = req.body;
        
        const fecha_edicion = new Date();

        const edicion_ingreso = await prisma.ingresos.update( { 
                                                                data : { 
                                                                    monto : montoNuevo,
                                                                    descripcion : descripcionNueva,
                                                                    comprobante : comprobanteNuevo,
                                                                    editado_en : fecha_edicion
                                                                },
                                                                where : { is_operacion_egreso : idOperacionIngreso }
                                                             } )
        
        const { column_d_operacion_ingreso, 
                id_socio, 
                descripcion, 
                id_tipo, 
                monto,
                editado_en } = edicion_ingreso;
        
        const ingresoEditado = {
            idOperacionIngreso : column_d_operacion_ingreso,
            monto,
            nroFactura : nro_factura,
            descripcion,
            idTipo : id_tipo,
            idSocio : id_socio,
            editadoEn : editado_en

        }

        res.status( 200 ).json( {
            status : true,
            msg : "Registro Editado con exito",
            ingresoEditado
        } );


    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo editar el egreso, error : " + error,
            //nuevoIngreso
        } );
    }

    
}



const obtener_ingresos_x_fecha = async ( req = request, res = response )=>{
    try {

        //console.log( req.query );

        const { fechaDesde, fechaHasta, pagina } = req.query;
        const query_ingresos = `SELECT A.column_d_operacion_ingreso AS id_operacion_ingreso,
                                                    A.id_socio,
                                                    B.nombre_usuario,
                                                    B.nombre_cmp,
                                                    A.id_tipo AS id_tipo_ingreso,
                                                    C.descripcion AS tipo_ingreso,
                                                    A.descripcion AS comentario,
                                                    A.monto,
                                                    A.cargado_en AS fecha_carga,
                                                    A.editado_en as fecha_actualizacion
                                                FROM INGRESOS A JOIN SOCIO B ON A.id_socio = B.id_socio
                                                JOIN TIPOS_INGRESO C ON A.id_tipo = C.id_tipo
                                            WHERE A.cargado_en BETWEEN CAST('${fechaDesde}' AS DATE ) AND CAST('${fechaHasta}' AS DATE ) 
                                            ORDER BY A.cargado_en DESC
                                            LIMIT 20 OFFSET ${Number(pagina)};`

        const query = await prisma.$queryRawUnsafe( query_ingresos );

                                            
        //console.log( query );
        const ingresosXFecha = [];

        if ( query.length > 0 ){

            query.forEach( ( value )=>{

                const { id_operacion_ingreso ,
                        id_socio, 
                        nombre_usuario, 
                        nombre_cmp,
                        id_tipo ,
                        tipo_ingreso,
                        comentario, 
                        monto, 
                        fecha_carga,
                        fecha_actualizacion  } = value;

                ingresosXFecha.push( {
                        idOperacionIngreso : id_operacion_ingreso ,
                        idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio), 
                        nombreUsuario : nombre_usuario, 
                        nombreCmp : nombre_cmp,
                        idTipo : id_tipo , 
                        //nroFactura : nro_factura,
                        tiposIngreso : tipo_ingreso,
                        comentario, 
                        monto, 
                        fechaCarga : fecha_carga,
                        fechaActualizacion : fecha_actualizacion 
                } )
            });

        }


        res.status( 200 ).json( {
            status : true,
            msj : `Ingresos de las fechas ${fechaDesde } y ${ fechaHasta }`,
            ingresosXFecha                        
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


const obtener_ingresos_x_fecha_excel = async ( req = request, res = response )=>{
    
    try {
        
        const { fechaDesde, fechaHasta } = req.body;

        const [ dia_desde, mes_desde, annio_desde ] =  fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] =  fechaHasta.split( '/' );


        const fecha_desde = new Date( Number(annio_desde), Number(mes_desde) -1 , Number(dia_desde)  );

        const fecha_hasta = new Date( Number(annio_hasta), Number(mes_hasta) -1 , Number(dia_hasta) );

        const ingresos_x_fecha = await prisma.ingresos.findMany( { 
                                                                    where : { 
                                                                        cargado_en : { 
                                                                                        gte : fecha_desde, 
                                                                                        lte : fecha_hasta
                                                                                    }
                                                                    },
                                                                    orderBy : { cargado_en : 'desc' },
                                                                } );

        let ingresosXFecha = [];
        ingresos_x_fecha.forEach( ( value )=>{
            const { column_d_operacion_ingreso, cargado_en, editado_en, descripcion, id_socio, id_tipo, monto } = value;
            //ingresosXFecha.push( {
            //    idOperacionIngreso : column_d_operacion_ingreso,
            //    idSocio : id_socio,
            //    cargadoEn : cargado_en,
            //    editadoEn : editado_en,
            //    comprobante,
            //    descripcion,
            //    idTipo : id_tipo,
            //    monto,
            //    nro_factura
            //} );

            reporte_excel_ingresos.addRow( { column_d_operacion_ingreso, cargado_en, editado_en, descripcion, id_socio, id_tipo, monto } );
        } );


                
        res.sendFile( '../', ( error )=>{ console.log( error ); } );

    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los egresos por fecha, error : " + error,
            //nuevoIngreso
        } );
        
    }
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
    obtener_tipos_ingreso,
    obtener_ingresos

}