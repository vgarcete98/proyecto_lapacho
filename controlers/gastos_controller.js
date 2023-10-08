
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();




const cargar_gasto_club = async ( req = request, res = response ) =>{

    const { idTipoPago,
            //idUsuario,
            nroFactura,
            descripcion,
            montoGasto,
            ingresoXegreso } = req.body;
    
    const { token_trad } = req;
    //console.log( token_trad );
    //const [ rol_usuario,...resto ] = token_trad;
    const { id_usuario } = token_trad;
    // VAMOS A DETERMINAR QUE HACER DEPENDIENDO DE LO QUE SE CARGUE EN EL CAMPO INGRESOxEGRESO
    const idUsuarioTrad = id_usuario;
    let nuevo_ingresoXegreso;
    const fecha_creacion_gasto = new Date();
    const descripcionGasto = descripcion;
    try {


        if ( ingresoXegreso === true ){
            //VAMOS A HACER QUE SE TRABAJE EN BASE A BOOLEANOS
            //------------------------------------------------------------------------------------------------------
            /*nuevo_ingresoXegreso = await prisma.$executeRaw`INSERT INTO GASTOS_CLUB
                                                            ( ID_TIPO_PAGO, ID_USUARIO, NRO_FACTURA, GASTOCREADOEN, 
                                                            DESCRIPCION, MONTO_GASTO, INGRESO, EGRESO )
                                                            VALUES
                                                            ( ${ idTipoPago }, ${ idUsuario }, ${ nroFactura },
                                                                ${ fecha_creacion_gasto }, ${ descripcion },
                                                                ${ monto_gasto }, ${ ingresoXegreso }, ${ false } )`;*/
            nuevo_ingresoXegreso = await prisma.gastos_club.create( { data : {
                                                                                id_tipo_pago : idTipoPago,
                                                                                id_usuario : idUsuarioTrad,
                                                                                nro_factura : nroFactura,
                                                                                descripcion : descripcionGasto,
                                                                                monto_gasto : montoGasto,
                                                                                ingreso : ingresoXegreso,
                                                                                egreso : false,
                                                                                gastocreadoen : fecha_creacion_gasto
                                                                            } 
                                                                    } );
            //------------------------------------------------------------------------------------------------------                                                               
        }else {
            //------------------------------------------------------------------------------------------------------            
            /*nuevo_ingresoXegreso = await prisma.$executeRaw`INSERT INTO GASTOS_CLUB
                                                            ( ID_TIPO_PAGO, ID_USUARIO, NRO_FACTURA, GASTOCREADOEN, 
                                                            DESCRIPCION, MONTO_GASTO, INGRESO, EGRESO )
                                                            VALUES
                                                            ( ${ idTipoPago }, ${ idUsuario }, ${ nroFactura },
                                                                ${ fecha_creacion_gasto }, ${ descripcion },
                                                                ${ montoGasto }, ${ ingresoXegreso }, ${ true } )`;*/
            nuevo_ingresoXegreso = await prisma.gastos_club.create( { data : {
                                                                                id_tipo_pago : idTipoPago,
                                                                                id_usuario : idUsuarioTrad,
                                                                                nro_factura : nroFactura,
                                                                                descripcion : descripcionGasto,
                                                                                monto_gasto : montoGasto,
                                                                                egreso : true,
                                                                                ingreso : false,
                                                                                gastocreadoen : fecha_creacion_gasto
                                                                            } 
                                                                    } );
            //------------------------------------------------------------------------------------------------------
        }

    
        if ( nuevo_ingresoXegreso !== null || nuevo_ingresoXegreso !== undefined ){
            const { descripcion, egreso, ingreso,
                    gastocreadoen, monto_gasto, nro_factura } = nuevo_ingresoXegreso;
    
            res.status( 200 ).json( {
                status : true,
                //filas_afectadas : nuevo_ingresoXegreso,
                msg : "Gasto/Ingreso insertado correctamente",
                gastoRegistrado : {
                    idTipoPago ,
                    idUsuario : idUsuarioTrad,
                    nroFactura : nro_factura,
                    descripcion ,
                    montoGasto : monto_gasto,
                    gastoCreadoEn : gastocreadoen,
                    egreso, 
                    ingreso 
                }
            } );
        }else {
            res.status( 400 ).json( {
                status : true,
                //filas_afectadas : nuevo_ingresoXegreso,
                msg : "Ningun gasto/ingreso agregado",
                datos_no_insertados : {
                    idTipoPago ,
                    idUsuario : idUsuarioTrad,
                    nroFactura ,
                    descripcion ,
                    montoGasto ,
                    gastoCreadoEn,
                    egreso, 
                    ingreso
                }
            } );
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se ha podido procesar la insercion del registro',
            error
        } );
        
    }

}

const obtener_gastos_x_mes = async ( req = request, res = response ) =>{

    try {
        const gastos_del_mes = await prisma.$queryRaw`SELECT A.NOMBRE_USUARIO, B.NRO_FACTURA, B.GASTOCREADOEN, B.GASTOEDITADOEN,
                                                B.DESCRIPCION, B.MONTO_GASTO,	CASE
                                                                                    WHEN B.INGRESO = TRUE THEN 'INGRESO'
                                                                                    ELSE 'EGRESO'
                                                                                END AS INGRESOxEGRESO, CAST ( B.ID_PAGO_CLUB AS INTEGER ) AS ID_PAGO_CLUB
                                            FROM USUARIO A JOIN GASTOS_CLUB B ON A.ID_USUARIO = B.ID_USUARIO
                                            WHERE EXTRACT ( MONTH FROM GASTOCREADOEN ) = EXTRACT( MONTH FROM CURRENT_DATE )`;
        
        const gastosDelMes = gastos_del_mes.map ( ( element )=>{

            const { nombre_usuario, nro_factura, gastocreadoen, 
                    gastoeditadoen, descripcion, ingresoxegreso, id_pago_club } = element;
            const descripcion_gasto = descripcion;

            return {
                nombreUsuario : nombre_usuario,
                nroFactura : nro_factura,
                gastoCreadoEn : gastocreadoen,
                gastoEditadoEn : gastoeditadoen,
                descripcion : descripcion_gasto, 
                igresoXEgreso : ingresoxegreso, 
                idPagoClub : id_pago_club
            }
        } );
        
        if ( gastos_del_mes.length === 0 ){
            //NO HAY DATOS DE BALANCES EN EL MES
            res.status( 200 ).json( {
                status : false,
                msg : "no hay registros del mes hasta el momento",
                cantidadRegistros : gastos_del_mes.length,
                gastosDelMes

            } );
        } else {
            //DEVUELVO LOS DATOS CARGADOS DEL MES
            res.status( 200 ).json( {
                status : true,
                msg : "Registros del mes hasta el momento",
                cantidadRegistros : gastos_del_mes.length,
                gastosDelMes

            } );
        }
    } catch (error) {

        console.log ( error );

        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo procesar la consulta",
            error
        } );

    }
    
}


const editar_gasto_club = async ( req = request, res = response ) =>{

    const { nro_factura } = req.params;

    const { nuevoNumeroFactura, 
            nuevaDescripcion, 
            nuevoMontoGasto, 
            nuevoIngreso,
            nuevoEgreso } = req.body;
    // VAMOS A REALIZAR UNA EDICION EN EL NUMERO DE LA FACTURA SI ES QUE LA MISMA VIENE EN LA REQUEST

    try {
        let gasto_editado;
    
        if ( nuevoNumeroFactura !== '' ){
            gasto_editado = await prisma.$executeRaw`UPDATE public.gastos_club
                                                        SET  nro_factura= ${ nuevoNumeroFactura }, gastoeditadoen= ${ new Date() }, 
                                                        descripcion= ${ nuevaDescripcion }, monto_gasto= ${ nuevoMontoGasto }, 
                                                        ingreso= ${ nuevoIngreso }, egreso= ${ nuevoEgreso }
                                                    WHERE nro_factura = ${ nro_factura };`
    
        } else if ( nuevoIngreso === true ){
            // SE QUIERE CAMBIAR UN TIPO DE GASTO DE INGRESO A EGRESO
            gasto_editado = await prisma.$executeRaw`UPDATE public.gastos_club
                                                        SET gastoeditadoen= ${ new Date() }, descripcion= ${ descripcion }, 
                                                        monto_gasto= ${ nuevoMontoGasto }, ingreso= ${ nuevoIngreso }, egreso= ${ nuevoEgreso }
                                                    WHERE nro_factura = ${ nro_factura };`
    
    
        } else { 
            //EDICION NORMAL DE UN GASTO/INGRESO 
            gasto_editado = await prisma.$executeRaw`UPDATE public.gastos_club
                                                        SET gastoeditadoen= ${ new Date() }, descripcion= ${ descripcion }, 
                                                        monto_gasto= ${ nuevoMontoGasto }, ingreso= ${ nuevoIngreso }, egreso= ${ nuevoEgreso }
                                                    WHERE nro_factura = ${ nro_factura };`
        }

        res.status( 200 ).json( {
            status : true,
            msg : 'Gasto editado con exito',
            gasto : {
                nro_factura,
                nuevoNumeroFactura, 
                nuevaDescripcion, 
                nuevoMontoGasto, 
                nuevoIngreso,
                nuevoEgreso

            }
        } );


    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo editar el gasto',
            gasto : {
                nro_factura,
                nuevoNumeroFactura, 
                nuevaDescripcion, 
                nuevoMontoGasto, 
                nuevoIngreso,
                nuevoEgreso

            }
        } );
        
    }
    

    
}


const borrar_gasto = async ( req = request, res = response ) => {

    const { id_gasto } = req.query;

    try {
        const gasto_editado = await prisma.gastos_club.update ( { 
            where : { id_pago_club : id_gasto },
            data : {
                gasto_borrado : true
            }
            
        } );

        res.status( 200 ).json( {
            status : true,
            msg : "Registro eliminado exitosamente",
            gasto_editado
        } );

    } catch (error) {
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo eliminar el registro "
        } )          
    }



}





module.exports = {

    obtener_gastos_x_mes,
    cargar_gasto_club ,
    editar_gasto_club , 
    borrar_gasto
}


