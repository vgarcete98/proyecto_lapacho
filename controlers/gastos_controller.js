
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();




const cargar_gasto_club = async ( req = request, res = response ) =>{

    const { idTipoPago,
            idUsuario,
            nroFactura,
            descripcion,
            montoGasto,
            ingresoXegreso } = req.body;
    
    // VAMOS A DETERMINAR QUE HACER DEPENDIENDO DE LO QUE SE CARGUE EN EL CAMPO INGRESOxEGRESO
    
    let nuevo_ingresoXegreso;
    const fecha_creacion_gasto = new Date();
    try {
        if ( ingresoXegreso === true ){
            //VAMOS A HACER QUE SE TRABAJE EN BASE A BOOLEANOS
            nuevo_ingresoXegreso = await prisma.$executeRaw`INSERT INTO GASTOS_CLUB
                                                            ( ID_TIPO_PAGO, ID_USUARIO, NRO_FACTURA, GASTOCREADOEN, 
                                                            DESCRIPCION, MONTO_GASTO, INGRESO, EGRESO )
                                                            VALUES
                                                            ( ${ idTipoPago }, ${ idUsuario }, ${ nroFactura },
                                                                ${ fecha_creacion_gasto }, ${ descripcion },
                                                                ${ monto_gasto }, ${ ingresoXegreso }, ${ false } )`;
        }else {
            nuevo_ingresoXegreso = await prisma.$executeRaw`INSERT INTO GASTOS_CLUB
                                                            ( ID_TIPO_PAGO, ID_USUARIO, NRO_FACTURA, GASTOCREADOEN, 
                                                            DESCRIPCION, MONTO_GASTO, INGRESO, EGRESO )
                                                            VALUES
                                                            ( ${ idTipoPago }, ${ idUsuario }, ${ nroFactura },
                                                                ${ fecha_creacion_gasto }, ${ descripcion },
                                                                ${ montoGasto }, ${ ingresoXegreso }, ${ true } )`;
        }
    
        if ( nuevo_ingresoXegreso > 1 ){
    
            res.status( 200 ).json( {
                status : true,
                filas_afectadas : nuevo_ingresoXegreso,
                msg : "Gasto/Ingreso insertado correctamente",
                datos_insertados : {
                    idTipoPago,
                    idUsuario,
                    nroFactura,
                    descripcion,
                    montoGasto,
                    ingresoXegreso 
                }
            } );
        }else {
            res.status( 400 ).json( {
                status : true,
                filas_afectadas : nuevo_ingresoXegreso,
                msg : "Ningun gasto/ingreso agregado",
                datos_no_insertados : {
                    idTipoPago,
                    idUsuario,
                    nroFactura,
                    descripcion,
                    montoGasto,
                    ingresoXegreso 
                }
            } );
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se ha podido procesar la consulta',
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
                                                                                END AS INGRESOxEGRESO
                                            FROM USUARIO A JOIN GASTOS_CLUB B ON A.ID_USUARIO = B.ID_USUARIO
                                            WHERE EXTRACT ( MONTH FROM GASTOCREADOEN ) = EXTRACT( MONTH FROM CURRENT_DATE )`;
        
        if ( gastos_del_mes.length === 0 ){
            //NO HAY DATOS DE BALANCES EN EL MES
            res.status( 200 ).json( {
                status : false,
                msg : "no hay registros del mes hasta el momento",
                cantidad_registros : gastos_del_mes.length,
                gastos_del_mes

            } );
        } else {
            //DEVUELVO LOS DATOS CARGADOS DEL MES
            res.status( 200 ).json( {
                status : true,
                msg : "Registros del mes hasta el momento",
                cantidad_registros : gastos_del_mes.length,
                gastos_del_mes

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


