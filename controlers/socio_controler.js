const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()



const crear_socio = async ( req = request, res = response ) => {

    //console.log ( req.body)
    const { nombre, apellido, fecha_nacimiento, cedula } = req.body;

    //console.log ( nombre, apellido, fecha_nacimiento );
    //convertir la fecha de nacimiento a fecha
    const new_date = new Date(  )

    //primero debo de crear una persona y el sgte codigo devuelve el id de la persona creada
    const persona = await prisma.$executeRaw`INSERT INTO public.persona(
                                                    apellido, nombre, cedula, fecha_nacimiento)
                                                VALUES ( ${apellido}, ${nombre}, ${cedula}, ${new_date});`;
    console.log ( persona );
    
    const socio = await prisma.$executeRaw`INSERT INTO public.socio(
                                                id_tipo_socio, id_persona, correo_electronico, numero_telefono, direccion, ruc)
                                            VALUES ( 1, ?, ?, ?, ?, ? );`;
    res.status( 200 ).json(


        {

            status : 'OK',
            msj : 'Socio Creado',

        }

    )
}



const actualizar_socio = async ( req = Request, res = Response ) => {






}



const borrar_socio = async ( req = Request, res = Response ) => {






}




const obtener_socios = async ( req = Request, res = Response ) => {

    const socios = await prisma.$queryRaw`SELECT id_socio, id_tipo_socio, correo_electronico, direccion, ruc 
                                            FROM SOCIO`;

    console.log ( socios );

    res.status(200).json({
        status: 'ok',
        msg: 'Socios del club',
        data : socios
    })

}

const obtener_socio = async ( req = Request, res = Response ) => {




}





module.exports = { crear_socio, 
                    actualizar_socio, 
                    obtener_socio, 
                    obtener_socios, 
                    borrar_socio 
                };