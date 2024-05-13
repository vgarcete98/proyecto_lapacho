const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const obtener_tipos_reserva = async ( req = request, res = response ) => {

    const tipos_reserva = await prisma.$queryRaw`SELECT * FROM Tipo_Reserva`;

    res.status( 200 ).json(

        {
            status : true,
            msj : 'Tipos de reserva en el club',
            tipos_reserva
        }
    );


}


const crear_tipo_reserva = async ( req = request, res = response ) => {

    try {
        
        const { descTipoReserva } = req.body;
    
        const { desc_tipo_reserva, id_tipo_reserva } = await prisma.tipo_reserva.create( { data : { desc_tipo_reserva : descTipoReserva} } );
        res.status( 200 ).json(
    
            {
                status : true,
                msj : 'Tipo de reserva creada',
                tipoReserva : {
                    descTipoReserva : desc_tipo_reserva,
                    idTipoReserva : id_tipo_reserva
                }
            }
    
        );
    } catch (error) {
        console.log ( error );
        res.status( 400 ).json(  
            {
                status : false,
                msj : `No se pudo crear el tipo de reserva ${ error }`,
            }
        );
    }




}



const actualizar_tipo_reserva = async ( req = request, res = response ) => {


    try {
        //const { id_reserva } = req.params;
        const { descTipoReserva, idTipoReserva } = req.body;


        
        const { desc_tipo_reserva, id_tipo_reserva } = await prisma.tipo_reserva.update( { 
                                                                    where : { id_tipo_reserva : idTipoReserva},  
                                                                    data : { desc_tipo_reserva : descTipoReserva }
                                                                } );
    
        res.status( 200 ).json(
    
            {
                status : true,
                msj : 'Tipo de reserva actualizada',
                tipoReserva : {
                    descTipoReserva : desc_tipo_reserva,
                    idTipoReserva : id_tipo_reserva
                }
            }
    
        );
        
    } catch (error) {
        console.log( error );
        res.status( 400 ).json(
    
            {
                status : false,
                msj : `No se pudo actualizar el tipo de reserva : ${error}`,
                //tipo_reserva
            }
    
        );
    }


}




const eliminar_tipo_reserva = async ( req = request, res = response ) => {

    try {
        
        const { id_tipo } = req.params;
        //const { new_desc_tipo_reserva } = req.body;
        const { desc_tipo_reserva, id_tipo_reserva } = await prisma.tipo_reserva.delete( { where : { id_tipo_reserva : Number(id_tipo) } } );

        res.status( 200 ).json(
    
            {
                status : true,
                msj : 'Tipo de reserva Eliminada',
                tipoReserva : {
                    descTipoReserva : desc_tipo_reserva,
                    idTipoReserva : id_tipo_reserva
                }
            }
    
        );
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json(
    
            {
                status : false,
                msj : `No se pudo actualizar el tipo de reserva : ${error}`,
                //tipo_reserva
            }
    
        );
    }

}

module.exports = {

    crear_tipo_reserva,
    actualizar_tipo_reserva,
    eliminar_tipo_reserva,
    obtener_tipos_reserva

}