const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const obtener_clases_del_dia = async ( req = request, res = response ) =>{


}



const agendar_una_clase = async ( req = request, res = response ) =>{


}

const editar_una_clase = async ( req = request, res = response ) =>{


}



const abonar_una_clase = async ( req = request, res = response ) =>{


}





module.exports = {

    agendar_una_clase,
    editar_una_clase,
    abonar_una_clase,
    obtener_clases_del_dia

}