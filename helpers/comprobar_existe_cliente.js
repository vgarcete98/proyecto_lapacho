const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();



const comprobar_existe_cliente = async ( cedula = "" )=> {

    try {
        
        const cliente = await prisma.cliente.findFirst( { 
                                                            where : {
                                                                AND : [
                                                                    { cedula : cedula},
                                                                    { es_socio : false }
                                                                ]      
                                                            }
                                                        } )
        
        if ( cliente === null ) {
            return false;
        }else {
            return true;
        }                                                     


    } catch (error) {
        console.log( "No se logro encontrar al cliente buscado" );
        throw new Error( "Error al buscar al cliente " + error );        
    }


}






const comprobar_existe_cliente_no_socio = async ( cedula = "" )=> {

    try {
        
        const cliente = await prisma.cliente.findFirst( { 
                                                            where : {
                                                                AND : [
                                                                    { cedula : cedula},
                                                                    { es_socio: false}
                                                                ]      
                                                            }
                                                        } )
        
        if ( cliente === null ) {
            return false;
        }else {
            return true;
        }                                                     


    } catch (error) {
        console.log( "No se logro encontrar al cliente buscado" );
        throw new Error( "Error al buscar al cliente " + error );        
    }


}



module.exports = { comprobar_existe_cliente, comprobar_existe_cliente_no_socio };