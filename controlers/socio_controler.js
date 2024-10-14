const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');


const { encriptar_password } = require( '../helpers/generar_encriptado' );
const { sendMail } = require('../helpers/node_mailer_config');
const { comprobar_existe_cliente } = require('../helpers/comprobar_existe_cliente');
const prisma = new PrismaClient()



const estados_socio = {

    activo : { descripcion :'ACTIVO', id_estado : 1 },
    suspendido : { descripcion :'SUSPENDIDO', id_estado : 2 },
    eliminado : { descripcion :'ELIMINADO', id_estado : 3 }

}







const crear_socio = async ( req = request, res = response ) => {


    try {

        const { nombre, apellido, fechaNacimiento, cedula, estadoSocio,
                correo, numeroTel, direccion, ruc, tipoSocio,
                contraseña, nombreUsuario, idAcceso, dependientes } = req.body;
        
        //OBTENER EL SOCIO INSERTADO
        //------------------------------------------------------------------------------------------
        let nuevo_socio = {};
        let nuevos_socios = [];
        const cantidad_a_insertar = 1 + dependientes.length;

        try {
            nuevo_socio = await prisma.cliente.upsert( { 
                                                            where : { cedula : cedula, es_socio : false },
                                                            update : { nombre : nombre,
                                                                        apellido : apellido,
                                                                        fecha_nacimiento : generar_fecha( fechaNacimiento),
                                                                        id_tipo_socio : tipoSocio,
                                                                        correo_electronico : correo,
                                                                        numero_telefono : numeroTel,
                                                                        direccion : direccion,
                                                                        ruc : ruc,
                                                                        nombre_cmp : `${ nombre } ${ apellido }`,
                                                                        creadoen : new Date(),
                                                                        estado_usuario : estados_socio.activo.descripcion,
                                                                        password : contraseña,//encriptar_password(contraseña),
                                                                        nombre_usuario : nombreUsuario,
                                                                        id_rol_usuario : idAcceso,
                                                                        tipo_usuario : '',
                                                                        es_socio : true },
                                                            create : { 
                                                                nombre : nombre,
                                                                apellido : apellido,
                                                                cedula : cedula,
                                                                fecha_nacimiento : generar_fecha( fechaNacimiento),
                                                                id_tipo_socio : tipoSocio,
                                                                correo_electronico : correo,
                                                                numero_telefono : numeroTel,
                                                                direccion : direccion,
                                                                ruc : ruc,
                                                                nombre_cmp : `${ nombre } ${ apellido }`,
                                                                creadoen : new Date(),
                                                                estado_socio : estados_socio.activo.descripcion,
                                                                password : contraseña,//encriptar_password(contraseña),
                                                                nombre_usuario : nombreUsuario,
                                                                id_rol_usuario : idAcceso,
                                                                tipo_usuario : '',
                                                                es_socio : true
                                                            }
                                                    } );
            if ( nuevo_socio.correo_electronico != "" ){
                //console.log( correo_electronico )
                const cuerpo_mail = ` usuario : ${ nombreUsuario }, contraseña : ${ contraseña } `;
                sendMail( nuevo_socio.correo_electronico, cuerpo_mail );
            }
            nuevos_socios.push( { nombre, apellido } );
            
        } catch (error3) {
            console.log( `ocurrio un error al insertar el primer socio ${ error3}` )
            
        }

        const idClienteTitular = nuevo_socio.id_cliente;
        //console.log( dependientes );
        if (dependientes.length !== 0 && dependientes !== undefined && dependientes !== null) {
            let dependiente = {};
            try {
                for (let element in dependientes ) {
    
                    dependiente = await prisma.cliente.upsert( {
                                                                    where : { cedula : cedula, es_socio : false },
                                                                    update : {
                                                                        nombre : dependientes[element].nombre,
                                                                        apellido : dependientes[element].apellido,
                                                                        //cedula : dependientes[element].cedula,
                                                                        fecha_nacimiento : generar_fecha( dependientes[element].fechaNacimiento),
                                                                        id_tipo_socio : dependientes[element].tipoSocio,
                                                                        correo_electronico : dependientes[element].correo,
                                                                        numero_telefono : dependientes[element].numeroTel,
                                                                        direccion : dependientes[element].direccion,
                                                                        ruc : dependientes[element].ruc,
                                                                        nombre_cmp : `${ dependientes[element].nombre } ${ dependientes[element].apellido }`,
                                                                        creadoen : new Date (),
                                                                        estado_socio : estados_socio.activo.descripcion,
                                                                        password : dependientes[element].contraseña,//encriptar_password(dependientes[element].contraseña),
                                                                        nombre_usuario : dependientes[element].nombreUsuario,
                                                                        id_rol_usuario : dependientes[element].idAcceso,
                                                                        tipo_usuario : '',
                                                                        parent_id_cliente : idClienteTitular,
                                                                        es_socio : true
                                                                    },
                                                                    create : { 
                                                                        nombre : dependientes[element].nombre,
                                                                        apellido : dependientes[element].apellido,
                                                                        cedula : dependientes[element].cedula,
                                                                        fecha_nacimiento : generar_fecha( dependientes[element].fechaNacimiento),
                                                                        id_tipo_socio : dependientes[element].tipoSocio,
                                                                        correo_electronico : dependientes[element].correo,
                                                                        numero_telefono : dependientes[element].numeroTel,
                                                                        direccion : dependientes[element].direccion,
                                                                        ruc : dependientes[element].ruc,
                                                                        nombre_cmp : `${ dependientes[element].nombre } ${ dependientes[element].apellido }`,
                                                                        creadoen : new Date (),
                                                                        estado_socio : estados_socio.activo.descripcion,
                                                                        password : dependientes[element].contraseña, //encriptar_password(dependientes[element].contraseña),
                                                                        nombre_usuario : dependientes[element].nombreUsuario,
                                                                        id_rol_usuario : dependientes[element].idAcceso,
                                                                        tipo_usuario : '',
                                                                        parent_id_cliente : idClienteTitular,
                                                                        es_socio : true,  
                                                                    }
                                                            } );

                    if ( dependientes[element].correo_electronico != "" &&  dependientes[element].correo_electronico !== undefined){
                    
                        const cuerpo_mail = ` usuario : ${ nombreUsuario }, contraseña : ${ contraseña } `;
                        sendMail( dependientes[element].correo_electronico, cuerpo_mail );
                    }
                    nuevos_socios.push( { nombre : dependientes[element].nombre, apellido : dependientes[element].apellido } );
                                            
                }
                
            } catch (error2) {
                console.log( `ocurrio un error al querer insertar el socio dependiente ${ error2 }` );
            }

        }


        if ( nuevos_socios.length > 0 && cantidad_a_insertar ===  nuevos_socios.length){

            res.status( 200 ).json(
                {
    
                    status : true,
                    msj : 'Socio Creado',
                    descripcion : `${ ( dependientes.length === 0 ) ? `Socio Creado con exito ${nombre}, ${apellido}` : `Socios creados con exito ${nombre}, ${apellido}, ${ dependientes.reduce( (acumulador, element)=> ` ${element.nombre}, ${element.apellido} ` ) }` }, insertados : ${ nuevos_socios.length } socios`
                }
            );   
        }else {
            res.status( 400 ).json(
                {
    
                    status : true,
                    msj : 'No se lograron crear todos los socios que se adjunto',
                    descripcion : `${ ( dependientes.length === 0 ) ? `Socio Creado con exito ${nombre}, ${apellido}` : `Socios creados con exito ${nombre}, ${apellido}, ${ dependientes.reduce( (acumulador, element)=> ` ${element.nombre}, ${element.apellido} ` ) }` }, insertados : ${ nuevos_socios.length } socios`
                }
            ); 
        }

    } catch ( error ) {
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : `No se puede crear al socio solicitado ${error}`,
                //error
            }

        );

    }

}



const actualizar_socio = async ( req = request, res = response ) => {


    try {
        const { nombre, apellido, fechaNacimiento, cedula, estadoSocio, nroCedula,
            correo, numeroTel, direccion, ruc, tipoSocio,
            contraseña, nombreUsuario, idAcceso, idCliente, dependientes } = req.body;
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
                                                                    password : encriptar_password (contraseña),
                                                                    nombre_usuario : nombreUsuario,
                                                                    ruc : rucNuevo,
                                                                    //tipo_socio : tipoSocio,
                                                                    numero_telefono : numeroTel,
                                                                    estado_socio : estadoSocio,
                                                                    direccion : direccion
                                                                }
                                                            } );
        //console.log( socio_actualizado );

        if ( correo_electronico !== "" && correo_electronico !== undefined ){
            //console.log( correo_electronico )
            const cuerpo_mail = ` usuario : ${ nombreUsuario }, contraseña : ${ contraseña } `;
            sendMail( correo_electronico, cuerpo_mail );
        }
        //DEBERIAMOS PODER ACTUA
        let sociosDependientes = [];

        if (dependientes.length !== 0 && dependientes !== undefined && dependientes !== null) {
            let clienteTitular = idCliente;
            let dependiente;
            for (let element in dependientes ) {
                
                //VALIDO SI ES QUE NO EXISTE ESE CLIENTE ENTONCES LO CREO, SINO SIMPLEMENTE LO ACTUALIZO
                const cliente_dependiente = await prisma.cliente.findFirst( { where : { cedula : dependientes[element].cedula } } );
                fecha_db = generar_fecha( dependientes[element].fechaNacimiento);
                if ( cliente_dependiente === null || cliente_dependiente === undefined ) {
                        dependiente = await prisma.cliente.create(  { 
                                                                        data : {
                                                                            nombre : dependientes[element].nombre,
                                                                            apellido : dependientes[element].apellido,
                                                                            cedula : dependientes[element].cedula,
                                                                            fecha_nacimiento : fecha_db,
                                                                            id_tipo_socio : dependientes[element].tipoSocio,
                                                                            correo_electronico : dependientes[element].correo,
                                                                            numero_telefono : dependientes[element].numeroTel,
                                                                            direccion : dependientes[element].direccion,
                                                                            ruc : dependientes[element].ruc,
                                                                            nombre_cmp : `${ dependientes[element].nombre } ${ dependientes[element].apellido }`,
                                                                            creadoen : dependientes[element].fecha_creacion_socio,
                                                                            estado_socio : estados_socio.activo.descripcion,
                                                                            password : encriptar_password(dependientes[element].contraseña),
                                                                            nombre_usuario : dependientes[element].nombreUsuario,
                                                                            id_rol_usuario : dependientes[element].idAcceso,
                                                                            //tipo_usuario : '',
                                                                            parent_id_cliente : clienteTitular

                                                                        } 
                                                                    
                                                                    }  );
                }else {

                    dependiente = await prisma.cliente.update(  { 
                                                where : {  id_cliente : dependientes[element].idCliente  },
                                                data : {
                                                    nombre : dependientes[element].nombre,
                                                    apellido : dependientes[element].apellido,
                                                    cedula : dependientes[element].cedula,
                                                    fecha_nacimiento : fecha_db,
                                                    id_tipo_socio : dependientes[element].tipoSocio,
                                                    correo_electronico : dependientes[element].correo,
                                                    numero_telefono : dependientes[element].numeroTel,
                                                    direccion : dependientes[element].direccion,
                                                    ruc : dependientes[element].ruc,
                                                    nombre_cmp : `${ dependientes[element].nombre } ${ dependientes[element].apellido }`,
                                                    creadoen : dependientes[element].fecha_creacion_socio,
                                                    estado_socio : estados_socio.activo.descripcion,
                                                    password : encriptar_password(dependientes[element].contraseña),
                                                    nombre_usuario : dependientes[element].nombreUsuario,
                                                    id_rol_usuario : dependientes[element].idAcceso,
                                                    //tipo_usuario : '',
                                                    parent_id_cliente : clienteTitular
                                                
                                                } 
                                            
                                            }  );
                    
                }
                if ( dependientes[element].correo_electronico != "" &&  dependientes[element].correo_electronico !== undefined){
                    
                    const cuerpo_mail = ` usuario : ${ nombreUsuario }, contraseña : ${ contraseña } `;
                    sendMail( dependientes[element].correo_electronico, cuerpo_mail );
                }
            }

        }

        res.status( 200 ).json(
            {

                status : true,
                msj : 'Socio Actualizado',
                descripcion : `${ ( sociosDependientes.length === 0 ) ? `Socio Actualizado con exito ${nombre}, ${apellido}` : `Socios Actualizados con exito ${nombre}, ${apellido}, ${ sociosDependientes.reduce( (acumulador, element)=> ` ${element.nombre}, ${element.apellido} ` ) }` }`
            }
        );      
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
                descipcion : `El socio ${nombre}, ${apellido} ha sido borrado`

            }

        );        
    } catch (error) {
        console.log( error );
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
        const query = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS "nombreSocio", 
                                --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
                                A.CEDULA AS "cedula",
                                A.CORREO_ELECTRONICO AS "correoElectronico", 
                                A.DIRECCION AS "direccion",
                                A.ID_CLIENTE AS "idCliente", 
                                A.RUC AS "ruc" ,
                                A.CREADOEN AS "creadoEn", 
                                A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio" 
                            FROM CLIENTE A JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        ${ ( nombre !== undefined && nombre !== '' )? `AND UPPER( CONCAT (A.NOMBRE, ' ', A.APELLIDO) ) LIKE '%${nombre.toUpperCase()}%'` : `` }
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

            res.status(200).json({
                status: true,
                msg: 'Todos los Socios del club',
                socios
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
                                A.CORREO_ELECTRONICO AS "correoElectronico", 
                                A.DIRECCION AS "direccion",
                                A.ID_CLIENTE AS "idCliente", 
                                A.RUC AS "ruc" ,
                                A.CREADOEN AS "creadoEn", 
                                A.CONTRASEA AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio" 
                            FROM CLIENTE A JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        WHERE A.ESTADO_SOCIO = ${ estados_socio.activo.id_estado }
                        ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }
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
                                A.CORREO_ELECTRONICO AS "correoElectronico", 
                                A.DIRECCION AS "direccion",
                                A.ID_CLIENTE AS "idCliente", 
                                A.RUC AS "ruc" ,
                                A.CREADOEN AS "creadoEn", 
                                A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio" 
                            FROM CLIENTE A JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        WHERE A.ESTADO_SOCIO = ${ estados_socio.activo.id_estado }
                        ${ ( cedula !== undefined && cedula !== '' )? `AND A.CEDULA LIKE '%${ cedula }%'` : `` }
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

        
        //console.log( cantidad, omitir, nombre, apellido )
        const query_socio = `SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS "nombreSocio", 
                                --A.NOMBRE AS NOMBRE, A.APELLIDO AS APELLIDO,
                                A.CEDULA AS "cedula",
                                A.CORREO_ELECTRONICO AS "correoElectronico", 
                                A.DIRECCION AS "direccion",
                                A.ID_CLIENTE AS "idCliente", 
                                A.RUC AS "ruc" ,
                                A.CREADOEN AS "creadoEn", 
                                A.CONTRASEA AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio" 
                            FROM CLIENTE A JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        ${ ( nombre !== undefined ) && (apellido === undefined )? `AND A.NOMBRE LIKE '%${nombre}%'` : `` }
                        ${ ( nombre === undefined ) && (apellido !== undefined )? `AND A.APELLIDO LIKE '%${apellido}%'` : `` }
                        ${ ( nombre !== undefined ) && (apellido !== undefined )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre} ${apellido}%'` : `` }
                        ${ ( cedula !== undefined ) && ( cedula !== '' )?  `AND A.cedula = ${ cedula }` : ``}
                        ${ ( Number(cantidad) === NaN  ||  cantidad === undefined) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( Number(omitir)  === NaN ||  omitir === undefined ) ? `` : `OFFSET ${ Number(omitir) }` }`

        let socios = await prisma.$queryRawUnsafe(query_socio);

        //console.log ( socios );
        if ( socios.length === 0 ){

            res.status(200).json({
                status: false,
                msg: 'no existe ese socio en el club',
            });
        }else {

            res.status(200).json({
                status: true,
                msg: 'Socio del club',
                cant : socios.length,
                socios
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
