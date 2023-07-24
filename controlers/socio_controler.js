const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()



const crear_socio = async ( req = request, res = response ) => {

    console.log ( req )
    //const { nombre, apellido, fecha_nacimiento } = req.body;

    //console.log ( nombre, apellido, fecha_nacimiento );

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