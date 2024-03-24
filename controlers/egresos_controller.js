const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const ExcelJS = require('exceljs');


const prisma = new PrismaClient();



//PARA  LO QUE SERIA EGRESOS
//----------------------------------------------------------------
const workbook_egresos = new ExcelJS.Workbook();

const worksheet_egresos = workbook_egresos.addWorksheet('visitas_personas');

// Defino las columnas
worksheet_egresos.columns = [
    { key : 'id_operacion_egreso', header : 'Numero registro',  width: 20  },
    { key : 'nombre_usuario', header : 'Nombre Usuario',  width: 20 },            
    { key : 'nombre_completo', header : 'Nombre Completo',  width: 20 },            
    { key : 'cedula', header : 'Cedula',  width: 20 },            
    { key : 'tipo_egreso', header : 'Tipo Egreso',  width: 20 },            
    { key : 'nro_factura', header : 'Numero Factura',  width: 20 },            
    { key : 'comentario', header : 'Comentario',  width: 20 },            
    { key : 'monto', header : 'Monto',  width: 20 },            
    { key : 'fecha_pago', header : 'Fecha de Pago',  width: 20 },            
    { key : 'fecha_carga', header : 'Fecha de Carga',  width: 20 },            
    { key : 'fecha_actualizacion', header : 'Fecha de actualizacion',  width: 20 }       

];




const agrega_regreso = async ( req = request, res = response )=>{
    try {
        
        const { idTipoEgreso, descripcionEgreso, montoEngreso, idSocio, nroFactura, fechaPago } = req.body;
        const fecha_carga = new Date();

        const [ dia, mes, annio ] =  fechaPago.split( '/' );

        const fechaDePago = new Date( Number(annio), Number(mes) -1 , Number(dia)  );


        const nuevo_egreso = await prisma.egresos.create( { data : {  
                                                                        cargado_en : fecha_carga,
                                                                        editado_en : fecha_carga,
                                                                        monto : montoEngreso,
                                                                        id_socio : idSocio,
                                                                        id_tipo : idTipoEgreso,
                                                                        descripcion : descripcionEgreso,
                                                                        nro_factura : nroFactura,
                                                                        fecha_pago : fechaDePago,
                                                                        comprobante : ''
                                                                    } 
                                                        } )

        const { cargado_en, id_socio, monto, id_tipo, descripcion } = nuevo_egreso;

        const nuevoEgreso = {
            cargadoEn : cargado_en,
            idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
            monto,
            idTipo : id_tipo,
            descripcion
        }

        res.status( 200 ).json( {
            status : true,
            msg : "Egreso Cargado",
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


const actualizar_egreso = async ( req = request, res = response )=>{


    try {
        const { idOperacionEgreso, montoNuevo, descripcionNueva, comprobanteNuevo, nroFacturaNuevo } = req.body;
        
        const fecha_edicion = new Date();

        const edicion_egreso = await prisma.egresos.update( { 
                                                                data : { 
                                                                    monto : montoNuevo,
                                                                    descripcion : descripcionNueva,
                                                                    comprobante : comprobanteNuevo,
                                                                    nro_factura : nroFacturaNuevo,
                                                                    editado_en : fecha_edicion
                                                                },
                                                                where : { is_operacion_egreso : idOperacionEgreso }
                                                             } )
        
        const { is_operacion_egreso, monto, nro_factura, descripcion, id_tipo, id_socio, editado_en } = edicion_egreso;
        
        const egresoEditado = {
            idOperacionEgreso : is_operacion_egreso,
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
            egresoEditado
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



const obtener_egresos_x_fecha = async ( req = request, res = response )=>{


    try {
        
        const { fechaDesde, fechaHasta, pagina } = req.query;

        const [ dia_desde, mes_desde, annio_desde ] = fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] = fechaHasta.split( '/' );

        const fecha_desde_format = `${annio_desde}-${mes_desde}-${dia_desde}`;

        const fecha_hasta_format = `${annio_hasta}-${mes_hasta}-${dia_hasta}`;        

        const query = `SELECT A.is_operacion_egreso AS id_operacion_egreso,
                                A.id_socio,
                                B.nombre_usuario,
                                B.nombre_cmp,
                                A.id_tipo AS id_tipo_egreso,
                                C.descripcion AS tipo_ingreso,
                                A.descripcion AS comentario,
                                A.monto,
                                A.nro_factura,
                                A.cargado_en AS fecha_carga,
                                A.editado_en as fecha_actualizacion
                            FROM EGRESOS A JOIN SOCIO B ON A.id_socio = B.id_socio
                            JOIN TIPOS_EGRESO C ON A.id_tipo = C.id_tipo
                        WHERE A.cargado_en BETWEEN DATE '${fecha_desde_format}' AND DATE '${fecha_hasta_format}'
                        ORDER BY A.cargado_en DESC
                        LIMIT 20 OFFSET ${Number(pagina)}`



        const egresos_x_fecha = await prisma.$queryRawUnsafe(query);

        let egresosXFecha = [];
        egresos_x_fecha.forEach( ( value )=>{
            const {  id_operacion_egreso,
                    id_socio,
                    nombre_usuario,
                    nombre_cmp,
                    id_tipo_egreso,
                    tipo_ingreso,
                    comentario,
                    monto,
                    nro_factura,
                    fecha_carga,
                    fecha_actualizacion } = value;
            
            
            egresosXFecha.push( {
                idOperacionEgreso : id_operacion_egreso,
                idSocio : (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio),
                nombreUsuario : nombre_usuario,
                nombreCmp : nombre_cmp,
                tiposIngreso : tipo_ingreso,
                comentario : comentario,
                nroFactura : nro_factura,
                monto : monto,
                fechaCarga : fecha_carga,
                fechaActualizacion : fecha_actualizacion
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
        
        const { fecha_desde, fecha_hasta } = req.query;

        const egresos_x_fecha = await prisma.$queryRaw`SELECT A.is_operacion_egreso AS id_operacion_egreso,
                                                		    	B.nombre_usuario, 
                                                		    	CONCAT(F.apellido, ', ', F.nombre) as nombre_completo,
                                                                F.cedula,
                                                		    	C.descripcion AS tipo_egreso, 
                                                		    	A.nro_factura,
                                                		    	A.descripcion AS comentario, 
                                                		    	A.monto, 
														    	A.fecha_pago,
                                                		    	A.cargado_en AS fecha_carga,
                                                		    	A.editado_en as fecha_actualizacion		
                                                            FROM EGRESOS A 
												            JOIN SOCIO B ON A.id_socio = B.id_socio
												            JOIN PERSONA F ON B.id_persona = F.id_persona
                                                            JOIN TIPOS_EGRESO C ON A.id_tipo = C.id_tipo
                                                        WHERE A.cargado BETWEEN ${fecha_desde} AND ${fecha_hasta}
                                                        LIMIT 10 OFFSET ${pagina}
                                                        ORDER BY A.cargado DESC`;
        egresos_x_fecha.forEach( ( value )=>{
            const { id_operacion_egreso, fecha_carga, 
                    fecha_actualizacion, monto, comentario, 
                    nro_factura, tipo_egreso, cedula,
                    nombre_completo, nombre_usuario } = value;

            worksheet_egresos.addRow( { 
                                            id_operacion_egreso, fecha_carga, 
                                            fecha_actualizacion, monto, comentario, 
                                            nro_factura, tipo_egreso, cedula,
                                            nombre_completo, nombre_usuario 
                                    } );
        } );



        let ruta = path.join( __dirname, `../reportes/${fecha_reporte.toLocaleString().split('/').join('_').split(':').join('_').split(', ').join( '_' )}.xlsx` );
        await workbook_egresos.xlsx.writeFile(ruta);
        res.sendFile(ruta);

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



const obtener_egresos = async ( req = request, res = response )=>{

    try {
        
        const { fechaDesde, fechaHasta, pagina } = req.query;

        const [ dia_desde, mes_desde, annio_desde ] =  fechaDesde.split( '/' );

        const [ dia_hasta, mes_hasta, annio_hasta ] =  fechaHasta.split( '/' );


        const fecha_desde = new Date( Number(annio_desde), Number(mes_desde) -1 , Number(dia_desde)  );

        const fecha_hasta = new Date( Number(annio_hasta), Number(mes_hasta) -1 , Number(dia_hasta) );

        const query = await prisma.$queryRaw`SELECT A.is_operacion_egreso AS id_operacion_egreso,
                                                		A.id_socio, 
                                                		B.nombre_usuario, 
                                                		B.nombre_cmp,
                                                		A.id_tipo AS id_tipo_egreso, 
                                                		A.nro_factura,
                                                		C.descripcion AS tipo_ingreso,
                                                		A.descripcion AS comentario, 
                                                		A.monto, 
                                                		A.cargado_en AS fecha_carga,
                                                		A.editado_en as fecha_actualizacion		
                                                FROM EGRESOS A JOIN SOCIO B ON A.id_socio = B.id_socio
                                                JOIN TIPOS_EGRESO C ON A.id_tipo = C.id_tipo
                                            WHERE A.cargado BETWEEN ${fecha_desde} AND ${fechaHasta}
                                            LIMIT 10 OFFSET ${pagina}
                                            ORDER BY A.cargado DESC`

        const egresosXFecha = []

        if ( query.length > 0 ){

            query.forEach( ( value )=>{

                const { id_operacion_egreso ,
                        id_socio, 
                        nombre_usuario, 
                        nombre_cmp,
                        id_tipo , 
                        nro_factura,
                        id_tipo_egreso,
                        comentario, 
                        monto, 
                        fecha_carga,
                        fecha_actualizacion  } = value;

                        
                egresosXFecha.push( {
                        idOperacionEgreso : id_operacion_egreso ,
                        idSocio : id_socio, 
                        nombreUsuario : nombre_usuario, 
                        nombreCmp : nombre_cmp,
                        idTipo : id_tipo_egreso , 
                        nroFactura : nro_factura,
                        tiposEgreso : tipo_ingreso,
                        comentario, 
                        monto, 
                        fechaCarga : fecha_carga,
                        fechaActualizacion : fecha_actualizacion 
                } )
            });



        }


        res.status( 200 ).json(
            {
                status : true,
                msj : `Egresos de las fechas ${fechaDesde } y ${ fechaHasta }`,
                egresosXFecha
            }
        )

    } catch (error) {
        console.log( error );

        res.status( 400 ).json( {
            status : false,
            msg : "No se pudo obtener los ingresos, error : " + error,
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
