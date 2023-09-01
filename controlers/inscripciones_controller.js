
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const inscribirse_a_evento = async ( req = request, res = response ) =>{


}


const editar_inscripcion = async ( req = request, res = response ) =>{


}



const abonar_x_inscripcion = async ( req = request, res = response ) =>{


}



module.exports = {

    abonar_x_inscripcion,
    editar_inscripcion,
    inscribirse_a_evento
}