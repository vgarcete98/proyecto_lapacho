const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



const validar_existe_socio = async ( req = request, res = response, next ) =>{

    try {

        // primero la cabecera
        let clientesExistentes = [];
        const { cedula, ruc, dependientes } = req.body;
        const persona = await prisma.cliente.findFirst( 
                                                        { 
                                                            where : { 
                                                                    AND : [
                                                                        { cedula : cedula },
                                                                        { es_socio : true }
                                                                    ]      
                                                                    } 
                                                        } );
        
        if ( persona !== null ) {
            const { nombre, apellido, fecha_nacimiento } = persona;
            clientesExistentes.push( {
                nombre, 
                apellido, 
                fecha_nacimiento,
                cedula
            } );
            res.status( 400 ).json({
    
                status : false,
                msg : 'Ya existe este cliente, No se pueden agregar',
                decripcion : `Ya existe este cliente, No se pueden agregar : ${ persona }`
            })
        }else {
            next();
        }

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un socio repetido',
            //persona
        } );
    }


    
}




const validar_existe_socio_usuario = async ( req = request, res = response, next ) =>{

    try {

        // primero la cabecera
        let clientesExistentes = [];
        const { cedula, ruc, dependientes } = req.body;
        const persona = await prisma.cliente.findFirst( 
                                                        { 
                                                            where : { 
                                                                    AND : [
                                                                        { cedula : cedula },
                                                                        { es_socio : true }
                                                                    ]      
                                                                    } 
                                                        } );
        
        if ( persona !== null ) {
            next();
        }else {
            res.status( 400 ).json({
    
                status : false,
                msg : 'Ese Cliente No existe no se puede crear un usuario',
                decripcion : `Ese Cliente No existe o no es socio no puede tener un usuario`
            })
        }
    } catch (error) {
        //console.log( error );
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
        const persona = await prisma.cliente.findFirst( { 
                                                            where : {
                                                                         AND : [
                                                                            { cedula : cedula },
                                                                            { es_socio : true }
                                                                         ] 
                                                                    },
                                                        } );
        //console.log( persona );
        
        if ( persona === null || persona === undefined ) {
            // QUIERE DECIR QUE NO SE ENCONTRO POR TANTO NO EXISTE
            const { nombre, apellido, fecha_nacimiento } = persona;
            res.status( 400 ).json( {
                status : true,
                msg : 'Ya existe un socio con esos datos',
                descripcion : `Datos del socio existente: ${nombre}, ${ apellido } `
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






const validar_existe_socio_y_dependientes = async ( req = request, res = response, next ) =>{

    try {

        // primero la cabecera
        let clientesExistentes = [];
        const { cedula, ruc, dependientes } = req.body;
        const persona = await prisma.cliente.findFirst( 
                                                        { 
                                                            where : { 
                                                                    AND : [
                                                                        { cedula : cedula },
                                                                        { es_socio : true }
                                                                    ]      
                                                                    } 
                                                        } );
        
        if ( persona !== null ) {

            if (dependientes.lenght !== 0 ) {
                for (let dependiente in dependientes ) {
                    const { cedula } = dependientes[dependiente];
                    const dep = await prisma.cliente.findFirst( { 
                                                                    where : 
                                                                        {
                                                                            AND : [
                                                                                { cedula : cedula},
                                                                                { es_socio : true }
                                                                            ]      
    
                                                                        }
                                                                    
                                                                } );       
                    if ( dep !== null ){
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
        }else {
            res.status( 400 ).json({

                status : false,
                msg : 'ese Cliente no existe, no se pueden agregar sus dependientes',
                decripcion : `Clientes Existentes : ${ persona }`
            })
        }

        if (clientesExistentes.length !== 0 ){ 

            let clientes =  ``;

            for (let clave in clientesExistentes) {
                clientes += ` ${ clientesExistentes[clave].nombre }, ${ clientesExistentes[clave].apellido };`;
            }

            res.status( 400 ).json({

                status : false,
                msg : 'Ya existen estos clientes, No se pueden agregar',
                decripcion : `Clientes Existentes : ${ clientes }`
            })
        }else {

            next();
        }

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un socio repetido',
            //persona
        } );
    }


    
}



module.exports = { validar_existe_socio, comprobar_existe_socio, validar_existe_socio_y_dependientes, validar_existe_socio_usuario };
