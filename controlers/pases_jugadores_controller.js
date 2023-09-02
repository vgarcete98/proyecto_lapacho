const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


// VOY A MANEJAR LOS ESTADOS DE UN PASE DESDE AQUI NADA MAS DEBIDO A LOS POCOS VALORES QUE PUEDE POSEER LA MISMA

const estado_pases = {

    pendiente_pago : 1,
    pendiente_federacion : 2,
    suspendido : 3,
    realizado : 4
}



const verificar_club_destino = async ( id_club_destino = 0 ) =>{

    //FUNCION QUE VERIFICA SI EL CLUB DESTINO ESTA HABILITADO
    const club_destino = await prisma.clubes_habilitados.findUnique({
                                                                        where: {
                                                                            id_club_habilitado : id_club_destino,
                                                                        }
                                                                    });
    if ( club_destino === null || club_destino === undefined ) { 
        return false;
    } else {
        return true;
    }

}






const generar_pase_jugador = async ( req = request, res = response ) =>{

    // DEBERIA DE RECIBIR EN EL BODY LOS DATOS PARA REALIZAR UN TRASPASO DE UN JUGADOR
    // EN TEORIA SOLO SERIA EL SOCIO QUE SE QUIERE TRASPASAR, EL CLUB DESTINO Y EL MONTO SI EXISTE EN EL MOMENTO

    const { id_socio, id_club_destino, descripcion, 
            monto_traspaso, doc_adjuntado, abonado } = req.body;
    
    const jugador_traspasado = { 
                                    id_socio, id_club_destino, descripcion, 
                                    monto_traspaso, doc_adjuntado, abonado 
                                }

    const club_habilitado = await verificar_club_destino ( id_club_destino );

    if ( club_habilitado === true ) { 
        //SE PUEDE REALIZAR ESE TRASPASO
        const  estado_traspaso = abonado ? estado_pases.pendiente_federacion : estado_pases.pendiente_pago ;

        const nuevo_traspaso = await prisma.$executeRaw`INSERT INTO public.pases_socio(
                                                                        id_club_habilitado, id_socio, 
                                                                        descripcion_traspaso, monto_pase, 
                                                                        doc_adjunto, abonado, estado_pase_socio )
                                                                        VALUES ( ${ id_club_destino }, ${ id_socio },
                                                                                  ${ descripcion }, ${ monto_traspaso },  
                                                                                  ${ doc_adjuntado }, ${ abonado }, ${ estado_traspaso });`
                                            
        if ( nuevo_traspaso > 0 ) {
            res.status( 200 ).json({
                status : true,
                msg : "Traspaso insertado con exito",
                jugador_traspasado
            });
        }else {
            res.status( 200 ).json({
                status : false,
                msg : "No se pudo insertar el fichaje",
                jugador_traspasado
            });
        }
    } else {
        // NO SE PUEDE REALIZAR ESE TRASPASO
        res.status( 200 ).json({
            status : false,
            msg : "No se puede realizar el fichaje debido a que el club no esta habilitado",
            jugador_traspasado
        });
    
    }



}



const obtener_pases_pendientes = async ( req = request, res = response ) =>{

    // OBTENGO LOS PASES PENDIENTES QUE DEBEN DE ABONARSE
    const pases_pendientes = await prisma.$queryRaw`SELECT A.ID_PASE, B.ID_SOCIO, CONCAT ( C.NOMBRE, ' ', C.APELLIDO ) AS NOMBRE_SOCIO, C.CEDULA,
                                                            A.DESCRIPCION_TRASPASO AS DESCRIPCION, A.MONTO_PASE, A.ABONADO, 
                                                            D.NOMBRE_CLUB_HABILITADO AS NOMBRE_CLUB, A.ESTADO_PASE_SOCIO
                                                        FROM PASES_SOCIO A JOIN CLUBES_HABILITADOS D ON A.ID_CLUB_HABILITADO = D.ID_CLUB_HABILITADO
                                                        JOIN SOCIO B ON A.ID_SOCIO = B.ID_SOCIO
                                                        JOIN PERSONA C ON B.ID_PERSONA = C.ID_PERSONA
                                                    WHERE A.ABONADO = FALSE AND D.ESTA_HABILITADO = TRUE AND A.ESTADO_PASE_SOCIO = ${ estado_pases.pendiente_pago }`;
    if ( pases_pendientes.length === 0 ){
        res.status( 200 ).json(

            {
                status : false,
                msj : 'No se registran pagos pendientes de pases',
                cantidad : pases_pendientes.length,
                pases_pendientes
            }
        );
    } else {
        res.status( 200 ).json(

            {
                status : true,
                msj : 'Pases pendientes de pagos',
                cantidad : pases_pendientes.length,
                pases_pendientes
            }
        );

    }


}


const obtener_pases_completados = async ( req = request, res = response ) =>{

    // OBTENGO LOS PASES ABONADOS Y QUE YA ESTARIAN REALIZADOS
    const pases_pendientes = await prisma.$queryRaw`SELECT A.ID_PASE, B.ID_SOCIO, CONCAT ( C.NOMBRE, ' ', C.APELLIDO ) AS NOMBRE_SOCIO, C.CEDULA,
                                                            A.DESCRIPCION_TRASPASO AS DESCRIPCION, A.MONTO_PASE, A.ABONADO, 
                                                            D.NOMBRE_CLUB_HABILITADO AS NOMBRE_CLUB, A.ESTADO_PASE_SOCIO
                                                        FROM PASES_SOCIO A JOIN CLUBES_HABILITADOS D ON A.ID_CLUB_HABILITADO = D.ID_CLUB_HABILITADO
                                                        JOIN SOCIO B ON A.ID_SOCIO = B.ID_SOCIO
                                                        JOIN PERSONA C ON B.ID_PERSONA = C.ID_PERSONA
                                                    WHERE A.ABONADO = TRUE AND D.ESTA_HABILITADO = TRUE AND A.ESTADO_PASE_SOCIO = ${ estado_pases.realizado }`;
    if ( pases_pendientes.length === 0 ){
        res.status( 200 ).json(

            {
                status : false,
                msj : 'No se registran traspasos realizados',
                cantidad : pases_pendientes.length,
                pases_pendientes
            }
        );
    } else {
        res.status( 200 ).json(

            {
                status : true,
                msj : 'Pases pendientes de pagos',
                cantidad : pases_pendientes.length,
                pases_pendientes
            }
        );

    }

}


const abonar_pase_jugador = async ( req = request, res = response ) =>{

    const { id_pase_editar, monto_abonado, descripcion_nueva, 
            id_club_nuevo, doc_adjuntado } = req.body 
    
    const club_habilitado = await verificar_club_destino ( id_club_nuevo );

    if ( club_habilitado === true ) {
        // SE PROCEDE CON LA ACTUALIZACION NORMAL
        // SI SOLO PAGO POR EL MONTO DEL FICHAJE Y NO BRINDO LOS DOCUMENTOS NECESARIOS
        let registro_actualizado = {};
        if ( doc_adjuntado === false ) { 
            registro_actualizado = await prisma.pases_socio.update ( {
                                                                        where : {
                                                                            id_pase : id_pase_editar
                                                                        },
                                                                        data : {
                                                                            abonado : monto_abonado,
                                                                            descripcion_traspaso : descripcion_nueva,
                                                                            id_club_habilitado : id_club_nuevo,
                                                                        }
                                                                    });
    
        } else if ( monto_abonado === 0 ){
            // SI BRINDO LOS DOCUMENTOS PERO NO ABONO
            registro_actualizado = await prisma.pases_socio.update ( {
                                                                        where : {
                                                                            id_pase : id_pase_editar
                                                                        },
                                                                        data : {
                                                                            doc_adjunto : doc_adjuntado,
                                                                            descripcion_traspaso : descripcion_nueva,
                                                                            id_club_habilitado : id_club_nuevo,
                                                                        }
                                                                    });
        } else {
            //SI BRINDO AMBOS
            registro_actualizado = await prisma.pases_socio.update ( {
                                                                        where : {
                                                                            id_pase : id_pase_editar
                                                                        },
                                                                        data : {
                                                                            doc_adjunto : doc_adjuntado,
                                                                            monto_pase : monto_abonado,
                                                                            descripcion_traspaso : descripcion_nueva,
                                                                            id_club_habilitado : id_club_nuevo,
                                                                        }
                                                                    });
        }
        res.status( 200 ).json({
            status : true,
            msg : "Fichaje Actualizado",
            registro_actualizado
        });  
    
    } else {
        // NO SE PUEDE REALIZAR ESE TRASPASO
        res.status( 200 ).json({
            status : false,
            msg : "No se puede actualizar el fichaje debido a que el club no esta habilitado",
        });  
    }



}




module.exports = {
    abonar_pase_jugador,
    generar_pase_jugador,
    obtener_pases_completados,
    obtener_pases_pendientes
}