const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const schedule = require('node-schedule');


const cron_job_genera_cuotas_anio = async (  ) => { 

    try {
        
        const carga_cuotas = await prisma.$executeRawUnsafe( ' CALL genera_cuotas_annio()' );

        if ( carga_cuotas > 0 ) {
            console.log( `PROCEDIMIENTO EJECUTADO CON EXITO` );
        }else {
            console.log( `EL PROCEDIMIENTO NO INSERTO FILAS` );
        }

    } catch (error) {
        //console.log( error );
        console.log( `No se logro ejecutar el procedimiento de carga de cuotas : ${ error }` );
    }



}



module.exports = {cron_job_genera_cuotas_anio}