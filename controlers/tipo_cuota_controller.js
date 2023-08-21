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


    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Pagos del mes en el club',
            
        }
    );


}


const editar_tipo_de_cuota = async ( req = request, res = response ) => {


    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Pagos del mes en el club',
            
        }
    );


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