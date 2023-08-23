
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();




const cargar_gasto_club = async ( req = request, res = response ) =>{

    const { id_tipo_pago,
            id_usuario,
            nro_factura,
            descripcion,
            monto_gasto,
            ingresoXegreso } = req.body;
    
    // VAMOS A DETERMINAR QUE HACER DEPENDIENDO DE LO QUE SE CARGUE EN EL CAMPO INGRESOxEGRESO
    
    let nuevo_ingresoXegreso;
    if ( ingresoXegreso === true ){
        //VAMOS A HACER QUE SE TRABAJE EN BASE A BOOLEANOS
        nuevo_ingresoXegreso = await prisma.$executeRaw`INSERT INTO GASTOS_CLUB
                                                        ( ID_TIPO_PAGO, ID_USUARIO, NRO_FACTURA, GASTOCREADOEN, 
                                                        DESCRIPCION, MONTO_GASTO, INGRESO, EGRESO )
                                                        VALUES
                                                        ( ${ id_tipo_pago },${ id_usuario },${ nro_factura },
                                                            new Date(),${ descripcion },${ monto_gasto },${ ingresoXegreso },false )`;
    }else {
        nuevo_ingresoXegreso = await prisma.$executeRaw`INSERT INTO GASTOS_CLUB
                                                        ( ID_TIPO_PAGO, ID_USUARIO, NRO_FACTURA, GASTOCREADOEN, 
                                                        DESCRIPCION, MONTO_GASTO, INGRESO, EGRESO )
                                                        VALUES
                                                        ( ${ id_tipo_pago },${ id_usuario },${ nro_factura },
                                                            new Date(),${ descripcion },${ monto_gasto },${ ingresoXegreso }, true )`;
    }

    if ( nuevo_ingresoXegreso > 1 ){

        res.status( 200 ).json( {
            status : true,
            filas_afectadas : nuevo_ingresoXegreso,
            msg : "Gasto/Ingreso insertado correctamente",
            datos_insertados : {
                id_tipo_pago,
                id_usuario,
                nro_factura,
                descripcion,
                monto_gasto,
                ingresoXegreso 
            }
        } );
    }else {
        res.status( 400 ).json( {
            status : true,
            filas_afectadas : nuevo_ingresoXegreso,
            msg : "Ningun gasto/ingreso agregado",
            datos_no_insertados : {
                id_tipo_pago,
                id_usuario,
                nro_factura,
                descripcion,
                monto_gasto,
                ingresoXegreso 
            }
        } );
    }

}

const obtener_gastos_x_mes = async ( req = request, res = response ) =>{

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
    
}


const editar_gasto_club = async ( req = request, res = response ) =>{

    const { nro_factura,
            nuevo_numero_factura, 
            nueva_descripcion, 
            nuevo_monto_gasto, 
            ingresoXegreso } = req.body;
    // VAMOS A REALIZAR UNA EDICION EN EL NUMERO DE LA FACTURA SI ES QUE LA MISMA VIENE EN LA REQUEST

    let gasto_editado;
    /*
    if ( nuevo_numero_factura !== '' ){
        gasto_editado = await prisma.$executeRaw`UPDATE public.gastos_club
                                                    SET  nro_factura= ${ nuevo_numero_factura }, gastoeditadoen= ${ new Date() }, 
                                                    descripcion= ${ descripcion }, monto_gasto= ${ nuevo_monto_gasto }, 
                                                    ingreso= ${  }, egreso= ${  }
                                                WHERE nro_factura = ${ nro_factura };`

    } else if ( ingresoXegreso === true ){
        // SE QUIERE CAMBIAR UN TIPO DE GASTO DE INGRESO A EGRESO
        gasto_editado = await prisma.$executeRaw`UPDATE public.gastos_club
                                                    SET gastoeditadoen= ${ new Date() }, descripcion= ${ descripcion }, 
                                                    monto_gasto= ${ nuevo_monto_gasto }, ingreso= ${  }, egreso= ${  }
                                                WHERE nro_factura = ${ nro_factura };`


    } else { 
        //EDICION NORMAL DE UN GASTO/INGRESO 
        gasto_editado = await prisma.$executeRaw`UPDATE public.gastos_club
                                                    SET gastoeditadoen= ${ new Date() }, descripcion= ${ descripcion }, 
                                                    monto_gasto= ${  }, ingreso= ${  }, egreso= ${  }
                                                WHERE nro_factura = '';`
    }
    */

    
}








module.exports = {

    obtener_gastos_x_mes,
    cargar_gasto_club ,
    editar_gasto_club
}


