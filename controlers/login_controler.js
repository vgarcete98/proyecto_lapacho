
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const { generar_token } = require( '../helpers/generar_token' )


const login = async ( req = request, res = response )=> {

    const { usuario, contraseña } = req.body;
    
    try {
        const consulta_usuario = await prisma.$queryRaw`SELECT CAST ( id_socio AS INTEGER ) AS id_usuario, 
                                                                CAST ( id_acceso_socio AS INTEGER ) AS id_acceso,
                                                                tipo_usuario, nombre_usuario, contrasea 
                                                            FROM  public.Socio
                                                        WHERE nombre_usuario = ${ usuario } AND contrasea = ${ contraseña }`;
        //console.log( consulta_usuario.lenght() );
        if ( consulta_usuario.length === 0 ) { 
            res.status( 400 ).json(
                {
                    status : true,
                    msj : 'No existe el usuario, No se pudo generar el token',
                    //usuario,
                    token : false,
                }
            );
        }else {
            //console.log ( consulta_usuario );
            const [ primer_resultado, ...resto ] = consulta_usuario;
            const { id_usuario, tipo_usuario, id_acceso } = primer_resultado;

            const token = await generar_token( id_usuario, id_acceso );

            const consulta_acceso = await prisma.accesos_usuario.findUnique( { where : { id_acceso  } } );
            const { descripcion_acceso } = consulta_acceso
            //console.log ( consulta_acceso );
            res.status( 200 ).json(
                {
                    status : true,
                    msj : 'Login OK',
                    //usuario,
                    token,
                    acceso : { tipo_usuario, descripcion_acceso }
                }
            );
        }
    } catch ( error ) {
        console.log ( "Ha ocurrido un error al realizar la consulta " + error );
        res.status( 500 ).json(
        
            {
                status : false,
                msj : 'Ha ocurrido un error al realizar la consulta, No se pudo generar el token',
                //mensaje_error : error
            }
    
        );
        
    }
    


}



module.exports = {

    login
}