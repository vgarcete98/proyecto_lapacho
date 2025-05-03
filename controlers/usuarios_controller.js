
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const obtener_usuarios= async ( req = request, res = response ) => {

    try {
        //OBTIENE TODOS LOS ACCESOS CON SUS ACCIONES CORRESPONDIENTES

        const { cedula, pagina, cantidad } = req.query;

        let usuarios = [], 
            cantidad_usuarios = 0;
        
        [usuarios, cantidad_usuarios]= await prisma.$transaction([
            prisma.cliente.findMany( 
                {
                    skip : (Number(pagina) - 1) * Number(cantidad),
                    take : Number(cantidad),
                    select : {
                        nombre_cmp : true,
                        nombre_usuario : true,
                        id_rol_usuario : true,
                        correo_electronico :true,
                        estado_usuario : true,

                    },
                    where : {
                        AND : [

                            { es_socio : true },
                            { nombre_usuario : {
                                not : ""
                                
                            } }
                        ]
                    }
                }
            ),
            prisma.cliente.count( 
                {

                    where : {
                        AND : [

                            { es_socio : true },
                            {
                                nombre_usuario : {
                                    not : ""
                                } 
                            }
                        ]
                    }
                }
            )
            
        ]);

        if (usuarios.length === 0 ){
            res.status( 400 ).json(
                {
                    status : true,
                    msg : 'Accesos para usuarios',
                    usuarios,
                    cantidad : cantidad_usuarios
                }
            );   
        }else {

            res.status( 200 ).json(
                {
                    status : true,
                    msg : 'Accesos para usuarios',
                    usuarios,
                    cantidad : cantidad_usuarios
                }
            );      
        }
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo obtener la lista de Usuarios : ${error}`,
            //error
        } );
        
    }


}




const crear_usuario = async ( req = request, res = response ) => {

    try {
        //OBTIENE TODOS LOS ACCESOS CON SUS ACCIONES CORRESPONDIENTES

        const { cedula, contraseña, nombreUsuario, idCliente, idAcceso } = req.body;

        let usuario = {};

        usuario = await prisma.cliente.update( {
                                                    data : {
                                                        password : contraseña,
                                                        nombre_usuario : nombreUsuario,
                                                        id_rol_usuario : Number( idAcceso )
                                                    },
                                                    where : {
                                                        cedula : cedula
                                                    }
                                                } );
        
        if ( usuario !== null ) {

            res.status( 200 ).json(
                {
                    status : true,
                    msg : 'Usuario creado Exitosamente',
                    descripcion : 'se ha creado al usuario exitosamente'
                }
            );      
        }else {
            res.status( 400 ).json(
                {
                    status : false,
                    msg : 'No se logro crear al usuario',
                    descripcion : 'Ha ocurrido un error al crear al usuario, favor intente de vuelta'
                }
            );
        }
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo crear al usuario : ${error}`,
            //error
        } );
        
    }


}




const editar_usuario = async ( req = request, res = response ) => {

    try {
        //OBTIENE TODOS LOS ACCESOS CON SUS ACCIONES CORRESPONDIENTES

        const { cedula, contraseña, nombreUsuario, idCliente, idAcceso } = req.body;

        let usuario = {};

        usuario = await prisma.cliente.update( {
                                                    data : {
                                                        password : contraseña,
                                                        nombre_usuario : nombreUsuario,
                                                        id_rol_usuario : Number( idAcceso )
                                                    },
                                                    where : {
                                                        cedula : cedula
                                                    }
                                                } );
        
        if ( usuario !== null ) {

            res.status( 200 ).json(
                {
                    status : true,
                    msg : 'Usuario actualizado Exitosamente',
                    descripcion : 'se ha actualizado al usuario exitosamente'
                }
            );      
        }else {
            res.status( 400 ).json(
                {
                    status : false,
                    msg : 'No se logro actualizar al usuario',
                    descripcion : 'Ha ocurrido un error al actualizar al usuario, favor intente de vuelta'
                }
            );
        }
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo crear al usuario : ${error}`,
            //error
        } );
        
    }


}




const eliminar_usuario = async ( req = request, res = response ) => {

    try {
        //OBTIENE TODOS LOS ACCESOS CON SUS ACCIONES CORRESPONDIENTES

        const { nombre, apellido, cedula, pagina, cantidad, es_socio } = req.query;

        let usuarios = [], 
            cantidad_usuarios = 0;
        
        [usuarios, cantidad_usuarios]= await prisma.$transaction([
            prisma.cliente.findMany( 
                {
                    select : {
                        nombre_cmp : true,
                        nombre_usuario : true,
                        id_rol_usuario : true,
                        correo_electronico :true,
                        estado_usuario : true,

                    },
                    where : {
                        AND : [

                            { es_socio : true },
                            { nombre_usuario : {
                                not : null
                                
                            } }
                        ]
                    }
                }
            ),
            prisma.cliente.count( 
                {

                    where : {
                        AND : [

                            { es_socio : true },
                            { nombre_usuario : {
                                not : null
                                
                            } }
                        ]
                    }
                }
            )
            
        ]);

        res.status( 200 ).json(
            {
                status : true,
                msg : 'Accesos para usuarios',
                accesosDisponibles
            }
        );      
    } catch (error) {
        //console.log ( error );

        res.status( 500 ).json( { 
            status : false,
            msg : `No se pudo obtener la lista de roles : ${error}`,
            //error
        } );
        
    }


}

module.exports = {

    obtener_usuarios,
    crear_usuario, 
    editar_usuario,
    eliminar_usuario
}


