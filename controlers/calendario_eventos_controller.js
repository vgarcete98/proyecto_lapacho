const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();





const asignar_evento_calendario = async ( req = request, res = response ) =>{

    // CREA UN NUEVO EVENTO EN EL CALENDARIO

}



const obtener_eventos_x_fecha_calendario = async ( req = request, res = response ) =>{

    // OBTIENE TODOS LOS EVENTOS DEL MES EN EL CALENDARIO




}




const obtener_eventos_calendario = async ( req = request, res = response ) =>{

    // OBTIENE TODOS LOS EVENTOS DEL AÑO




}


const borrar_evento_calendario = async ( req = request, res = response ) =>{






}


const actualizar_evento_calendario = async ( req = request, res = response ) =>{






}





module.exports = {
    asignar_evento_calendario,
    obtener_eventos_calendario,
    borrar_evento_calendario,
    actualizar_evento_calendario,
    obtener_eventos_x_fecha_calendario

}