
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();




const cargar_gasto_club = async ( req = request, res = response ) =>{

    const { id_tipo_pago,
            id_usuario,
            nro_factura,
            descripcion,
            monto_gasto,
            ingresoXegreso } = req.body;





}

const obtener_gastos_x_mes = async ( req = request, res = response ) =>{


    
}


const editar_gasto_club = async ( req = request, res = response ) =>{






    
}








module.exports = {

    obtener_gastos_x_mes,
    cargar_gasto_club ,
    editar_gasto_club
}


