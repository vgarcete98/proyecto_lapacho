const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



const validar_existe_socio = async ( req = request, res = response, next ) =>{

    try {

        // primero la cabecera
        let clientesExistentes = [];
        const { cedula, ruc } = req.body;
        const persona = await prisma.cliente.findFirst( { where : { cedula } } );
        //console.log( persona );
        
        if ( persona !== null && persona !== undefined ) {
            const { nombre, apellido, fecha_nacimiento } = persona;
            clientesExistentes.push( {
                nombre, 
                apellido, 
                fecha_nacimiento,
                cedula
            } );
        }else {
                        //HAGO UNA VALIDACION MAS PARA QUE LOS DEPENDIENTES DEL SOCIO NO SE REPITAN
            const { dependientes } = req.body;

            if (dependientes.lenght !== 0 ) {
                for (let dependiente in dependientes ) {
                    const { cedula } = dependientes[dependiente];
                    const dep = await prisma.cliente.findFirst( { where : { cedula } } );       
                    if ( dep !== null && persona !== undefined  ){
                        const { nombre, apellido, fecha_nacimiento } =  dependientes[dependiente];
                        clientesExistentes.push( 
                            {
                                nombre, 
                                apellido, 
                                fecha_nacimiento,
                                cedula
                            }
                        );
                    }
                }
            
            }
        }

        if (clientesExistentes.length !== 0 ){ 

            res.status( 400 ).json({

                status : false,
                msg : 'Ya existen estos clientes, No se pueden agregar',
                clientesExistentes
            })
        }else {

            next();
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un socio repetido',
            //persona
        } );
    }


    
}


const comprobar_existe_socio = async ( req = request, res = response, next ) =>{

    
    try {
        const { cedula, ruc } = req.query;
        const persona = await prisma.persona.findFirst( { where : { cedula } } );
        //console.log( persona );
        
        if ( persona === null || persona === undefined ) {
            // QUIERE DECIR QUE NO SE ENCONTRO POR TANTO NO EXISTE
            const { nombre, apellido, fecha_nacimiento } = persona;
            res.status( 400 ).json( {
                status : false,
                msg : 'No existe un socio con esos datos',
                cedula,
                ruc
            } );
        }else {
            next();
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un socio repetido',
            //persona
        } );
    }


    
}


const comprobar_existe_socio_id = async ( req = request, res = response, next ) =>{

    
    try {
        const { idSocio } = req.body;
        const socio = await prisma.socio.findFirst( { where : { id_socio : Number( idSocio ) } } );
        //console.log( persona );
        
        if ( persona === null || persona === undefined ) {
            // QUIERE DECIR QUE NO SE ENCONTRO POR TANTO NO EXISTE
            const { nombre, apellido, fecha_nacimiento } = persona;
            res.status( 400 ).json( {
                status : false,
                msg : 'No existe un socio con esos datos',
                cedula,
                ruc
            } );
        }else {
            next();
        }

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo verificar que haya un socio repetido ${ error }`,
            //persona
        } );
    }


    
}






module.exports = { validar_existe_socio, comprobar_existe_socio };
