const Router = require( 'express' );
const { request, response } = require('express')

const { withOptimize } = require("@prisma/extension-optimize");
const { PrismaClient } = require('@prisma/client');
const { obtener_cantidad_registros_query } = require('../helpers/obtener_cant_registros_query');
const { subir_imagen } = require('../models/subir_imagen_cloud');


//ESTO ES LO QUE HAY QUE AÑADIR A MEDIDA QUE REALIZAMOS LAS PRUEBAS
//PARA PRUEBAS
//-----------------------------------------------------------------------------------------------------
//const prisma = new PrismaClient().$extends(withOptimize( { apiKey: process.env.OPTIMIZE_API_KEY } ));
//-----------------------------------------------------------------------------------------------------
const prisma = new PrismaClient();


const estados_socio = {

    activo : { descripcion :'ACTIVO', id_estado : 1 },
    suspendido : { descripcion :'SUSPENDIDO', id_estado : 2 },
    eliminado : { descripcion :'ELIMINADO', id_estado : 3 }

}
const obtener_socios_detallados_test = async ( req = request, res = response ) => {

    // OBTIENE LOS SOCIOS DETALLADOS ACTIVOS DEL CLUB
    try {

        const { cantidad, omitir, nombre, estado_socio } = req.query;


        const query = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS "nombreSocio", 
                                --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
                                A.CEDULA AS "cedula",
                                A.CORREO_ELECTRONICO AS "correoElectronico", 
                                A.DIRECCION AS "direccion",
                                A.ID_CLIENTE AS "idCliente", 
                                A.RUC AS "ruc" ,
                                A.CREADOEN AS "creadoEn", 
                                --A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio",
                                (COUNT(*) OVER() ) :: integer AS total
                            FROM CLIENTE A LEFT  JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        WHERE (A.ESTADO_USUARIO IN ( '${ estados_socio.activo.descripcion }',  '${ estados_socio.suspendido.descripcion }', '${ estados_socio.eliminado.descripcion }') || A.ESTADO_USUARIO IS NULL )
                        ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }
                        ${ ( isNaN(cantidad) ) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( isNaN(omitir) ) ? `` : `OFFSET ${ (Number(omitir) > 1 ) ? Number(omitir)*10: 0 }` }`
        console.log( query )
        let sociosFormateados = await prisma.$queryRawUnsafe( query ); 


        if ( sociosFormateados.length === 0 ){

            res.status(200).json({
                status: true,
                msg: 'No hay Socios del club para mostrar',
                data : []
            }); 

        }else {

            //                                    --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
            //                                    A.CEDULA AS "cedula",
            //                                    A.CORREO_ELECTRONICO AS "correoElectronico", 
            //                                    A.DIRECCION AS "direccion",
            //                                    A.ID_CLIENTE AS "idCliente", 
            //                                    A.RUC AS "ruc" ,
            //                                    A.CREADOEN AS "creadoEn", 
            //                                    --A.PASSWORD AS "contrasea",
            //                                    A.NOMBRE_USUARIO AS "nombreUsuario",
            //                                    A.FECHA_NACIMIENTO AS "fechaNacimiento",
            //                                    CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
            //                                    C.DESC_TIPO_SOCIO AS "descTipoSocio", 
            //                                    A.NUMERO_TELEFONO AS "numeroTelefono",
            //                                    A.ESTADO_USUARIO AS "estadoSocio" 
            //                                FROM CLIENTE A LEFT  JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
            //                            WHERE (A.ESTADO_USUARIO IN ( '${ estados_socio.activo.descripcion }',  '${ estados_socio.suspendido.descripcion }', '${ estados_socio.eliminado.descripcion }') || A.ESTADO_USUARIO IS NULL )
            //                            ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }`

            res.status(200).json({
                status: true,
                msg: 'Socios del club',
                //cantidad,
                sociosFormateados
            });     
        }
        
        
    } catch (error) {
        
        res.status( 500 ).json( {
           status : false,
           msg : `No se pudo obtener el detalle de los socios ${ error } `,
           //error 
        });
        
    }



}



const obtener_socios_detallados_test2 = async ( req = request, res = response ) => {

    // OBTIENE LOS SOCIOS DETALLADOS ACTIVOS DEL CLUB
    try {

        const { cantidad, omitir, nombre, estado_socio } = req.query;


        const query = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS "nombreSocio", 
                                --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
                                A.CEDULA AS "cedula",
                                A.CORREO_ELECTRONICO AS "correoElectronico", 
                                A.DIRECCION AS "direccion",
                                A.ID_CLIENTE AS "idCliente", 
                                A.RUC AS "ruc" ,
                                A.CREADOEN AS "creadoEn", 
                                --A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio" 
                            FROM CLIENTE A LEFT  JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        WHERE (A.ESTADO_USUARIO IN ( '${ estados_socio.activo.descripcion }',  '${ estados_socio.suspendido.descripcion }', '${ estados_socio.eliminado.descripcion }') || A.ESTADO_USUARIO IS NULL )
                        ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }`
        console.log( query )
        let sociosFormateados = await prisma.$queryRawUnsafe( query ); 


        if ( sociosFormateados.length === 0 ){

            res.status(200).json({
                status: true,
                msg: 'No hay Socios del club para mostrar',
                data : []
            }); 

        }else {
            const total_registros_query = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS "nombreSocio", 
                                                --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
                                                A.CEDULA AS "cedula",
                                                A.CORREO_ELECTRONICO AS "correoElectronico", 
                                                A.DIRECCION AS "direccion",
                                                A.ID_CLIENTE AS "idCliente", 
                                                A.RUC AS "ruc" ,
                                                A.CREADOEN AS "creadoEn", 
                                                --A.PASSWORD AS "contrasea",
                                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                                A.ESTADO_USUARIO AS "estadoSocio" 
                                            FROM CLIENTE A LEFT  JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                                        WHERE (A.ESTADO_USUARIO IN ( '${ estados_socio.activo.descripcion }',  '${ estados_socio.suspendido.descripcion }', '${ estados_socio.eliminado.descripcion }') || A.ESTADO_USUARIO IS NULL )
                                        ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }`
            const cantidad = await obtener_cantidad_registros_query(total_registros_query);
            res.status(200).json({
                status: true,
                msg: 'Socios del club',
                cantidad,
                sociosFormateados
            });     
        }
        
        
    } catch (error) {
        
        res.status( 500 ).json( {
           status : false,
           msg : `No se pudo obtener el detalle de los socios ${ error } `,
           //error 
        });
        
    }



}

const obtener_socios_detallados_test3 = async ( req = request, res = response ) => {

    // OBTIENE LOS SOCIOS DETALLADOS ACTIVOS DEL CLUB
    try {

        const { cantidad, omitir, nombre, estado_socio } = req.query;


        const query = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS "nombreSocio", 
                                --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
                                A.CEDULA AS "cedula",
                                A.CORREO_ELECTRONICO AS "correoElectronico", 
                                A.DIRECCION AS "direccion",
                                A.ID_CLIENTE AS "idCliente", 
                                A.RUC AS "ruc" ,
                                A.CREADOEN AS "creadoEn", 
                                --A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio",
                                (COUNT(*) OVER() ) :: integer AS total
                            FROM CLIENTE A LEFT  JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        WHERE (A.ESTADO_USUARIO IN ( '${ estados_socio.activo.descripcion }',  '${ estados_socio.suspendido.descripcion }', '${ estados_socio.eliminado.descripcion }') || A.ESTADO_USUARIO IS NULL )
                        ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }`
        console.log( query )
        let sociosFormateados = await prisma.$queryRawUnsafe( query ); 


        if ( sociosFormateados.length === 0 ){

            res.status(200).json({
                status: true,
                msg: 'No hay Socios del club para mostrar',
                data : []
            }); 

        }else {

            res.status(200).json({
                status: true,
                msg: 'Socios del club',
                //cantidad,
                sociosFormateados
            });     
        }
        
        
    } catch (error) {
        
        res.status( 500 ).json( {
           status : false,
           msg : `No se pudo obtener el detalle de los socios ${ error } `,
           //error 
        });
        
    }



}

const router_test = Router();


//ESTO ES TODO CON PAGINACION NAMBRENA LUEGO
router_test.get( '/socios_detalle',[ ], obtener_socios_detallados_test );


router_test.post( '/subir_imagen', [], async (  req = request, res = response ) => {
                                            
                                            console.log( req.files )
                                            const { archivo } = req.files;
                                            const resultado = await subir_imagen( archivo.tempFilePath  );
                                            console.log( resultado )
                                            res.status(200).json({
                                                status: true,
                                                msg: 'Subida de imagen'
                                            });   
                                        } 
                ) 

//ESTO ES SIN PAGINACION NAMBRENA LUEGO
router_test.get( '/socios_detalle_sin_paginacion',[ ], obtener_socios_detallados_test2 );

//ESTO ES SIN PAGINACION Y SIN SU CORRECTA PAGINACION NAMBRENA LUEGO
router_test.get( '/socios_detalle_sin_paginacion/sin_cantidad',[ ], obtener_socios_detallados_test3 );

module.exports = { router_test };