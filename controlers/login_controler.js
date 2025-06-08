
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const { decode } = require('jsonwebtoken');
const prisma = new PrismaClient();

const { generar_token } = require('../helpers/generar_token');
const { encriptar_password, desencriptar_password } = require('../helpers/generar_encriptado');


const login = async ( req = request, res = response )=> {

    const { usuario, contraseña } = req.body;
    try {
        const socio = await prisma.cliente.findFirst( { 
                                                        where : { 
                                                            AND : [
                                                                { nombre_usuario : usuario },
                                                            ]
                                                        } 
                                                    } );
        if ( socio === undefined || socio === null ) { 
            res.status( 400 ).json(
                {
                    status : true,
                    msg : 'No existe el usuario, No se pudo generar el token',
                    //usuario,
                    token : false,
                }
            );
        }else {


            const desencriptado = desencriptar_json(socio.password) ;
            let real ;

            if ( (desencriptado !== "") ){
                real = desencriptado.contraseña;
            }else {
                real = desencriptar_password( socio.password )
            }

            if ( contraseña ===  real ) { 

                const { id_cliente, id_rol_usuario,  } = socio;
                
                const idRolUsuario  = ( typeof( id_rol_usuario ) === 'bigint' )? Number( id_rol_usuario.toString() ) : id_rol_usuario;
    
                const idUsuario = ( typeof( id_socio ) === 'bigint' )? Number( id_socio.toString() ) : id_cliente;
                
                
                const { descripcion_rol } = await prisma.roles_usuario.findUnique( { where : { id_rol_usuario : idRolUsuario } } );
                
                
                const token = await generar_token( idUsuario, idRolUsuario, descripcion_rol );
                res.status( 200 ).json(
                    {
                        status : true,
                        msg : 'Login OK',
                        token,
                        acceso : { 
                            tipoUsuario : descripcion_rol, 
                            descripcionAcceso : "" 
                        }
                    }
                );
            }else {

                res.status( 200 ).json(
                    {
                        status : true,
                        msg : 'Contraseña incorrecta',
                        descripcion : "Ingrese correctamente su contraseña"
                    }
                );
            }

        }
    } catch ( error ) {
        res.status( 500 ).json(
        
            {
                status : false,
                msg : `Ha ocurrido un error al cargar el socio : ${ error }`,
                //mensaje_error : error
            }
    
        );
        
    }
    


}



const desencriptar_json = ( objeto_json = "" )=>{


    try {
        const json = JSON.parse(desencriptar_password( socio.password ));
        return json;
    } catch (error) {

        return "";
        
    }

}


module.exports = {

    login
}