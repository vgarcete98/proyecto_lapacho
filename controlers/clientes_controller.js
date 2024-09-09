const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient()



const crear_cliente = async ( req = request, res = response ) => {

    try {
        
        const { nombre, apellido, cedula, nroTelefono } = req.body;
        //console.log( req.body );
        const cliente = await prisma.cliente.create( { 
                                                        data : { 

                                                            nombre : nombre,
                                                            apellido,
                                                            cedula,
                                                            numero_telefono : nroTelefono,  
                                                            es_socio : false
                                                        } 
                                                    } );
        res.status( 200 ).json( 
            {
                status : true,
                msj : 'Cliente Creado',
                descripcion :`Cliente ${nombre}, ${apellido} Creado`
            } 
        );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo actualizar al Socio  ${ error }`,
            //error
        } );
    }




}

const obtener_clientes = async ( req = request, res = response ) => {

    try {

        const { nombre, apellido, cedula, pagina, cantidad } = req.query;
        const cliente = await prisma.cliente.findMany( 
                                                        {
                                                            skip : (Number(pagina) - 1) * Number(cantidad),
                                                            take : Number(cantidad),
                                                            where : {
                                                                AND :[
                                                                    nombre ? { nombre: { contains: nombre, mode: 'insensitive' } } : undefined, 
                                                                    apellido ? { apellido: { contains: apellido, mode: 'insensitive' } } : undefined,
                                                                    cedula ? { cedula: { contains: cedula, mode: 'insensitive' } } : undefined,
                                                                ].filter( Boolean )
                                                            }
                                                        },
                                                    );

        const clientes = [];
        cliente.forEach( (element) => { 
                            const { id_cliente, nombre, apellido, cedula } = element;
                            clientes.push( {
                                idCliente : id_cliente,
                                nombre,
                                apellido,
                                cedula
                            } );
                        } );

        res.status( 200 ).json( 
            {
                status : true,
                msj : 'Clientes del Club',
                clientes
            } 
        );

        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo obtener los clientes del club  ${ error }`,
            //error
        } );
    }

}



const actualizar_cliente = async ( req = request, res = response ) => {

    try {


        const { idCliente ,nombre, apellido, cedula, nroTelefono } = req.body;

        const cliente = await prisma.cliente.update( {
                                                        data : {
                                                            nombre,
                                                            apellido,
                                                            cedula,
                                                            numero_telefono : nroTelefono
                                                        },
                                                        where : { id_cliente : Number( idCliente ) }
                                                    } );


        res.status( 200 ).json( 
            {
                status : true,
                msj : 'Cliente Actualizado',
                descripcion :`Cliente ${nombre}, ${apellido} Actualizado`
            } 
        );


    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo actualizar al cliente  ${ error }`,
            //error
        } );
    }

}




const borrar_cliente = async ( req = request, res = response ) => {

    try {

        const { idCliente ,nombre, apellido, cedula, nroTelefono } = req.body;

        const cliente = await prisma.cliente.update( {
                                                        data : {
                                                            nombre,
                                                            apellido,
                                                            cedula,
                                                            numero_telefono : nroTelefono
                                                        },
                                                        where : { id_cliente : Number( idCliente ) }
                                                    } );

        res.status( 200 ).json( 
            {
                status : true,
                msj : 'Cliente Borrado',
                descripcion :`Cliente ${nombre}, ${apellido} Borrado`
            } 
        );
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo actualizar al Socio  ${ error }`,
            //error
        } );
    }

}



module.exports = {
    crear_cliente,
    actualizar_cliente,
    borrar_cliente,
    obtener_clientes
}