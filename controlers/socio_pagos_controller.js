const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const obtener_pagos_x_mes = async ( req = request, res = response ) => {


    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Pagos del mes en el club',
            
        }
    );


}


const obtener_pagos_x_socio= async ( req = request, res = response ) => {


    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Pagos del mes en el club',
            
        }
    );


}



const realizar_pago_socio = async ( req = request, res = response ) => {


    res.status( 200 ).json(

        {
            status : 'OK',
            msj : 'Pagos del mes en el club',
            
        }
    );


}






module.exports = {
    obtener_pagos_x_mes,
    obtener_pagos_x_socio,
    realizar_pago_socio
    
}



