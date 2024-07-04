
const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();
const { decode } = require('jsonwebtoken');

let ADMINISTRADOR = []

let SOCIO = [

    '/reserva_en_club/obtener_mesas_disponibles',
    '/reserva_en_club/obtener_reservas_club',
    '/reserva_en_club/crear_reserva_club',
    '/reserva_en_club/borrar_reserva_club',
    '/reserva_en_club/editar_reserva_club',


    '/cuotas_club',
    '/cuotas_club/cuota_socio',


    '/agendamiento_clases',
    '/agendamiento_clases/agendar_clase',
    '/agendamiento_clases/editar_clase',
    '/agendamiento_clases/cancelar_clase',
    '/agendamiento_clases/pagar_x_clase',
    '/agendamiento_clases/obtener_clases_x_fecha',
    '/agendamiento_clases/obtener_clases_x_fecha_socio',
    '/agendamiento_clases/obtener_clases_x_fecha_profesor',

    
    '/calendario_eventos',
    '/calendario_eventos/eventos_mes',
    '/calendario_eventos/eventos_annio',


    '/reserva_en_club/obtener_mesas_disponibles',
    '/reserva_en_club/obtener_reservas_club',
    '/reserva_en_club/crear_reserva_club',
    '/reserva_en_club/borrar_reserva_club',
    '/reserva_en_club/editar_reserva_club',
]

let PROFESOR = [

    '/reserva_en_club/obtener_mesas_disponibles',
    '/reserva_en_club/obtener_reservas_club',
    '/reserva_en_club/crear_reserva_club',
    '/reserva_en_club/borrar_reserva_club',
    '/reserva_en_club/editar_reserva_club',


    '/cuotas_club',
    '/cuotas_club/cuota_socio',


    '/agendamiento_clases',
    '/agendamiento_clases/agendar_clase',
    '/agendamiento_clases/editar_clase',
    '/agendamiento_clases/cancelar_clase',
    '/agendamiento_clases/pagar_x_clase',
    '/agendamiento_clases/obtener_clases_x_fecha',
    '/agendamiento_clases/obtener_clases_x_fecha_socio',

    '/calendario_eventos',
    '/calendario_eventos/eventos_mes',
    '/calendario_eventos/eventos_annio',


    '/reserva_en_club/obtener_mesas_disponibles',
    '/reserva_en_club/obtener_reservas_club',
    '/reserva_en_club/crear_reserva_club',
    '/reserva_en_club/borrar_reserva_club',
    '/reserva_en_club/editar_reserva_club',


]


const comprobar_acceso_rol = async ( req = request, res = response, next)=> {

    try {
        //console.log("validacion del rol" )
        if ( req.path === '/auth/login' ){
            next();
        }else{

            const { x_token } = req.headers;

            //console.log( decode( x_token, process.env.SECRET0RPR1VAT3K3Y ) );
            const { id_usuario, tipo_usuario, rol   } = decode( x_token, process.env.SECRET0RPR1VAT3K3Y );

            const { path } = req;
            //console.log( path )
            //console.log( rol )
            switch (rol) {
                case 'ADMINISTRADOR':
                    if ( ADMINISTRADOR.find( ( element) => element.path_ruta === path ) ){
                        next()
                    }else {
                        res.status( 401 ).json( {
                            status : false,
                            msg : `El usuario no posee un rol con acceso al recurso`,
                            //nuevoIngreso
                        } );
                    }
                    
                    break;
            
                case 'SOCIO':
                    if ( SOCIO.find( ( element) => element.path_ruta === path ) ){
                        next()
                    }else {
                        res.status( 401 ).json( {
                            status : false,
                            msg : `El usuario no posee un rol con acceso al recurso`,
                            //nuevoIngreso
                        } );
                    }
                break;


                case 'PROFESOR':
                    if ( PROFESOR.find( ( element) => element.path_ruta === path ) ){
                        next()
                    }else {
                        res.status( 401 ).json( {
                            status : false,
                            msg : `El usuario no posee un rol con acceso al recurso`,
                            //nuevoIngreso
                        } );
                    }
                break;

                default:
                    res.status( 401 ).json( {
                        status : false,
                        msg : `El usuario no posee un rol valido para la solicitud`,
                        //nuevoIngreso
                    } );
                break;
            }

            //next();

        }



    } catch (error) {
        //console.log( error );
        res.status( 401 ).json( {
            status : false,
            msg : `No se pudo verificar el acceso del rol , error : ${error}`,
            //nuevoIngreso
        } );
    }
}



const cargar_rutas_rol = async () =>{


    try {
        

        ADMINISTRADOR = await prisma.$queryRawUnsafe( `SELECT B.PATH_RUTA 
                                                            FROM ACCESOS_USUARIO A JOIN RUTAS_APP B ON A.ID_RUTA_APP = B.ID_RUTA_APP
                                                            JOIN ROLES_USUARIO C ON C.ID_ROL_USUARIO = A.ID_ROL_USUARIO
                                                        WHERE C.ID_ROL_USUARIO = 1`);

        SOCIO = await prisma.$queryRawUnsafe( `SELECT B.PATH_RUTA 
                                                            FROM ACCESOS_USUARIO A JOIN RUTAS_APP B ON A.ID_RUTA_APP = B.ID_RUTA_APP
                                                            JOIN ROLES_USUARIO C ON C.ID_ROL_USUARIO = A.ID_ROL_USUARIO
                                                        WHERE C.ID_ROL_USUARIO = 2` );

        PROFESOR = await prisma.$queryRawUnsafe( `SELECT B.PATH_RUTA 
                                                                        FROM ACCESOS_USUARIO A JOIN RUTAS_APP B ON A.ID_RUTA_APP = B.ID_RUTA_APP
                                                                        JOIN ROLES_USUARIO C ON C.ID_ROL_USUARIO = A.ID_ROL_USUARIO
                                                                    WHERE C.ID_ROL_USUARIO = 3` );
        //console.log( ADMINISTRADOR)
    } catch (error) {
        console.log ( 'No se lograron cargar los accesos de los roles : ' )
        console.log( error );
    }


}






module.exports = { 
                    comprobar_acceso_rol,
                    cargar_rutas_rol
                };
