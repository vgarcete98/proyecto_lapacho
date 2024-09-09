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
            status : true,
            msj : 'Tipo de Socio Creado',
            nuevo_tipo_socio
        }

    );    
}




const obtener_tipos_socios = async ( req = request, res = response ) => {


    const tipos_socio = await prisma.tipo_socio.findMany(
        {
            select : {
                id_tipo_socio : true,
                desc_tipo_socio : true
            }
        }
    );

    const tipoSocio = tipos_socio.map( ( element ) => { 
                                                        return {
                                                                    idTipoSocio : typeof ( element.id_tipo_socio ) === 'bigint'? Number(element.id_tipo_socio.toString()) : element.id_tipo_socio, 
                                                                    descTipoSocio : element. desc_tipo_socio 
                                                                }
                                                    } 
                                    );


    res.status( 200 ).json(

        {
            status : true,
            msj : 'Tipos de socio en el club',
            tipoSocio
        }

    );   
}





module.exports = {

    crear_tipo_socio,
    obtener_tipos_socios

}