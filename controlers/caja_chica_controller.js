const { request, response } = require('express')

var { format  } = require("date-fns");

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient();


const crear_caja_chica = async ( req = request, res = response ) =>{


    try {

        const { montoInicial, montoActual, estadoCaja, id_usuario } = req.body;


        const caja_chica = await prisma.caja_chica.create( { 
                                                                data : {  
                                                                    monto_inicial : Number( montoInicial ),
                                                                    monto_actual : Number( montoActual ),
                                                                    estado : estadoCaja,
                                                                    id_socio : Number(id_usuario),
                                                                    fecha_creacion : new Date()
                                                                } 
                                                        } );


        const { estado, fecha_creacion, id_caja_chica, id_socio, monto_actual, monto_inicial } = caja_chica;

        res.status( 200 ).json( {
            status : true,
            msg : `Caja chica Creada`,
            cajaChica : {
                estado, 
                fechaCreacion : fecha_creacion, 
                idCajaChica : id_caja_chica, 
                idSocio : id_socio, 
                montoActual : monto_actual, 
                montoInicial : monto_inicial
            }
            //error
        } );
        
    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al crear la caja chica : ${ error }`,
            //error
        } );

    }

}


const registrar_gasto_caja_chica = async ( req = request, res = response ) =>{


    try {

        
    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar la reserva : ${ error }`,
            //error
        } );

    }

}



const registrar_reposicion_caja_chica = async ( req = request, res = response ) =>{


    try {

        
    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar la reserva : ${ error }`,
            //error
        } );

    }

}



const obtener_gastos_caja_chica = async ( req = request, res = response ) =>{


    try {

        
    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar la reserva : ${ error }`,
            //error
        } );

    }

}




const obtener_reposiciones_caja_chica = async ( req = request, res = response ) =>{


    try {

        
    } catch (error) {
        //console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al eliminar la reserva : ${ error }`,
            //error
        } );

    }

}




module.exports = {
    crear_caja_chica,
    registrar_gasto_caja_chica,
    obtener_gastos_caja_chica,
    obtener_reposiciones_caja_chica,
    registrar_reposicion_caja_chica

};
