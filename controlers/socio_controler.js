const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient()



const estados_socio = {

    activo : { descripcion :'ACTIVO', id_estado : 1 },
    suspendido : { descripcion :'SUSPENDIDO', id_estado : 2 },
    eliminado : { descripcion :'ELIMINADO', id_estado : 3 }

}


const crear_socio = async ( req = request, res = response ) => {


    try {
        //console.log ( req.body)
        const { nombre, apellido, fechaNacimiento, cedula, estadoSocio,
                correo, numeroTel, direccion, ruc, tipoSocio,
                contraseña, nombreUsuario, idAcceso } = req.body;
        
        //convertir la fecha de nacimiento a fecha
        const fecha_db = generar_fecha( fechaNacimiento);
        //console.log( fecha_db );
        
        //OBTENER EL SOCIO INSERTADO
        //------------------------------------------------------------------------------------------
        const fecha_creacion_socio = new Date();
        const nuevo_socio = await prisma.cliente.create( { 
                                                            data : {
                                                                nombre : nombre,
                                                                apellido : apellido,
                                                                cedula : cedula,
                                                                fecha_nacimiento : fecha_db,
                                                                id_tipo_socio : tipoSocio,
                                                                correo_electronico : correo,
                                                                numero_telefono : numeroTel,
                                                                direccion : direccion,
                                                                ruc : ruc,
                                                                nombre_cmp : `${ nombre } ${ apellido }`,
                                                                creadoen : fecha_creacion_socio,
                                                                estado_socio : estados_socio.activo.id_estado,
                                                                contrasea : contraseña,
                                                                nombre_usuario : nombreUsuario,
                                                                id_rol_usuario : idAcceso,
                                                                tipo_usuario : ''

                                                            } 
                                                    
                                                    } );
        const { id_cliente, nombre_cmp, correo_electronico, creadoen, estado_socio  } = nuevo_socio;
        const direccion_socio = nuevo_socio.direccion;
        res.status( 200 ).json(
            {

                status : true,
                msj : 'Socio Creado',
                socio : {
                    idCliente : id_cliente,
                    tipoSocio,
                    //nombreCmp : nombre_cmp,
                    numeroTel,
                    nombre,
                    apellido,
                    fechaNacimiento,
                    cedula,
                    //correoElectronico : correo_electronico, 
                    creadoEn : creadoen,
                    nombreUsuario,
                    contraseña, 
                    estadoSocio : estado_socio,
                    direccionSocio : direccion_socio
                }
            }
        );   

    } catch ( error ) {
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : 'No se puede crear al socio solicitado',
                //error
            }

        );

    }

}



const actualizar_socio = async ( req = request, res = response ) => {


    try {
        const { nombre, apellido, fechaNacimiento, cedula, estadoSocio, nroCedula,
            correo, numeroTel, direccion, ruc, tipoSocio,
            contraseña, nombreUsuario, idAcceso, idCliente } = req.body;
        const rucNuevo = ruc ;
        //------------------------------------------------------------------------------------------
        const fecha_socio_actualizado = new Date();
        const socio_actualizado = await prisma.cliente.update( { 
                                                                where : {  id_cliente : Number ( idCliente )  },
                                                                data : {
                                                                    nombre : nombre,
                                                                    apellido : apellido,
                                                                    direccion : direccion,
                                                                    fecha_nacimiento : generar_fecha( fechaNacimiento ),
                                                                    cedula : nroCedula,
                                                                    editadoen : fecha_socio_actualizado,
                                                                    correo_electronico : correo,
                                                                    id_rol_usuario : idAcceso,
                                                                    contrasea : contraseña,
                                                                    nombre_usuario : nombreUsuario,
                                                                    ruc : rucNuevo,
                                                                    tipo_socio : tipoSocio,
                                                                    numero_telefono : numeroTel,
                                                                    estado_socio : estadoSocio,
                                                                    direccion : direccion
                                                                }
                                                            } );
        //console.log( socio_actualizado );
        const { editadoen, correo_electronico, telefono, estado_socio, nombre_cmp } = socio_actualizado;
        res.status( 200 ).json({
            status : true,
            msj : 'Socio Actualizado con exito',
            socio : {
                idSocio : idSocioConvert,
                tipoSocio,
                //nombreCmp : nombre_cmp,
                numeroTel,
                nombre,
                apellido,
                fechaNacimiento,
                cedula,
                //correoElectronico : correo_electronico, 
                creadoEn : creadoen,
                nombreUsuario,
                contraseña, 
                estadoSocio : estado_socio,
                direccionSocio : direccion_socio
            }

        });        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo actualizar al Socio  ${ error }`,
            //error
        } );
    }


}



const borrar_socio = async ( req = request, res = response ) => {

    // SE IMPLEMENTA EL BORRADO DEL SOCIO ACTUALIZANDO NADA MAS CIERTOS CAMPOS DE LA TABLA
    
    try {
        const { idCliente } = req.body;

        //----------------------------------------------------------------------------
        const fecha_edicion = new Date();
        const socio_actualizado = await prisma.cliente.update( { 
                                                                data : {
                                                                    estado_socio : estados_socio.eliminado.id_estado,
                                                                    editadoen : fecha_edicion
                                                                },
                                                                where : { id_cliente : Number(idCliente) }
                                                            } );
        const { editadoen, direccion, correo_electronico, 
                numero_telefono, estado_socio, ruc,
                nombre_cmp, id_cliente, id_tipo_socio, nombre_usuario, contrasea } = socio_actualizado;

        const [ nombre, apellido ] = nombre_cmp.split( ' ' );
       

        res.status( 200 ).json(
            {

                status : true,
                msj : 'Socio Borrado',
                socioBorrado : {
                    idCliente : id_cliente,
                    tipoSocio : tipoSocioConvert,
                    //nombreCmp : nombre_cmp,
                    numeroTel : numero_telefono,
                    nombre,
                    apellido,
                    fechaNacimiento : fecha_nacimiento,
                    cedula : cedula_convert,
                    //correoElectronico : correo_electronico, 
                    //creadoEn : creadoen,
                    nombreUsuario : nombre_usuario,
                    contraseña : contrasea, 
                    estadoSocio : estado_socio,
                    direccionSocio : direccion
                }

            }

        );        
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json(

            {

                status : false,
                msj : `No se logro borrar al socio  ${ error }`,
                //error

            }

        );
    }




}




const obtener_socios = async ( req = request, res = response ) => {
    

    //SE OBTIENEN TODOS LOS SOCIOS DEL CLUB YA SEA ACTIVOS, ELIMINADOS, SUSPENDIDOS
    try {

        const { cantidad, omitir, nombre } = req.query;

        let socios;
        //console.log( cantidad, omitir, nombre, apellido )
        const query = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocioCmp, 
                            A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO, A.CEDULA,
                            B.CORREO_ELECTRONICO AS CORREO, B.DIRECCION AS DIRECCION,
                            CAST ( B.ID_SOCIO AS INTEGER ) AS idSocio, B.RUC AS RUC,
                            B.CREADOEN, B.CONTRASEA, B.NOMBRE_USUARIO AS USUARIO,
                            A.FECHA_NACIMIENTO AS FECHA_NACIMIENTO,CAST ( C.ID_TIPO_SOCIO AS INTEGER ) as id_tipo_socio,
                            C.DESC_TIPO_SOCIO AS descTipoSocio, B.NUMERO_TELEFONO AS numeroTel 
                            /*B.ESTADO_SOCIO AS estadoSocio*/
                        FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                        JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                        ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }
                        ${ ( Number(cantidad) === NaN  ||  cantidad === undefined) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( Number(omitir)  === NaN ||  omitir === undefined ) ? `` : `OFFSET ${ Number(omitir) }` }`
        //console.log( query );
        socios = await prisma.$queryRawUnsafe( query );

        if ( socios.length === 0 ){

            res.status(200).json({
                status: true,
                msg: 'No hay Socios del club para mostrar',
                data : socios
            });   

        }else {

            const sociosFormateados = socios.map( ( element ) =>{

                const { nombresocio, cedula, idsocio, nombre, apellido,
                        tipo_socio, numerotel, estadosocio, ruc, creadoen, 
                        contrasea, nombre_usuario,
                        id_tipo_socio, fecha_nacimiento, direccion, correo } = element;
                
                
                return {
                    idSocio : idsocio,
                    contraseña : contrasea,
                    nombreUsuario : nombre_usuario,
                    nombre,
                    apellido,
                    tipoSocio : id_tipo_socio,
                    numeroTel : numerotel,
                    creadoEn : creadoen,
                    cedula,
                    fechaNacimiento :fecha_nacimiento ,
                    direccionSocio : direccion,
                };
              });

            res.status(200).json({
                status: true,
                msg: 'Todos los Socios del club',
                sociosFormateados
            });    
        }
        //console.log ( socios );

 

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json({
            status: false,
            msg: `No se pudo obtener la informacion de los socios del club ${ error }`,
            //data : socios
        });    
    }


}




const obtener_socios_detallados = async ( req = request, res = response ) => {

    // OBTIENE LOS SOCIOS DETALLADOS ACTIVOS DEL CLUB
    try {

        const { cantidad, omitir, nombre, estado_socio } = req.query;


        const query = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS "nombreSocio", 
                                --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
                                A.CEDULA AS "cedula",
                                B.CORREO_ELECTRONICO AS "correoElectronico", 
                                B.DIRECCION AS "direccion",
                                CAST ( B.ID_SOCIO AS INTEGER ) AS "idSocio", 
                                B.RUC AS "ruc" ,
                                B.CREADOEN AS "creadoEn", 
                                B.CONTRASEA AS "contrasea",
                                B.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                B.NUMERO_TELEFONO AS "numeroTelefono",
                                B.ESTADO_SOCIO AS "estadoSocio" 
                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                            JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                        WHERE B.ESTADO_SOCIO = ${ estados_socio.activo.id_estado }
                        ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }
                        ${ ( Number(cantidad) === NaN  ||  cantidad === undefined) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( Number(omitir)  === NaN ||  omitir === undefined ) ? `` : `OFFSET ${ Number(omitir) }` }`


        //const socios_detallados = await prisma.$queryRaw`SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
        //                                                        A.CEDULA,
        //                                                        CAST ( B.ID_SOCIO AS INTEGER ) AS idSocio,
        //                                                        B.NUMERO_TELEFONO AS numeroTelefono, B.ESTADO_SOCIO AS estadoSocio, 
        //                                                        C.DESC_TIPO_SOCIO AS descTipoSocio
        //                                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
        //                                            JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
        //                                        WHERE B.ESTADO_SOCIO = ${ estados_socio.activo.id_estado };`
        //console.log( query )
        let sociosFormateados = await prisma.$queryRawUnsafe( query ); 
        res.status(200).json({
            status: true,
            msg: 'Socios del club',
            cant : sociosFormateados.length,
            sociosFormateados
        });     
        
        
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
           status : false,
           msg : `No se pudo obtener el detalle de los socios ${ error } `,
           //error 
        });
        
    }



}




const obtener_socio_cedula_nombre = async ( req = request, res = response ) =>{

    try {

        const { cantidad, omitir, cedula, estado_socio } = req.query;


        const query = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS "nombreSocio", 
                                --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
                                A.CEDULA AS "cedula",
                                B.CORREO_ELECTRONICO AS "correoElectronico", 
                                B.DIRECCION AS "direccion",
                                CAST ( B.ID_SOCIO AS INTEGER ) AS "idSocio", 
                                B.RUC AS "ruc" ,
                                B.CREADOEN AS "creadoEn", 
                                B.CONTRASEA AS "contrasea",
                                B.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                B.NUMERO_TELEFONO AS "numeroTelefono",
                                B.ESTADO_SOCIO AS "estadoSocio" 
                            FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                            JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                        WHERE B.ESTADO_SOCIO = ${ estados_socio.activo.id_estado }
                        ${ ( cedula !== undefined && cedula !== '' )? `AND A.CEDULA = '${ cedula }'` : `` }
                        ${ ( Number(cantidad) === NaN  ||  cantidad === undefined) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( Number(omitir)  === NaN ||  omitir === undefined ) ? `` : `OFFSET ${ Number(omitir) }` }`



        let sociosFormateados = await prisma.$queryRawUnsafe( query ); 
        res.status(200).json({
            status: true,
            msg: 'Socios del club',
            cant : sociosFormateados.length,
            sociosFormateados
        });     


    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : true,
            msg : `Ha ocurrido un error al buscar al socio ${ error } `,
            //error
        } );
    }




}


const obtener_socio = async ( req = request, res = response ) => {

    //OBTENER EL SOCIO PASANDOLE UN ID

    try {
        const { cantidad, omitir, nombre, apellido, cedula } = req.query;

        let socios;
        //console.log( cantidad, omitir, nombre, apellido )
        const socio = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, 
                            A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO, A.cedula,
                            B.CORREO_ELECTRONICO AS CORREO, B.DIRECCION AS DIRECCION,
                            CAST ( B.ID_SOCIO AS INTEGER ) AS idSocio, B.RUC AS RUC,
                            B.CREADOEN, B.CONTRASEA, B.NOMBRE_USUARIO AS USUARIO,
                            A.FECHA_NACIMIENTO AS FECHA_NACIMIENTO,CAST ( C.ID_TIPO_SOCIO AS INTEGER ) as id_tipo_socio,
                            C.DESC_TIPO_SOCIO AS descTipoSocio, B.NUMERO_TELEFONO AS "numeroTel" 
                            /*B.ESTADO_SOCIO AS estadoSocio*/
                        FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                        JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                        ${ ( nombre !== undefined ) && (apellido === undefined )? `AND A.NOMBRE LIKE '%${nombre}%'` : `` }
                        ${ ( nombre === undefined ) && (apellido !== undefined )? `AND A.APELLIDO LIKE '%${apellido}%'` : `` }
                        ${ ( nombre !== undefined ) && (apellido !== undefined )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre} ${apellido}%'` : `` }
                        ${ ( cedula !== undefined ) && ( cedula !== '' )?  `AND A.cedula = ${ cedula }` : ``}
                        ${ ( Number(cantidad) === NaN  ||  cantidad === undefined) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( Number(omitir)  === NaN ||  omitir === undefined ) ? `` : `OFFSET ${ Number(omitir) }` }`

        //console.log ( socios );
        if ( socio.length === 0 ){

            res.status(200).json({
                status: false,
                msg: 'no existe ese socio en el club',
            });
        }else {

            let sociosFormateados = []; 
            socio.forEach( element => {
                const { nombre_socio, cedula, id_socio, numero_telefono, estado_socio, desc_tipo_socio } = element;
                sociosFormateados.push( {
                    nombreSocio : nombre_socio,
                    cedula,
                    idSocio : id_socio,
                    numeroTel : numero_telefono,
                    estadoSocio : estado_socio,
                    descTipoSocio : desc_tipo_socio
                } );
            });
            res.status(200).json({
                status: true,
                msg: 'Socio del club',
                cant : socio.length,
                sociosFormateados
            });
        }        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            status: false,
            msg: 'No se pudo obtener al socio del club',
        });
    }

  

}












module.exports = { 
                    crear_socio, 
                    actualizar_socio, 
                    obtener_socio, 
                    obtener_socios,
                    obtener_socios_detallados, 
                    borrar_socio,
                    obtener_socio_cedula_nombre 
                };