const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()



const crear_socio = async ( req = request, res = response ) => {

    //console.log ( req.body)
    const { nombre, apellido, fecha_nacimiento, cedula, correo, numero_tel, direccion, ruc } = req.body;

    //console.log ( nombre, apellido, fecha_nacimiento );
    //convertir la fecha de nacimiento a fecha
    const new_date = new Date(  )

    //primero debo de crear una persona y el sgte codigo devuelve el id de la persona creada
    const persona = await prisma.$executeRaw`INSERT INTO public.persona(
                                                    apellido, nombre, cedula, fecha_nacimiento)
                                                VALUES ( ${apellido}, ${nombre}, ${cedula}, ${new_date});`;
    //console.log ( typeof(persona), persona );
    //OBTENER EL ULTIMO INSERTADO
    const result  =  await prisma.$queryRaw`SELECT CAST ( MAX( id_persona ) AS INTEGER ) AS id_ultimo FROM  public.persona` ;
    const { id_ultimo } = result[0];
    //console.log ( result )

    const socio = await prisma.$executeRaw`INSERT INTO public.socio(
                                                id_tipo_socio, id_persona, correo_electronico, numero_telefono, direccion, ruc)
                                            VALUES ( 1, ${ id_ultimo },${correo} , ${numero_tel}, ${direccion}, ${ruc} )`;
    res.status( 200 ).json(

        {

            status : 'OK',
            msj : 'Socio Creado',

        }

    );
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

    const socios = await prisma.$queryRaw`SELECT id_socio, id_tipo_socio, correo_electronico, direccion, ruc 
                                            FROM SOCIO`;

    //console.log ( socios );

    res.status(200).json({
        status: 'ok',
        msg: 'Socios del club',
        data : socios
    });

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
                    borrar_socio 
                };