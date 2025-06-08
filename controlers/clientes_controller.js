const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { generar_fecha } = require('../helpers/generar_fecha');

const prisma = new PrismaClient()



const crear_cliente = async ( req = request, res = response ) => {

    try {
        
        const { nombre, apellido, cedula, nroTelefono } = req.body;
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
                msg : 'Cliente Creado',
                descripcion :`Cliente ${nombre}, ${apellido} Creado`
            } 
        );

    } catch (error) {
        
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo crear al cliente  ${ error }`,
            //error
        } );
    }




}

const obtener_clientes = async ( req = request, res = response ) => {

    try {

        const { nombre, apellido, cedula, pagina, cantidad, es_socio } = req.query;


        let cantidad_clientes = 0;
        let cliente = [];

        [ cliente, cantidad_clientes ] = await prisma.$transaction( [  
            prisma.cliente.findMany( 
                {
                    skip : (Number(pagina) - 1) * Number(cantidad),
                    take : Number(cantidad),
                    where : {
                        AND :[
                            nombre ? { nombre: { contains: nombre, mode: 'insensitive' } } : undefined, 
                            apellido ? { apellido: { contains: apellido, mode: 'insensitive' } } : undefined,
                            cedula ? { cedula: { contains: cedula, mode: 'insensitive' } } : undefined,
                            es_socio ? { es_socio : ( es_socio === "true" ) } : undefined,
                        ].filter( Boolean )
                    }
                },
            ),
            prisma.cliente.count( 
                {
                    where : {
                        AND :[
                            nombre ? { nombre: { contains: nombre, mode: 'insensitive' } } : undefined, 
                            apellido ? { apellido: { contains: apellido, mode: 'insensitive' } } : undefined,
                            cedula ? { cedula: { contains: cedula, mode: 'insensitive' } } : undefined,
                            es_socio ? { es_socio : ( es_socio === "true" ) } : undefined,
                        ].filter( Boolean )
                    }
                },
            )
        ] );


        if (cantidad_clientes == 0 ){
            //HAY QUE RETORNAR UN STATUS 400 EN TODO CASO

            res.status( 400 ).json( 
                {
                    status : false,
                    msg : 'Clientes del Club',
                    //clientes
                } 
            );


        }else {

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
                    msg : 'Clientes del Club',
                    clientes,
                    cantidad : cantidad_clientes
                } 
            );
        }

        
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
                msg : 'Cliente Actualizado',
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
                msg : 'Cliente Borrado',
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