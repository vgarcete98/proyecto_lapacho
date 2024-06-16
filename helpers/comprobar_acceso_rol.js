
const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();
const { decode } = require('jsonwebtoken');

const ADMINISTRADOR = [

    '/socio',
    '/socio/socios_detalle',
    '/socio/borrar_socio',
    '/socio/editar_socio',
    '/socio/crear_socio',
    '/socio/obtener_socios',
    '/socio/obtener_socio',
    '/socio/obtener_tipo_socios',

    '/tipo_socio',
    
    '/eventos',
    
    '/inscripciones',

    '/reserva_en_club/obtener_mesas_disponibles',
    '/reserva_en_club/obtener_reservas_club',
    '/reserva_en_club/crear_reserva_club',
    '/reserva_en_club/borrar_reserva_club',
    '/reserva_en_club/editar_reserva_club',
    '/reserva_en_club/obtener_mesas_disponibles_x_horario',

    '/pagos_socio',
    '/pagos_socio/socio/pagar_cuota',
    '/pagos_socio/socio/anular_pago/',
    '/pagos_socio/socio/pagar_cuota_varias',
    '/tipo_cuotas',
    
    '/calendario_eventos',
    '/calendario_eventos/eventos_mes',
    '/calendario_eventos/eventos_annio',
    '/calendario_eventos/inscripciones_evento',
    '/calendario_eventos/crear_nuevo_evento',
    '/calendario_eventos/actualizar_evento',
    '/calendario_eventos/eliminar_evento',
    '/calendario_eventos/obtener_tipos_evento',
    '/calendario_eventos/eventos_mes_todos',
    
    '/pases_jugadores',
    
    '/profesores',
    
    '/agendamiento_clases',
    '/agendamiento_clases/agendar_clase',
    '/agendamiento_clases/editar_clase',
    '/agendamiento_clases/cancelar_clase',
    '/agendamiento_clases/pagar_x_clase',
    '/agendamiento_clases/obtener_clases_x_fecha',
    '/agendamiento_clases/obtener_clases_x_fecha_socio',
    '/agendamiento_clases/obtener_clases_x_fecha_profesor',
    '/agendamiento_clases/obtener_mesas_disponibles_x_horario',

    '/ingresos',
    '/ingresos/obtener_grafico_ingresos',
    '/ingresos/obtener_grafico_ingresos_torta',
    '/ingresos/reportes_ingresos_excel',
    '/ingresos/tipos_ingreso',
    '/ingresos/agregar_ingreso',
    '/ingresos/borrar_ingreso',
    '/ingresos/actualizar_ingreso',

    '/egresos',
    '/egresos/obtener_datos_grafico',
    '/egresos/obtener_datos_grafico_torta',    
    '/egresos/reportes_egresos_excel',
    '/egresos/tipos_egreso',
    '/egresos/agregar_gasto',
    '/egresos/eliminar_egreso',
    '/egresos/actualizar_egreso',


    '/cuotas_club',
    '/cuotas_club/cuota_socio',
    '/cuotas_club/cuotas_reporte',
    '/cuotas_club/cuotas_pendientes_mes',

]

const SOCIO = [

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

const PROFESOR = [

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
                    if ( ADMINISTRADOR.find( ( element) => element === path ) ){
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
                    if ( SOCIO.find( ( element) => element === path ) ){
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
                    if ( PROFESOR.find( ( element) => element === path ) ){
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



module.exports = { comprobar_acceso_rol };
