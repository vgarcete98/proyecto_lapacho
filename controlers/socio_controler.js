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
        const { nombre, apellido, fechaNacimiento, cedula, correo, numeroTel, direccion, ruc, tipoSocio } = req.body;

        //console.log ( nombre, apellido, fecha_nacimiento );
        //convertir la fecha de nacimiento a fecha
        const fecha_db = generar_fecha( fechaNacimiento );

        //primero debo de crear una persona y el sgte codigo devuelve el id de la persona creada

        //------------------------------------------------------------------------------------------
        /*
        const persona = await prisma.persona.create( { 
                                                        data : {
                                                            nombre,
                                                            apellido,
                                                            cedula,
                                                            fecha_nacimiento : fecha_db
                                                        } 
                                                    } );
        */
        //------------------------------------------------------------------------------------------       
        const persona = await prisma.$executeRaw`INSERT INTO public.persona(
                                                        apellido, nombre, cedula, fecha_nacimiento)
                                                    VALUES ( ${apellido}, ${nombre}, ${cedula}, ${fecha_db});`;
        
        //OBTENER EL SOCIO INSERTADO
        
        //------------------------------------------------------------------------------------------
        
        const result  =  await prisma.$queryRaw`SELECT CAST ( id_persona AS INTEGER ) AS id_persona 
                                                    FROM  public.persona
                                                WHERE cedula = CAST( ${ cedula } AS VARCHAR )` ;
        
        const { id_persona } = result[0];
        //console.log ( result )
        //------------------------------------------------------------------------------------------

        //const { id_persona } = persona;

        //------------------------------------------------------------------------------------------
        /*       
        const socio = await prisma.$executeRaw`INSERT INTO public.socio(
                                                    id_tipo_socio, id_persona, correo_electronico, numero_telefono, direccion, ruc)
                                                VALUES ( ${ tipoSocio }, ${ id_persona },${correo} , ${numeroTel}, ${direccion}, ${ruc} )`;
        */
        //------------------------------------------------------------------------------------------

        const fecha_creacion_socio = new Date();
        const nuevo_socio = await prisma.socio.create( { 
                                                            data : {
                                                                id_tipo_socio : tipoSocio,
                                                                id_persona,
                                                                correo,
                                                                numero_telefono : numeroTel,
                                                                direccion,
                                                                ruc,
                                                                nombre_cmp : `${ nombre } ${ apellido }`,
                                                                creadoen : fecha_creacion_socio,
                                                                estado_socio : estados_socio.activo.id_estado
                                                            } 
                                                    
                                                    } );
        const { nombre_cmp, correo_electronico, creadoen, estado_socio  } = nuevo_socio;
        const direccion_socio = nuevo_socio.direccion;
        res.status( 200 ).json(
            {

                status : true,
                msj : 'Socio Creado',
                socio_nuevo : {
                    nombreCmp : nombre_cmp, 
                    correoElectronico : correo_electronico, 
                    creadoEn : creadoen, 
                    estadoSocio : estado_socio,
                    direccionSocio : direccion_socio
                }
            }
        );   

    } catch (error) {
        console.log( error );
        res.status( 500 ).json(

            {
                status : false,
                msj : 'No se puede crear al socio solicitado',
                error
            }

        );

    }

}



const actualizar_socio = async ( req = request, res = response ) => {

    const { correoNuevo, telefonoNuevo, rucNuevo, estadoSocio, direccionNuevo } = req.body;
    //console.log( correoNuevo, telefonoNuevo, rucNuevo, estadoSocio, direccionNuevo );
    const { id_socio } = req.params;
    //console.log( id );

    try {
        //------------------------------------------------------------------------------------------
        /*const socio_actualizado = prisma.$executeRaw`UPDATE public.socio
                                                            SET correo_electronico=${correo}, 
                                                                numero_telefono=${telefono}, 
                                                                direccion=${direccion}
                                                    WHERE id_socio = ${id}`;*/
        //------------------------------------------------------------------------------------------
        const fecha_socio_actualizado = new Date();
        const socio_actualizado = await prisma.socio.update( { 
                                                                where : {  id_socio : Number ( id_socio )  },
                                                                data : {

                                                                    editadoen : fecha_socio_actualizado,
                                                                    correo_electronico : correoNuevo,
                                                                    numero_telefono : telefonoNuevo,
                                                                    ruc : rucNuevo,
                                                                    estado_socio : estadoSocio,
                                                                    direccion : direccionNuevo
                                                                }
                                                            } );
        //console.log( socio_actualizado );
        const { editadoen, correo_electronico, telefono, ruc, estado_socio, direccion, nombre_cmp } = socio_actualizado;
        res.status( 200 ).json({
            status : true,
            msj : 'Socio Actualizado',
            socioActualizadoConvertido : {
                editadoEn : editadoen, 
                correoElectronico : correo_electronico, 
                telefono, 
                ruc,
                estadoSocio : estado_socio, 
                direccion,
                nombreCmp : nombre_cmp
            }

        });        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo actualizar al Socio'
        } );
    }


}



const borrar_socio = async ( req = request, res = response ) => {

    // SE IMPLEMENTA EL BORRADO DEL SOCIO ACTUALIZANDO NADA MAS CIERTOS CAMPOS DE LA TABLA
    const { id_socio } = req.params;
    //console.log( id );
    //const { estadoSocio, correoElectronico, numeroTel, ruc } = req.body;

    try {
        //----------------------------------------------------------------------------
        /*
        const socio_actualizado = prisma.$executeRaw`UPDATE public.socio
                                                            SET socio_activo = false
                                                    WHERE id_socio = ${id}`;
        */
        //----------------------------------------------------------------------------
        const fecha_edicion = new Date();
        const socio_actualizado = await prisma.socio.update( { 
                                                                data : {
                                                                    estado_socio : estados_socio.eliminado.id_estado,
                                                                    editadoen : fecha_edicion
                                                                },
                                                                where : { id_socio }
                                                            } );
        const { editadoen, direccion, correo_electronico, numero_telefono, estado_socio, ruc } = socio_actualizado;
        res.status( 200 ).json(

            {

                status : true,
                msj : 'Socio Borrado',
                socio_borrado : {
                    editadoEn : editadoen, 
                    direccion, 
                    correoElectronico : correo_electronico, 
                    numeroTel : numero_telefono, 
                    estadoSocio : estado_socio, 
                    ruc
                }

            }

        );        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json(

            {

                status : false,
                msj : 'No se logro borrar al socio',
                error

            }

        );
    }




}




const obtener_socios = async ( req = request, res = response ) => {
    

    //SE OBTIENEN TODOS LOS SOCIOS DEL CLUB YA SEA ACTIVOS, ELIMINADOS, SUSPENDIDOS
    try {
        const socios = await prisma.$queryRaw`SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, A.CEDULA, 
                                                    CAST ( B.ID_SOCIO AS INTEGER ) AS idSocio,
                                                    C.DESC_TIPO_SOCIO AS descTipoSocio, B.NUMERO_TELEFONO AS numeroTel , 
                                                    B.ESTADO_SOCIO AS estadoSocio 
                                                FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO`;


        if ( socios.length === 0 ){

            res.status(200).json({
                status: true,
                msg: 'No hay Socios del club para mostrar',
                data : socios
            });   

        }else {

            const sociosFormateados = socios.map( ( element ) =>{

                const { nombresocio, cedula, idsocio, desctiposocio, numerotel, estadosocio } = element;
                
                
                return {
                    nombreSocio : nombresocio,
                    idSocio : idsocio,
                    descTipoSocio : desctiposocio,
                    numeroTel : numerotel,
                    estadoSocio : estadosocio,
                    cedula
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
        res.status( 500 ).json({
            status: false,
            msg: 'No se pudo obtener la informacion de los socios del club',
            data : socios
        });    
    }


}




const obtener_socios_detallados = async ( req = request, res = response ) => {

    // OBTIENE LOS SOCIOS DETALLADOS ACTIVOS DEL CLUB
    try {
        const socios_detallados = await prisma.$queryRaw`SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS nombreSocio, A.CEDULA,
                                                        CAST ( B.ID_SOCIO AS INTEGER ) AS idSocio,
                                                        B.NUMERO_TELEFONO AS numeroTelefono, B.ESTADO_SOCIO AS estadoSocio, 
                                                        C.DESC_TIPO_SOCIO AS descTipoSocio
                                                    FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                    JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                                                WHERE B.ESTADO_SOCIO = ${ estados_socio.activo.id_estado };`
        //const {} = socios_detallados;
        //const socios_formateados = socios_detallados

        if ( socios_detallados.length === 0 ){

            res.status(200).json({
                status: false,
                msg: 'no existen socios activos en el club',
                cant : socios_detallados.length,
                data : socios_detallados
            });
        }else {
            let sociosFormateados = []; 
            socios_detallados.forEach( element => {
                const { nombresocio, cedula, idsocio, numerotelefono, estadosocio, desctiposocio } = element;
                sociosFormateados.push( {
                    nombreSocio : nombresocio,
                    cedula,
                    idSocio : idsocio,
                    numeroTel : numerotelefono,
                    estadoSocio : estadosocio,
                    descTipoSocio : desctiposocio
                } );
            });
            res.status(200).json({
                status: true,
                msg: 'Socios del club',
                cant : socios_detallados.length,
                sociosFormateados
            });
        }        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
           status : false,
           msg : 'No se pudo obtener el detalle de los socios',
           error 
        });
        
    }



}




const obtener_socio_cedula = async ( req = request, res = response ) =>{

    //console.log( req.query );
    const { cedula } = req.query;


    try {
        const socioCedula = await prisma.socio.findFirst( { where : { cedula } } );        
        res.status( 200 ).json( {
            status : true,
            msg : 'Socio con cedula',
            socioCedula
        } );

    } catch (error) {
        console.log( error )
    }




}


const obtener_socio = async ( req = request, res = response ) => {

    //OBTENER EL SOCIO PASANDOLE UN ID

    const { id_socio } = req.params;
    try {
        const socio = await prisma.$queryRaw`SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS NOMBRE_SOCIO, A.CEDULA,
                                                    CAST ( B.ID_SOCIO AS INTEGER ) AS ID_SOCIO,
                                                    B.NUMERO_TELEFONO, B.ESTADO_SOCIO, C.DESC_TIPO_SOCIO
                                                FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                                JOIN TIPO_SOCIO C ON C.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                                            WHERE B.ID_SOCIO = ${ Number(id_socio) }`;


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
                    obtener_socio_cedula 
                };