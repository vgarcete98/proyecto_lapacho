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

    const { idSocio, idClubDestino, descripcion, 
            montoTraspaso, docAdjuntado, abonado } = req.body;
    
    try {
        const jugador_traspasado = { 
                                        idSocio, idClubDestino, descripcion, 
                                        montoTraspaso, docAdjuntado, abonado 
                                    };

        const club_habilitado = await verificar_club_destino ( idClubDestino );

        if ( club_habilitado === true ) { 
            //SE PUEDE REALIZAR ESE TRASPASO
            const  estado_traspaso = abonado ? estado_pases.pendiente_federacion : estado_pases.pendiente_pago ;

            const nuevo_traspaso = await prisma.$executeRaw`INSERT INTO public.pases_socio(
                                                                            id_club_habilitado, id_socio, 
                                                                            descripcion_traspaso, monto_pase, 
                                                                            doc_adjunto, abonado, estado_pase_socio )
                                                                            VALUES ( ${ idClubDestino }, ${ idSocio },
                                                                                    ${ descripcion }, ${ montoTraspaso },  
                                                                                    ${ docAdjuntado }, ${ abonado }, ${ estado_traspaso });`
                                                
            if ( nuevo_traspaso > 0 ) {
                res.status( 200 ).json({
                    status : true,
                    msg : "Traspaso insertado con exito",
                    jugadorTraspasado : jugador_traspasado
                });
            } else {
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
    } catch (error) {
        console.log ( error );
        res.status( 500 ).json({
            status : false,
            msg : "No se puede realizar el fichaje",
            //jugador_traspasado,
            //error
        });
    }



}



const obtener_pases_pendientes = async ( req = request, res = response ) =>{

    // OBTENGO LOS PASES PENDIENTES QUE DEBEN DE ABONARSE
    try {
        const pases_pendientes = await prisma.$queryRaw`SELECT CAST (A.ID_PASE AS INTEGER ) AS ID_PASE ,CAST ( B.ID_SOCIO AS INTEGER ) AS ID_SOCIO, 
                                                                CONCAT ( C.NOMBRE, ' ', C.APELLIDO ) AS NOMBRE_SOCIO, C.CEDULA,
                                                                A.DESCRIPCION_TRASPASO AS DESCRIPCION, A.MONTO_PASE, A.ABONADO, 
                                                                D.NOMBRE_CLUB_HABILITADO AS NOMBRE_CLUB, A.ESTADO_PASE_SOCIO
                                                            FROM PASES_SOCIO A JOIN CLUBES_HABILITADOS D ON A.ID_CLUB_HABILITADO = D.ID_CLUB_HABILITADO
                                                            JOIN SOCIO B ON A.ID_SOCIO = B.ID_SOCIO
                                                            JOIN PERSONA C ON B.ID_PERSONA = C.ID_PERSONA
                                                        WHERE A.ABONADO = false AND D.ESTA_HABILITADO = true AND A.ESTADO_PASE_SOCIO = ${ estado_pases.pendiente_pago }`;
        
        var pasesPendientes = [];
        
        if ( pases_pendientes.length === 0 ){
            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se registran pagos pendientes de pases',
                    cantidad : pases_pendientes.length,
                    pasesPendientes
                }
            );
        } else {
            pasesPendientes = pases_pendientes.map( ( element ) => {
                const { id_pase, id_socio, nombre_socio, 
                        cedula, descripcion, monto_pase,
                        abonado, estado_pase_socio, nombre_club } = element;
                return {
                    idPase : id_pase,
                    idSocio : id_socio,
                    nombreSocio : nombre_socio,
                    cedula,
                    descripcion,
                    montoPase : monto_pase,
                    abonado,
                    estadoPaseSocio : estado_pase_socio,
                    nombreClub : nombre_club
                }
            } );
            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pases pendientes de pagos',
                    cantidad : pases_pendientes.length,
                    pasesPendientes
                }
            );

        }  
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener la lista de pagos pendientes',
            //error
        } )
        
    }



}


const obtener_pases_completados = async ( req = request, res = response ) =>{

    // OBTENGO LOS PASES ABONADOS Y QUE YA ESTARIAN REALIZADOS
    try {
            const pases_abonados = await prisma.$queryRaw`SELECT CAST (A.ID_PASE AS INTEGER ) AS ID_PASE ,CAST ( B.ID_SOCIO AS INTEGER ) AS ID_SOCIO 
                                                            CONCAT ( C.NOMBRE, ' ', C.APELLIDO ) AS NOMBRE_SOCIO, C.CEDULA,
                                                            A.DESCRIPCION_TRASPASO AS DESCRIPCION, A.MONTO_PASE, A.ABONADO, 
                                                            D.NOMBRE_CLUB_HABILITADO AS NOMBRE_CLUB, A.ESTADO_PASE_SOCIO
                                                        FROM PASES_SOCIO A JOIN CLUBES_HABILITADOS D ON A.ID_CLUB_HABILITADO = D.ID_CLUB_HABILITADO
                                                        JOIN SOCIO B ON A.ID_SOCIO = B.ID_SOCIO
                                                        JOIN PERSONA C ON B.ID_PERSONA = C.ID_PERSONA
                                                    WHERE A.ABONADO = true AND D.ESTA_HABILITADO = true AND A.ESTADO_PASE_SOCIO = ${ estado_pases.realizado }`;
        
        var pasesAbonados = [];
        if ( pases_pendientes.length === 0 ){
            res.status( 200 ).json(

                {
                    status : false,
                    msj : 'No se registran traspasos realizados',
                    cantidad : pases_pendientes.length,
                    pasesAbonados
                }
            );
        } else {

            pasesAbonados = pases_abonados.map( ( element ) =>{
                
                const { id_pase, id_socio, nombre_socio,
                        cedula, descripcion, monto_pase,
                        abonado, estado_pase_socio, nombre_club } = element;
                
                return  {
                    idPase : id_pase,
                    idSocio : id_socio,
                    nombreSocio : nombre_socio,
                    cedula,
                    descripcion,
                    montoPase : monto_pase,
                    abonado,
                    estadoPaseSocio : estado_pase_socio,
                    nombreClub : nombre_club
                };
            } );

            res.status( 200 ).json(

                {
                    status : true,
                    msj : 'Pases pendientes de pagos',
                    cantidad : pases_pendientes.length,
                    pasesAbonados
                }
            );

        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener la lista de pagados',
            //error
        } );
        
    }


}


const abonar_pase_jugador = async ( req = request, res = response ) =>{

    const { id_pase } = req.params;
    const { montoAbonado, descripcionNueva, 
            idClubNuevo, docAdjuntado } = req.body 
    const idPaseEditar = id_pase;
    try {
        const club_habilitado = await verificar_club_destino ( idClubNuevo );

        if ( club_habilitado === true ) {
            // SE PROCEDE CON LA ACTUALIZACION NORMAL
            // SI SOLO PAGO POR EL MONTO DEL FICHAJE Y NO BRINDO LOS DOCUMENTOS NECESARIOS
            let registro_actualizado = {};
            if ( docAdjuntado === false ) { 
                registro_actualizado = await prisma.pases_socio.update ( {
                                                                            where : {
                                                                                id_pase : idPaseEditar
                                                                            },
                                                                            data : {
                                                                                abonado : montoAbonado,
                                                                                descripcion_traspaso : descripcionNueva,
                                                                                id_club_habilitado : idClubNuevo,
                                                                            }
                                                                        });
        
            } else if ( montoAbonado === 0 ){
                // SI BRINDO LOS DOCUMENTOS PERO NO ABONO
                registro_actualizado = await prisma.pases_socio.update ( {
                                                                            where : {
                                                                                id_pase : idPaseEditar
                                                                            },
                                                                            data : {
                                                                                doc_adjunto : docAdjuntado,
                                                                                descripcion_traspaso : descripcionNueva,
                                                                                id_club_habilitado : idClubNuevo,
                                                                            }
                                                                        });
            } else {
                //SI BRINDO AMBOS
                registro_actualizado = await prisma.pases_socio.update ( {
                                                                            where : {
                                                                                id_pase : idPaseEditar
                                                                            },
                                                                            data : {
                                                                                doc_adjunto : docAdjuntado,
                                                                                monto_pase : montoAbonado,
                                                                                descripcion_traspaso : descripcionNueva,
                                                                                id_club_habilitado : idClubNuevo,
                                                                            }
                                                                        });
            }
            console.log( registro_actualizado );
            //const {  } = registro_actualizado;
            res.status( 200 ).json({
                status : true,
                msg : "Fichaje Actualizado",
                registroActualizado : registro_actualizado
            });  
        
        } else {
            // NO SE PUEDE REALIZAR ESE TRASPASO
            res.status( 200 ).json({
                status : false,
                msg : "No se puede actualizar el fichaje debido a que el club no esta habilitado",
            });  
        }
    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            status : false,
            msg : "No se pudo actualizar el fichaje ",
            //error
        });  
    }

}

const obtener_clubes_disponibles = async ( req = request, res = response ) =>{

    
    try {

        const clubes_disponibles = await prisma.clubes_habilitados.findMany( { where : { esta_habilitado : true } } );

        const clubesDisponibles = clubes_disponibles.map( ( element ) =>{
            const { creadoen, esta_habilitado, nombre_club_habilitado, id_club_habilitado } = element;
            return {
                creadoEn : creadoen,
                nombreClub : nombre_club_habilitado,
                idClubHabilidado : id_club_habilitado,
            }
        
        } );
        res.status( 200 ).json({
            status : true,
            msg : "Clubes Disponibles",
            clubesDisponibles
        });  
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            status : false,
            msg : "No se pudo obtener la lista de clubes disponibles",
            //error
        });  
    }

}



const obtener_todos_los_clubes = async ( req = request, res = response ) =>{

    
    try {

        const clubes_disponibles = await prisma.clubes_habilitados.findMany( );

        const clubesDisponibles = clubes_disponibles.map( ( element ) =>{
            const { creadoen, esta_habilitado, nombre_club_habilitado, id_club_habilitado } = element;
            return {
                creadoEn : creadoen,
                nombreClub : nombre_club_habilitado,
                idClubHabilidado : id_club_habilitado,
            }
        
        } );
        res.status( 200 ).json({
            status : true,
            msg : "todos los Clubes",
            clubesDisponibles
        });  
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            status : false,
            msg : "No se pudo obtener la lista de clubes ",
            //error
        });  
    }

}

const eliminar_club_habilitado = async ( req = request, res = response )=>{

    try {
        
        const { id_club } = req.params;
        const club_deshabilitado  = await prisma.clubes_habilitados.update( { 
                                                                                where : { id_club_habilitado : id_club },
                                                                                data : { esta_habilitado : false }
                                                                            
                                                                            } );

        const { nombre_club_habilitado, id_club_habilitado } = club_deshabilitado;

        if ( club_deshabilitado === null || club_deshabilitado === undefined ) {
            res.status( 400 ).json({
                status : true,
                msg : "No se pudo eliminar el club solicitado",
                clubDeshabilitado : {
                    //nombreClubHabilitado : nombre_club_habilitado,
                    idClubHabilitado : id_club
                }
                //error
            });    
            
        } else {
            res.status( 200 ).json({
                status : true,
                msg : "Club eliminado",
                clubDeshabilitado : {
                    nombreClubHabilitado : nombre_club_habilitado,
                    idClubHabilitado : id_club_habilitado
                }
                //error
            });    
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            status : false,
            msg : "No se pudo eliminar al club",
            //error
        });
    }

}





module.exports = {
    abonar_pase_jugador,
    generar_pase_jugador,
    obtener_pases_completados,
    obtener_pases_pendientes,
    obtener_clubes_disponibles,
    obtener_todos_los_clubes,
    eliminar_club_habilitado
}