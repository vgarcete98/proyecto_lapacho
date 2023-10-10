
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
                                                                                gastocreadoen : fecha_creacion_gasto,
                                                                                gasto_borrado : false
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
                                                                                gastocreadoen : fecha_creacion_gasto,
                                                                                gasto_borrado : false
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
                                            WHERE EXTRACT ( MONTH FROM GASTOCREADOEN ) = EXTRACT( MONTH FROM CURRENT_DATE )
                                            AND B.GASTO_BORRADO = false`;
        
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



/*  Yo le paso esto a mi post y tendria que ser igual para todos
    "idTipoPago" : 1,
    "nroFactura" : "XXXX-XXXXXX-XXXXXX2",
    "descripcion": "PAGO ALQUILER MES NOVIEMBRE",
    "montoGasto" : 4400000,
    "ingresoXegreso" : true */
const editar_gasto_club = async ( req = request, res = response ) =>{

    const { id_gasto } = req.params;

    const { nroFactura, 
            descripcion, 
            montoGasto, 
            ingresoXegreso,
            idTipoPago } = req.body;
    // VAMOS A REALIZAR UNA EDICION EN EL NUMERO DE LA FACTURA SI ES QUE LA MISMA VIENE EN LA REQUEST
    const fecha_edicion_gasto = new Date();
    const descripcionNueva = descripcion;

    const [ nuevo_ingreso, nuevo_egreso ] = [ false, false ];
    // Se trata de un ingreso
    //condición ? expr1 : expr2
    ingresoXegreso === true ? ingreso = true : egreso = false;
    //Se trata de un egreso 
    ingresoXegreso === false ? ingreso = false : egreso = true;    
    try {
        let gasto_editado;
        const { token_trad } = req;
        //console.log( token_trad );
        //const [ rol_usuario,...resto ] = token_trad;
        const { id_usuario } = token_trad;
        const idUsuario = id_usuario;
        if ( nroFactura !== '' || nroFactura === undefined || nroFactura === null ){
            //----------------------------------------------------------------------------------------------------------------------
            /*gasto_editado = await prisma.$executeRaw`UPDATE public.gastos_club
                                                        SET  nro_factura= ${ nuevoNumeroFactura }, gastoeditadoen= ${ new Date() }, 
                                                        descripcion= ${ nuevaDescripcion }, monto_gasto= ${ nuevoMontoGasto }, 
                                                        ingreso= ${ nuevoIngreso }, egreso= ${ nuevoEgreso }
                                                    WHERE nro_factura = ${ nro_factura };`*/
            gasto_editado = await prisma.gastos_club.update( {
                                                                where : { id_pago_club : Number(id_gasto) },
                                                                data : {
                                                                    monto_gasto : montoGasto,
                                                                    descripcion : descripcionNueva,
                                                                    gastoeditadoen : fecha_edicion_gasto,
                                                                    ingreso : nuevo_ingreso,
                                                                    egreso : nuevo_egreso,
                                                                    id_tipo_pago : idTipoPago,
                                                                    id_usuario : idUsuario
                                                                }
                                                            } );
            //----------------------------------------------------------------------------------------------------------------------    
        } else { 
            //EDICION NORMAL DE UN GASTO/INGRESO 
            /*gasto_editado = await prisma.$executeRaw`UPDATE public.gastos_club
                                                        SET gastoeditadoen= ${ new Date() }, descripcion= ${ descripcion }, 
                                                        monto_gasto= ${ nuevoMontoGasto }, ingreso= ${ nuevoIngreso }, egreso= ${ nuevoEgreso }
                                                    WHERE nro_factura = ${ nro_factura };`*/
            gasto_editado = await prisma.gastos_club.update( {
                                                                where : { id_pago_club : Number(id_gasto) },
                                                                data : {
                                                                    monto_gasto : montoGasto,
                                                                    descripcion : descripcionNueva,
                                                                    gastoeditadoen : fecha_edicion_gasto,
                                                                    ingreso : nuevo_ingreso,
                                                                    egreso : nuevo_egreso,
                                                                    nro_factura : nroFactura,
                                                                    id_tipo_pago : idTipoPago,
                                                                    id_usuario : idUsuario
                                                                }
                                                            } );
        }
        const { monto_gasto, descripcion, gastoeditadoen, 
                ingreso, egreso, nro_factura, id_pago_club, id_tipo_pago } = gasto_editado;

        res.status( 200 ).json( {
            status : true,
            msg : 'Gasto editado con exito',
            gasto : {
                nroFactura : nro_factura,
                id_usuario , 
                descripcion , 
                idTipoPago , 
                ingreso ,
                egreso,
                montoGasto : monto_gasto

            }
        } );


    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo editar el gasto',
            gasto : {
                nroFactura ,
                id_usuario , 
                descripcion , 
                idTipoPago , 
                ingreso ,
                egreso,
                montoGasto 

            }
        } );
        
    }
    

    
}


const borrar_gasto = async ( req = request, res = response ) => {

    const { id_gasto } = req.params;
    const fecha_edicion_gasto = new Date();
    try {
        const gasto_editado = await prisma.gastos_club.update ( { 
            where : { id_pago_club : id_gasto },
            data : {
                gasto_borrado : true,
                gastoeditadoen : fecha_edicion_gasto
            }
            
        } );

        const { descripcion, gastoeditadoen, monto_gasto, 
                nro_factura, gastocreadoen } = gasto_editado;
        /*"idTipoPago": 1,
        "idUsuario": 1,
        "nroFactura": "XXXX-XXXXXX-XXXXXX2",
        "descripcion": "PAGO ALQUILER MES NOVIEMBRE",
        "montoGasto": 4400000,
        "gastoCreadoEn": "2023-10-09T00:00:00.000Z",
        "egreso": false,
        "ingreso": true*/
        res.status( 200 ).json( {
            status : true,
            msg : "Registro eliminado exitosamente",
            gastoRegistrado : {
                descripcion, 
                gastoEditadoEn : gastoeditadoen,
                gastoCreadoEn : gastocreadoen, 
                montoGasto : monto_gasto, 
                nroFactura : nro_factura
            }
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


