const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();






const obtener_cantidad_registros_query = async ( query = '' )=>{


    const query_cantidad_registros = `SELECT COUNT (*)::INTEGER AS total FROM (${query}) AS X`;


    const [cantidad,...resto] = await prisma.$queryRawUnsafe( query_cantidad_registros );
    console.log( cantidad );

    const { total } = cantidad;
    
    return total;

}




module.exports = {  
    obtener_cantidad_registros_query
}