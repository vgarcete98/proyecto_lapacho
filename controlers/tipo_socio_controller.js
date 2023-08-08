const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const crear_tipo_socio = async ( req = request, res = response ) => {

    const { descripcion_tipo_socio } = req.body;

    const nuevo_tipo_socio = prisma.$executeRaw`INSERT INTO public.tipo_socio(
                                                    desc_tipo_socio)
                                                VALUES ( ${ descripcion_tipo_socio } );`
    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Tipo de Socio Creado',
            nuevo_tipo_socio
        }

    );    
}




const obtener_tipos_socios = async ( req = request, res = response ) => {


    const tipos_socio = prisma.$queryRaw`SELECT id_tipo_socio, desc_tipo_socio
                                                    FROM public.tipo_socio;`;
    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Tipo de Socio Creado',
            tipos_socio
        }

    );   
}





module.exports = {

    crear_tipo_socio,
    obtener_tipos_socios

}