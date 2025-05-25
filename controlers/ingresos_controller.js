const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const path = require( 'path' );
const ExcelJS = require('exceljs');

var { format  } = require("date-fns");

const { generar_fecha } = require( '../helpers/generar_fecha' )

const columnas_ingresos = [

    { key : 'id_operacion_ingreso', header : 'Numero registro',  width: 20  },
    { key : 'descripcion', header : 'descripcion',  width: 100 },           
    { key : 'comentario', header : 'Comentario',  width: 20 }, 
    { key : 'nro_factura', header : 'Factura',  width: 20 },           
    { key : 'monto', header : 'Monto',  width: 20 }, 
    { key : 'fecha_ingreso', header : 'Fecha de Operacion',  width: 20 },          
    { key : 'cargado_en', header : 'Fecha de Carga',  width: 20 }

];



const agregar_ingreso = async ( req = request, res = response )=>{


    try {
        
        const { idTipoIngreso, descripcionIngreso, montoIngreso, idSocio, fechaIngreso } = req.body;
        const nuevo_ingreso = await prisma.ingresos.create( { data : {  
                                                                        cargado_en : new Date(),
                                                                        //editado_en : fecha_carga,
                                                                        monto : montoIngreso,
                                                                        id_socio : idSocio,
                                                                        id_tipo : idTipoIngreso,
                                                                        fecha_ingreso : generar_fecha( fechaIngreso ),
                                                                        descripcion : descripcionIngreso,
                                                                        borrado : false,
                                                                    } 
                                                        } );

        const { cargado_en, id_socio, monto, id_tipo, descripcion, column_d_operacion_ingreso, editado_en, fecha_ingreso } = nuevo_ingreso;
        //console.log( nuevo_ingreso );

        const ingreso = await prisma.tipos_ingreso.findUnique( { where : { id_tipo : Number( id_tipo ) } } );
        //const { descripcion } = egreso;

        const usuario = await prisma.socio.findUnique( { where : { id_socio : Number( id_socio ) } } );
        
        const nuevoIngreso = {
            idIngreso : column_d_operacion_ingreso,
            idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
            nombreUsuario : usuario.nombre_usuario,
            nombreCmp : usuario.nombre_cmp,
            tipoIngreso : ingreso.descripcion,
            comentario : descripcion,
            monto,
            fechaIngreso : fecha_ingreso,
            fechaCarga : cargado_en,
            fechaActualizacion : editado_en,
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

    const { idIngreso } = req.body;

    const fecha_borrado = new Date();
    const borrado_ingreso = await prisma.ingresos.delete( { 
                                                            where : { column_d_operacion_ingreso : Number(idIngreso) }
                                                        } );

    const { column_d_operacion_ingreso, monto, nro_factura, 
            descripcion, id_socio, id_tipo, 
            cargado_en, editado_en, fecha_ingreso   } = borrado_ingreso;

    const ingreso = await prisma.tipos_ingreso.findUnique( { where : { id_tipo : Number( id_tipo ) } } );
    //const { descripcion } = egreso;

    const usuario = await prisma.socio.findUnique( { where : { id_socio : Number( id_socio ) } } );
    
    const BorradoIngreso = {
        idIngreso : column_d_operacion_ingreso,
        idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
        nombreUsuario : usuario.nombre_usuario,
        nombreCmp : usuario.nombre_cmp,
        tipoIngreso : ingreso.descripcion,
        comentario : descripcion,
        fechaIngreso : fecha_ingreso,
        monto,
        fechaCarga : cargado_en,
        fechaActualizacion : editado_en,
    }
    
    res.status( 200 ).json( {
        status : true,
        msg : "Registro Borrado",
        BorradoIngreso
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




const actualizar_ingreso = async ( req = request, res = response )=>{


    try {

        const { idTipoIngreso, descripcionIngreso, montoIngreso, idSocio, idIngreso, fechaIngreso } = req.body;

        const edicion_ingreso = await prisma.ingresos.update( { 
                                                                data : { 
                                                                    monto : montoIngreso,
                                                                    descripcion : descripcionIngreso,
                                                                    fecha_ingreso : generar_fecha( fechaIngreso ),
                                                                    editado_en : new Date(),
                                                                    id_tipo : idTipoIngreso
                                                                },
                                                                where : { column_d_operacion_ingreso : Number(idIngreso) }
                                                             } )
        
        const { column_d_operacion_ingreso, 
                id_socio, 
                descripcion, 
                id_tipo, 
                monto,
                editado_en,
                cargado_en,
                fecha_ingreso } = edicion_ingreso;

        const ingreso = await prisma.tipos_ingreso.findUnique( { where : { id_tipo : Number( id_tipo ) } } );
        const usuario = await prisma.socio.findUnique( { where : { id_socio : Number( id_socio ) } } );
    
        const ingresoEditado = {
            idIngreso : column_d_operacion_ingreso,
            idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
            nombreUsuario : usuario.nombre_usuario,
            nombreCmp : usuario.nombre_cmp,
            tipoIngreso : ingreso.descripcion,
            comentario : descripcion,
            monto,
            fechaIngreso : fecha_ingreso,
            fechaCarga : cargado_en,
            fechaActualizacion : editado_en,
        };
        

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

        const { fechaDesde, fechaHasta, pagina, cantidad } = req.query;     

        const query_ingresos = `SELECT A.column_d_operacion_ingreso AS "idIngreso",
                                                    A.id_tipo_ingreso AS "idTipoIingreso",
                                                    C.descripcion AS "descripcion",
                                                    A.descripcion AS "comentario",
                                                    A.monto AS "monto",
                                                    A.fecha_ingreso AS "fechaIngreso",
                                                    A.cargado_en AS "fechaCarga",
                                                    A.nro_factura AS "nroFactura"
                                                FROM INGRESOS A JOIN TIPOS_INGRESO C ON A.id_tipo_ingreso = C.id_tipo_ingreso
                                            WHERE A.fecha_ingreso BETWEEN DATE '${fechaDesde}' AND DATE '${fechaHasta}'
                                                AND A.borrado = false
                                            ORDER BY A.fecha_ingreso DESC
                                            LIMIT ${ cantidad } OFFSET ${(Number(pagina) > 1 ) ? Number(pagina)* 10 : 0};`
        //console.log( query_ingresos );
        const ingresosXFecha = await prisma.$queryRawUnsafe( query_ingresos );

        if ( ingresosXFecha.length > 0 ){
            
            res.status( 200 ).json( {
                status : true,
                msg : `Ingresos de las fechas ${fechaDesde } y ${ fechaHasta }`,
                ingresosXFecha                        
            } );
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo ningun ingreso entre esas fechas',
                descripcion : `No hay ningun ingreso para esas fechas`
            } ); 
        }

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
        
        const { fechaDesde, fechaHasta } = req.query;    

        const query = `SELECT A.column_d_operacion_ingreso AS id_operacion_ingreso,
                                                                C.descripcion AS tipo_ingreso,
                                                                A.descripcion AS comentario,
                                                                A.monto,
																A.nro_factura AS nro_factura,
                                                                A.fecha_ingreso AS fecha_ingreso,
                                                                A.cargado_en AS fecha_carga,
                                                                A.editado_en as fecha_actualizacion
                                                            FROM INGRESOS A JOIN  TIPOS_INGRESO C ON A.id_tipo_ingreso = C.id_tipo_ingreso
                                                        WHERE A.fecha_ingreso BETWEEN DATE '${fechaDesde}' AND DATE '${fechaHasta}'
                                                            AND A.borrado = false
                                                        ORDER BY A.fecha_ingreso DESC;`;
        //console.log( query )
        const ingresos_x_fecha = await prisma.$queryRawUnsafe( query );

        if ( ingresos_x_fecha.length > 0 ) {
            
            //console.log( ingresos_x_fecha );
            //PARA  LO QUE SERIA EGRESOS
            //----------------------------------------------------------------
            const workbook_ingresos = new ExcelJS.Workbook();
    
            const worksheet_ingresos = workbook_ingresos.addWorksheet('ingresos_lapacho');
    
            // Defino las columnas
            worksheet_ingresos.columns = columnas_ingresos;
    
            ingresos_x_fecha.forEach( ( value )=>{
                const { id_operacion_ingreso, tipo_ingreso, nro_factura,
                        comentario, monto, fecha_carga,
                        fecha_actualizacion, nombre_usuario } = value;
    
                worksheet_ingresos.addRow( { 
                                                id_operacion_ingreso, tipo_ingreso, nro_factura,
                                                comentario, monto, fecha_carga,
                                                fecha_actualizacion, nombre_usuario 
                                        } );
            } );
            const fecha_reporte = new Date();
            let ruta = path.join( __dirname, `../reportes/${fecha_reporte.toLocaleString().split('/').join('_').split(':').join('_').split(', ').join( '_' )}.xlsx` );
            await workbook_ingresos.xlsx.writeFile(ruta);
            res.sendFile(ruta);
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo ningun movimiento entre esas fechas',
                descripcion : `No hay ningun movimientos para esas fechas`
            } ); 
        }     

    } catch (error) {
        console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los egresos por fecha, error : " + error,
            //nuevoIngreso
        } );
        
    }
}

const obtener_ingresos_monto_x_fecha = async ( req = request, res = response ) => {

    try {

        const { fechaDesde, fechaHasta } = req.query;

        const [ dia_desde, mes_desde, annio_desde ] = fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] = fechaHasta.split( '/' );

        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;

        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;

        const query = `SELECT A.id_tipo AS "idTipo", A.descripcion, SUM(B.monto) AS "monto"
                            FROM INGRESOS B JOIN tipos_ingreso A ON A.id_tipo = B.id_tipo 
                        WHERE B.fecha_ingreso BETWEEN DATE '${fecha_desde_format}' AND DATE '${fecha_hasta_format}'

                        GROUP BY A.id_tipo, A.descripcion`;
        
        let montos = [];
        montos = await prisma.$queryRawUnsafe( query );
        res.status( 200 ).json( {
            status : true,
            msg : " Montos acumulados de las fechas por ege ",
            //nuevoIngreso
        } );
        
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener el monto del ingreso en esas fechas : " + error,
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
        //console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los tipos de ingresos, error : " + error,
            //nuevoIngreso
        } );
    }
}


const generar_grafico_x_fecha_ingresos = async ( req = request, res = response) =>{



    try {
        const { fecha_desde, fecha_hasta } = req.query;
        const query = `SELECT CAST( SUM( A.monto) AS INTEGER ) AS monto,
                                A.fecha_ingreso AS fecha_ingreso
                                --A.cargado_en AS fecha_carga,
                                --A.editado_en as fecha_actualizacion
                            FROM INGRESOS A JOIN SOCIO B ON A.id_socio = B.id_socio
                            JOIN PERSONA F ON B.id_persona = F.id_persona
                            JOIN TIPOS_INGRESO C ON A.id_tipo = C.id_tipo
                        WHERE A.cargado_en BETWEEN DATE '${fecha_desde}' AND DATE '${fecha_hasta}' 
                            AND A.borrado = false
                        GROUP BY A.fecha_ingreso
                        ORDER BY A.fecha_ingreso DESC;`;
        //console.log( query );
        let ingresos_x_fecha = [];               
        ingresos_x_fecha = await prisma.$queryRawUnsafe( query );
    
    
        let data = [];
        if ( ingresos_x_fecha.length > 0 ){
    
            //const { monto, fecha_pago } = egresos_x_fecha;
            ingresos_x_fecha.forEach( ( element ) => {
    
                const { monto, fecha_ingreso } = element;
    
                data.push( { x: fecha_ingreso, y : monto } );
    
            } );
    
    
        }
        res.status( 200 ).json( {
            status : true,
            msg : "Datos para grafico de Ingresos",
            data
        } );
        
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : true,
            msg : "No se pudo obtener los datos para el grafico :" + error,
            //data
        } );
    }


}

const obtener_grafico_torta_ingresos = async ( req = request, res = response )=>{

    try {
        const { fecha_desde, fecha_hasta } = req.query;
        const query = `SELECT ID_TIPO AS "idTipo",
                                descripcion AS "descripcion",
                            	CAST( SUM(MONTO) AS INTEGER) AS "monto",
                            	ROUND(SUM(MONTO) * 100.0 / total_monto, 2) AS "porcentaje"
                            FROM INGRESOS, (SELECT COALESCE(SUM(MONTO), 0) AS total_monto 
                                                FROM INGRESOS 
                                            WHERE FECHA_INGRESO BETWEEN  DATE '${format( generar_fecha( fecha_desde ), 'yyyy-MM-dd' )}' AND DATE '${format( generar_fecha( fecha_hasta ), 'yyyy-MM-dd' )}') AS total
                        WHERE 
                            FECHA_INGRESO BETWEEN  DATE '${format( generar_fecha( fecha_desde ), 'yyyy-MM-dd' )}' AND DATE '${format( generar_fecha( fecha_hasta ), 'yyyy-MM-dd' )}' 
                        GROUP BY 
                            ID_TIPO, total_monto, descripcion;`
        let porcentajeIngresos = [];       
              
        porcentajeIngresos = await prisma.$queryRawUnsafe( query );
        
        res.status( 200 ).json( {
            status : true,
            msg : "Datos para grafico de Egresos",
            data : porcentajeIngresos
        } );



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

    agregar_ingreso,
    borrar_ingreso,
    actualizar_ingreso,
    obtener_ingresos_x_fecha,
    obtener_ingresos_x_fecha_excel,
    obtener_tipos_ingreso,
    generar_grafico_x_fecha_ingresos,
    obtener_ingresos_monto_x_fecha,
    obtener_grafico_torta_ingresos

}