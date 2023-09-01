const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const generar_pase_jugador = async ( req = request, res = response ) =>{


}



const obtener_pases_pendientes = async ( req = request, res = response ) =>{


}


const obtener_pases_completados = async ( req = request, res = response ) =>{


}


const abonar_pase_jugador = async ( req = request, res = response ) =>{


}




module.exports = {
    abonar_pase_jugador,
    generar_pase_jugador,
    obtener_pases_completados,
    obtener_pases_pendientes
}