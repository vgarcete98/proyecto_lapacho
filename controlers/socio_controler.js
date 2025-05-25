const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');


const { encriptar_password } = require( '../helpers/generar_encriptado' );
const { sendMail } = require('../helpers/node_mailer_config');
const { comprobar_existe_cliente } = require('../helpers/comprobar_existe_cliente');
const { actualiza_datos_cuota_socio } = require('../helpers/actualiza_datos_cuota_socio');
const { obtener_cantidad_registros_query, excluir_campos_resultado } = require('../helpers/obtener_cant_registros_query');
const prisma = new PrismaClient()



const estados_socio = {

    activo : { descripcion :'ACTIVO', id_estado : 1 },
    suspendido : { descripcion :'SUSPENDIDO', id_estado : 2 },
    eliminado : { descripcion :'ELIMINADO', id_estado : 3 }

}



const crear_socio_dependientes = async ( req = request, res = response ) => {


    try {

        const { idSocio, dependientes } = req.body;
        
        //OBTENER EL SOCIO INSERTADO
        //------------------------------------------------------------------------------------------
        let nuevo_socio = {};
        let nuevos_socios = [];
        const cantidad_a_insertar = dependientes.length;
        nuevo_socio = await prisma.cliente.findUnique( { where : { id_cliente : Number(idSocio) } } )

        const idClienteTitular = nuevo_socio.id_cliente;
        //console.log( dependientes );
        if (dependientes.length !== 0 && dependientes !== undefined && dependientes !== null) {
            let dependiente = {};
            try {
                for (let element in dependientes ) {
    
                    dependiente = await prisma.cliente.upsert( {
                                                                    where : { cedula :  dependientes[element].cedula, es_socio : false },
                                                                    update : {
                                                                        nombre : dependientes[element].nombre,
                                                                        apellido : dependientes[element].apellido,
                                                                        //cedula : dependientes[element].cedula,
                                                                        fecha_nacimiento : generar_fecha( dependientes[element].fechaNacimiento),
                                                                        id_tipo_socio : dependientes[element].tipoSocio,
                                                                        correo_electronico : dependientes[element].correo,
                                                                        numero_telefono : dependientes[element].numeroTel,
                                                                        direccion : dependientes[element].direccion,
                                                                        nombre_cmp : `${ dependientes[element].nombre } ${ dependientes[element].apellido }`,
                                                                        creadoen : new Date (),
                                                                        estado_usuario : estados_socio.activo.descripcion,
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
                                                                        nombre_cmp : `${ dependientes[element].nombre } ${ dependientes[element].apellido }`,
                                                                        creadoen : new Date (),
                                                                        estado_usuario : estados_socio.activo.descripcion,
                                                                        parent_id_cliente : idClienteTitular,
                                                                        es_socio : true,  
                                                                    }
                                                            } );

                    if ( dependientes[element].correo_electronico != "" &&  dependientes[element].correo_electronico !== undefined){
                        const cuerpo_mail = `Bienvenido al club Lapacho Socio ${dependientes[element].nombre}, ${dependientes[element].apellido}`;
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
                    msg : 'Socio Creado',
                    descripcion : ` ${ dependientes.reduce( (acumulador, element)=> ` ${element.nombre}, ${element.apellido} ` ) } socios`
                }
            );   
        }else {
            res.status( 400 ).json(
                {
    
                    status : true,
                    msg : 'No se lograron crear todos los socios que se adjunto',
                    descripcion : `insertados : ${ nuevos_socios.length } socios`
                }
            ); 
        }

    } catch ( error ) {
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msg : `No se puede crear al socio solicitado ${error}`,
                //error
            }

        );

    }

}



const crear_socio = async ( req = request, res = response ) => {


    try {

        const { nombre, apellido, fechaNacimiento, cedula, estadoSocio,
                correo, numeroTel, direccion, ruc, tipoSocio  } = req.body;
        
        //OBTENER EL SOCIO INSERTADO
        //------------------------------------------------------------------------------------------
        let nuevo_socio = {};
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
                        //password : contraseña,//encriptar_password(contraseña),
                        //nombre_usuario : nombreUsuario,
                        //id_rol_usuario : idAcceso,
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
                estado_usuario : estados_socio.activo.descripcion,
                es_socio : true
            }
        } );
        if ( nuevo_socio.correo_electronico != "" ){
            //console.log( correo_electronico )
            const cuerpo_mail = `Bienvenido al club Lapacho Socio ${nombre}, ${apellido}`;
            sendMail( nuevo_socio.correo_electronico, cuerpo_mail );
        }



        if ( nuevo_socio !== null){
            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Socio Creado',
                    descripcion : `Socio Creado con exito ${nombre}, ${apellido}` 
                }
            );   

        }else {
            res.status( 400 ).json(
                {
    
                    status : true,
                    msg : 'No se logro crear al socio que se adjunto',
                    descripcion : ` No se logro crear al socio que se adjunto  ${nombre}, ${apellido}`
                }
            ); 
        }

    } catch ( error ) {
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msg : `No se puede crear al socio solicitado ${error}`,
                //error
            }

        );

    }

}



const actualizar_socio = async ( req = request, res = response ) => {


    try {
        const { nombre, apellido, fechaNacimiento, cedula, estadoSocio,
                correo, numeroTel, direccion, ruc, tipoSocio, idCliente, esSocio} = req.body;
        //------------------------------------------------------------------------------------------
        const fecha_socio_actualizado = new Date();
        const datos_viejos = await prisma.cliente.findUnique( 
                                                                { 
                                                                    where : { id_cliente : Number( idCliente ) },
                                                                    select : { id_tipo_socio : true } 
                                                                }
                                                            );
        //BUSCO LAS CUOTAS VIEJAS POR QUE UNA VEZ QUE SE ACTUALIZA EL SOCIO SE GENERAN LAS NUEVAS                                                    
        const cuotas_viejas = await prisma.cuotas_socio.findMany( { 
                                                                    where : {
                                                                        AND : [
                                                                            { id_cliente : Number(idCliente)},
                                                                            { fecha_vencimiento : { gte : new Date() } },
                                                                            { estado : 'PENDIENTE' }

                                                                        ] 
                                                                    },
                                                                    select :{
                                                                        id_cuota_socio : true
                                                                    }
                                                                } ); 
                                                                
                                                                
        const socio_actualizado = await prisma.cliente.update( { 
                                                                where : {  id_cliente : Number ( idCliente )  },
                                                                data : {
                                                                    nombre : nombre,
                                                                    apellido : apellido,
                                                                    direccion : direccion,
                                                                    fecha_nacimiento : generar_fecha( fechaNacimiento ),
                                                                    cedula : cedula,
                                                                    editadoen : fecha_socio_actualizado,
                                                                    correo_electronico : correo,
                                                                    ruc : ruc,
                                                                    id_tipo_socio : Number(tipoSocio),
                                                                    numero_telefono : numeroTel,
                                                                    estado_usuario : ( Boolean(esSocio) === true ) ? estados_socio.activo.descripcion : estados_socio.suspendido.descripcion,
                                                                    direccion : direccion
                                                                }
                                                            } );
        //console.log( socio_actualizado );
        const { id_tipo_socio, id_cliente } = datos_viejos;
        //console.log( Number(tipoSocio), id_tipo_socio );
        if ( Number(tipoSocio) !== id_tipo_socio) {
            await actualiza_datos_cuota_socio(id_cliente, Number(tipoSocio), cuotas_viejas);
        }

        if( socio_actualizado !== null ){

            if ( correo !== "" && correo !== undefined ){
                //console.log( correo_electronico )
                const cuerpo_mail = `Actualizacion de datos de socio`;
                sendMail( correo, cuerpo_mail );
            }
    
    
            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Socio Actualizado',
                    descripcion : `Actualizacion de socio realizada con exito`
                }
            );      
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo actualizar al Socio  ${ error }`,
            //error
        } );
    }


}




const crear_socio_usuario = async ( req = request, res = response ) => {


    try {

        const { idSocio, contraseña, nombreUsuario, idAcceso   } = req.body;
        
        //OBTENER EL SOCIO INSERTADO
        //------------------------------------------------------------------------------------------
        let nuevo_socio_usuario = {};
        const socio = await prisma.cliente.findUnique( { where : { id_cliente : Number( idSocio ) } } );

        nuevo_socio_usuario = await prisma.cliente.update( { 
            where : { id_cliente : socio.id_cliente, es_socio : true },
            data : {  
                estado_usuario : estados_socio.activo.descripcion,
                password : contraseña,//encriptar_password(contraseña),
                nombre_usuario : nombreUsuario,
                id_rol_usuario : idAcceso
            }
        } );



        if ( nuevo_socio_usuario !== null){
            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Usuario Creado',
                    descripcion : `Usuario Creado con exito ${socio.nombre}, ${socio.apellido}` 
                }
            );   

        }else {
            res.status( 400 ).json(
                {
    
                    status : true,
                    msg : 'No se logro crear al usuario que se adjunto',
                    descripcion : ` No se logro crear al usuario que se adjunto  ${socio.nombre}, ${socio.apellido}`
                }
            ); 
        }

    } catch ( error ) {
        //console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msg : `No se puede crear al socio solicitado ${error}`,
                //error
            }

        );

    }

}



const actualizar_socio_usuario = async ( req = request, res = response ) => {


    try {

        const { idSocio, contraseña, nombreUsuario, idAcceso   } = req.body;
        
        //OBTENER EL SOCIO INSERTADO
        //------------------------------------------------------------------------------------------
        let nuevo_socio_usuario = {};
        const socio = await prisma.cliente.findUnique( { where : { id_cliente : Number( idSocio ) } } );

        nuevo_socio_usuario = await prisma.cliente.update( { 
            where : { id_cliente : socio.id_cliente, es_socio : true },
            data : {  
                estado_usuario : estados_socio.activo.descripcion,
                password : contraseña,//encriptar_password(contraseña),
                nombre_usuario : nombreUsuario,
                id_rol_usuario : idAcceso
            }
        } );



        if ( nuevo_socio_usuario !== null){
            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Usuario Creado',
                    descripcion : `Usuario Creado con exito ${socio.nombre}, ${socio.apellido}` 
                }
            );   

        }else {
            res.status( 400 ).json(
                {
    
                    status : true,
                    msg : 'No se logro crear al usuario que se adjunto',
                    descripcion : ` No se logro crear al usuario que se adjunto  ${socio.nombre}, ${socio.apellido}`
                }
            ); 
        }
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
    //SE LE ASCIENDE A CLIENTE AL SOCIO QUE SE BORRA YA QUE HAY QUE MANTENER LAS DEUDAS QUE EL MISMO TIENE PENDIENTE
    try {
        const { idCliente } = req.body;

        //----------------------------------------------------------------------------
        const fecha_edicion = new Date();
        const socio_actualizado = await prisma.cliente.update( { 
                                                                data : {
                                                                    estado_usuario : estados_socio.eliminado.descripcion,
                                                                    editadoen : fecha_edicion,
                                                                    es_socio : false,
                                                                    id_tipo_socio : null,
                                                                    eliminadoen : new Date(),
                                                                    password : null,
                                                                    nombre_usuario : null

                                                                },
                                                                where : { id_cliente : Number(idCliente) }
                                                            } );
                                                            
        if ( socio_actualizado !== null ) { 
            const { nombre, apellido } = socio_actualizado;
            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Socio Borrado',
                    descripcion : `El socio ${nombre}, ${apellido} ha sido borrado`
    
                }
    
            );        

        }else {
            res.status( 400 ).json(
                {
    
                    status : false,
                    msg : 'Socio Borrado',
                    descripcion : `No se pudo borrar al socio, intente de nuevo`
                }   
            ); 
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json(
            {
                status : false,
                msg : `No se logro borrar al socio, Ocurrio un error ${ error }`,
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
                                --A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio",
                                (COUNT(*) OVER() ) :: integer AS cantidad  
                            FROM CLIENTE A JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        ${ ( nombre !== undefined && nombre !== '' )? `AND UPPER( CONCAT (A.NOMBRE, ' ', A.APELLIDO) ) LIKE '%${nombre.toUpperCase()}%'` : `` }
                        ${ ( isNaN(cantidad) ) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( isNaN(omitir) ) ? `` : `OFFSET ${(Number(omitir) > 1 ) ? Number(omitir)*10: 0 }` }`
        //console.log( query );
        socios = await prisma.$queryRawUnsafe( query );
        

        if ( socios.length === 0 ){

            res.status(200).json({
                status: true,
                msg: 'No hay Socios del club para mostrar',
                data : socios
            });   

        }else {

            const { cantidad } = socios[0];
            res.status(200).json({
                status: true,
                msg: 'Todos los Socios del club',
                socios : excluir_campos_resultado( socios, [ "cantidad" ] ),
                cantidad

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
                                --A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio",
                                (COUNT(*) OVER() ) :: integer AS cantidad 
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

            const { cantidad } = sociosFormateados[0];
            res.status(200).json({
                status: true,
                msg: 'Socios del club',
                sociosFormateados : excluir_campos_resultado( sociosFormateados, [ "cantidad" ] ),
                cantidad
            });     
        }
        
        
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
                                --A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio",
                                (COUNT(*) OVER() ) :: integer AS cantidad 
                            FROM CLIENTE A LEFT  JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        WHERE (A.ESTADO_USUARIO IN ( '${ estados_socio.activo.descripcion }',  NULL, '${ estados_socio.suspendido.descripcion }', '${ estados_socio.eliminado.descripcion }') || A.ESTADO_USUARIO IS NULL)
                        ${ ( cedula !== undefined && cedula !== '' )? `AND A.CEDULA LIKE '%${ cedula }%'` : `` }
                        ${ ( isNaN(cantidad) ) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( isNaN(omitir) ) ? `` : `OFFSET ${ (Number(omitir) > 1 ) ? Number(omitir)*10: 0 }` }`

        console.log(query);

        let sociosFormateados = await prisma.$queryRawUnsafe( query ); 

        
        if ( sociosFormateados.length === 0 ){

            res.status(200).json({
                status: true,
                msg: 'No hay Socios del club para mostrar',
                data : []
            }); 

        }else {
            const { cantidad } = sociosFormateados[0];

            res.status(200).json({
                status: true,
                msg: 'Socios del club',
                sociosFormateados : excluir_campos_resultado( sociosFormateados, [ "cantidad" ] ),
                cantidad
            });     



        }


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
                                --A.PASSWORD AS "contrasea",
                                A.NOMBRE_USUARIO AS "nombreUsuario",
                                A.FECHA_NACIMIENTO AS "fechaNacimiento",
                                CAST ( C.ID_TIPO_SOCIO AS INTEGER ) AS "idTipoSocio",
                                C.DESC_TIPO_SOCIO AS "descTipoSocio", 
                                A.NUMERO_TELEFONO AS "numeroTelefono",
                                A.ESTADO_USUARIO AS "estadoSocio"
                            FROM CLIENTE A LEFT  JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        ${ ( nombre !== undefined ) && (apellido === undefined )? `AND A.NOMBRE LIKE '%${nombre}%'` : `` }
                        ${ ( nombre === undefined ) && (apellido !== undefined )? `AND A.APELLIDO LIKE '%${apellido}%'` : `` }
                        ${ ( nombre !== undefined ) && (apellido !== undefined )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre} ${apellido}%'` : `` }
                        ${ ( cedula !== undefined ) && ( cedula !== '' )?  `AND A.cedula = ${ cedula }` : ``}
                        ${ ( isNaN(cantidad)) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( isNaN(omitir) ) ? `` : `OFFSET ${ (Number(omitir) > 1 ) ? Number(omitir)*10: 0 }` }`

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



const obtener_socio_usuario = async ( req = request, res = response ) => {

    //OBTENER EL SOCIO PASANDOLE UN ID

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
                                (COUNT(*) OVER() ) :: integer AS cantidad 
                            FROM CLIENTE A LEFT  JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = A.ID_TIPO_SOCIO
                        WHERE (A.ESTADO_USUARIO IN ( '${ estados_socio.activo.descripcion }',  '${ estados_socio.suspendido.descripcion }', '${ estados_socio.eliminado.descripcion }') || A.ESTADO_USUARIO IS NULL) AND A.NOMBRE_USUARIO IS NOT NULL
                        ${ ( nombre !== undefined && nombre !== '' )? `AND CONCAT (A.NOMBRE, ' ', A.APELLIDO) LIKE '%${nombre}%'` : `` }
                        ${ ( isNaN(cantidad) ) ? `` : `LIMIT ${Number(cantidad)}`} 
                        ${ ( isNaN(omitir) ) ? `` : `OFFSET ${ (Number(omitir) > 1 ) ? Number(omitir)*10: 0 }` }`
        //console.log( query )
        let usuariosFormateados = await prisma.$queryRawUnsafe( query ); 

        if ( usuariosFormateados.length === 0 ){

            res.status(200).json({
                status: false,
                msg: 'no existe ese socio en el club',
            });
        }else {
            res.status(200).json({
                status: true,
                msg: 'Usuarios del club',
                cantidad
            });     

        }
        
        
    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
           status : false,
           msg : `No se pudo obtener el detalle de los socios ${ error } `,
           //error 
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
                    obtener_socio_cedula_nombre,
                    crear_socio_dependientes,
                    crear_socio_usuario,
                    actualizar_socio_usuario,
                    obtener_socio_usuario
                };
