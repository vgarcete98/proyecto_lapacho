
const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();
const { decode } = require('jsonwebtoken');

const ADMINISTRADOR = [
    '/usuario',

    '/socio',
    
    '/tipo_socio',
    
    '/eventos',
    
    '/inscripciones',
    
    '/gastos_club',
    
    '/roles',
    
    '/tipo_reserva',
    
    '/accesos',
    '/accesos/obtener_modulos',
    '/accesos/editar_modulos',
    '/accesos/crear_modulos',

    '/reserva_en_club',
    
    '/pagos_socio',
    
    '/tipo_cuotas',
    
    '/calendario_eventos',
    
    '/pases_jugadores',
    
    '/profesores',
    
    '/agendamiento_clases',
    
    '/ingresos',
    
    '/egresos',
    
    '/cuotas_club',
]

const SOCIO = []

const PROFESOR = []


const comprobar_acceso_rol = async ( req = request, res = response, next)=> {

    try {
        if ( req.path === '/auth/login' ){
            next();
        }else{

            const { x_token } = req.headers;
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
