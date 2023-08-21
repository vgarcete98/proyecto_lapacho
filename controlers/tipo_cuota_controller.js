const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const obtener_tipos_de_cuota = async ( req = request, res = response ) => {


    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Pagos del mes en el club',
            
        }
    );


}


const crear_tipo_de_cuota = async ( req = request, res = response ) => {


    const { descripcion, monto_cuota } = req.body;

    const nuevo_tipo_cuota = await prisma.$executeRaw`INSERT INTO TIPO_CUOTA 
                                                            ( DESC_TIPO_CUOTA, MONTO_CUOTA )
                                                        VALUES ( ${ descripcion }, ${ monto_cuota } )`;
    if ( nuevo_tipo_cuota > 0 ) {

        res.status( 200 ).json(

            {
                status : 'OK',
                msj : 'Nuevo tipo de cuota Creado',
                status : true
            }
        );

    } else {
        res.status( 200 ).json(

            {
                status : 'OK',
                msj : 'No se pudo crear el tipo de cuota',
                status : false
            }
        );
    }


}


const editar_tipo_de_cuota = async ( req = request, res = response ) => {

    const { descripcion, monto_cuota } = req.body;
    const { id_tipo_cuota } = req.params;

    const editar_tipo_de_cuota = await prisma.$executeRaw`UPDATE public.tipo_cuota
                                                                SET desc_tipo_cuota=${ descripcion }, monto_cuota= ${ monto_cuota }
                                                            WHERE id_tipo_cuota = ${ id_tipo_cuota }`;

    if ( editar_tipo_de_cuota > 0 ) { 

        res.status( 200 ).json(

            {
                status : 'OK',
                msj : 'Pagos del mes en el club',
                status : true
            }
        );


    } else {
        res.status( 200 ).json(

            {
                status : 'OK',
                msj : 'Editado tipo de cuota',
                status : false
            }
        );
    }

}


const borrar_tipo_de_cuota = async ( req = request, res = response ) => {


    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Pagos del mes en el club',
            
        }
    );


}

module.exports = {
    obtener_tipos_de_cuota,
    borrar_tipo_de_cuota,
    crear_tipo_de_cuota,
    editar_tipo_de_cuota
    
}