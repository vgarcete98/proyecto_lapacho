const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient()



const crear_socio = async ( req = request, res = response ) => {


    try {
        //console.log ( req.body)
        const { nombre, apellido, fechaNacimiento, cedula, correo, numeroTel, direccion, ruc, tipoSocio } = req.body;

        //console.log ( nombre, apellido, fecha_nacimiento );
        //convertir la fecha de nacimiento a fecha
        const fecha_db = generar_fecha( fechaNacimiento );

        //primero debo de crear una persona y el sgte codigo devuelve el id de la persona creada

        const persona = await prisma.persona.create( { 
                                                        data : {
                                                            nombre,
                                                            apellido,
                                                            cedula,
                                                            fecha_nacimiento : fecha_db
                                                        } 
                                                    } );
        /*
        const persona = await prisma.$executeRaw`INSERT INTO public.persona(
                                                        apellido, nombre, cedula, fecha_nacimiento)
                                                    VALUES ( ${apellido}, ${nombre}, ${cedula}, ${fecha_db});`;
        */
        //OBTENER EL SOCIO INSERTADO
        
        //------------------------------------------------------------------------------------------
        /*
        const result  =  await prisma.$queryRaw`SELECT CAST ( id_persona AS INTEGER ) AS id_persona 
                                                    FROM  public.persona
                                                WHERE cedula = CAST( ${ cedula } AS VARCHAR )` ;
        */
        //const { id_persona } = result[0];
        //console.log ( result )
        //------------------------------------------------------------------------------------------

        const { id_persona } = persona;

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
                                                                creadoen : fecha_creacion_socio
                                                            } 
                                                    
                                                    } );
        res.status( 200 ).json(
            {

                status : true,
                msj : 'Socio Creado',
                nuevo_socio
            }
        );   

    } catch (error) {
        console.log( error );
        res.status( 500 ).json(

            {

                status : false,
                msj : 'No se puede crear al socio solicitado',

            }

        );

    }

}



const actualizar_socio = async ( req = request, res = response ) => {

    const { correo, telefono, ruc } = req.body;
    const { id } = req.params;
    console.log( id );

    const socio_actualizado = prisma.$executeRaw`UPDATE public.socio
                                                        SET correo_electronico=${correo}, 
                                                            numero_telefono=${telefono}, 
                                                            direccion=${direccion}
                                                WHERE id_socio = ${id}`;

    res.status( 200 ).json(

        {

            status : 'OK',
            msj : 'Socio Actualizado',
            socio_actualizado

        }

    );

}



const borrar_socio = async ( req = request, res = response ) => {


    const { id } = req.params;
    //console.log( id );

    const socio_actualizado = prisma.$executeRaw`UPDATE public.socio
                                                        SET socio_activo = false
                                                WHERE id_socio = ${id}`;

    res.status( 200 ).json(

        {

            status : 'OK',
            msj : 'Socio Borrado',
            socio_actualizado

        }

    );



}




const obtener_socios = async ( req = request, res = response ) => {

    const socios = await prisma.$queryRaw`SELECT CAST ( id_socio AS INTEGER ) AS id_socio, 
                                                CAST ( id_tipo_socio AS INTEGER ) AS id_tipo_socio, 
                                                correo_electronico, direccion, ruc 
                                            FROM SOCIO`;

    //console.log ( socios );

    res.status(200).json({
        status: 'ok',
        msg: 'Socios del club',
        data : socios
    });

}




const obtener_socios_detallados = async ( req = request, res = response ) => {

    // OBTIENE LOS SOCIOS DETALLADOS ACTIVOS DEL CLUB
    const socios_detallados = await prisma.$queryRaw`SELECT CONCAT (A.NOMBRE, ' ', A.APELLIDO) AS NOMBRE_SOCIO, A.CEDULA,
                                                    B.ID_TIPO_SOCIO, B.NUMERO_TELEFONO, B.ESTADO_SOCIO
                                                FROM PERSONA A JOIN SOCIO B ON A.ID_PERSONA = B.ID_PERSONA
                                            WHERE B.EDITADOEN IS NOT NULL;`

    if ( socios_detallados.length === 0 ){

        res.status(200).json({
            status: false,
            msg: 'no existen socios activos en el club',
            cant : socios_detallados.length,
            data : socios_detallados
        });
    }else {

        res.status(200).json({
            status: true,
            msg: 'Socios del club',
            cant : socios_detallados.length,
            data : socios_detallados
        });
    }


}


const obtener_socio = async ( req = request, res = response ) => {

    //OBTENER EL SOCIO PASANDOLE UN ID

    const { id } = req.params;

    const socio = await prisma.$queryRaw`SELECT id_socio, id_tipo_socio, correo_electronico, direccion, ruc 
                                            FROM SOCIO
                                        WHERE id_socio = ${id}`;

    //console.log ( socios );

    res.status(200).json({
        status: 'ok',
        msg: 'Socio del club',
        data : socio
    });

}





module.exports = { crear_socio, 
                    actualizar_socio, 
                    obtener_socio, 
                    obtener_socios,
                    obtener_socios_detallados, 
                    borrar_socio 
                };