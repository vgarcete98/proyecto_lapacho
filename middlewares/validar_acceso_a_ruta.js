const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');


const validar_acceso_a_ruta = async (req = request, res = response, next)=>{


    try {
        //console.log( req.path );
        if (req.path === '/auth/login') {
            next()
        } else {

            const { x_token } = req.headers;
            //console.log( x_token );
            const payload = jwt.verify( x_token,process.env.SECRET0RPR1VAT3K3Y );
            //console.log ( payload );
            req.token_trad = payload;

            const { token_trad } = req;

            const { id_usuario } = token_trad;                
            
            const resultado = await prisma.$queryRaw`SELECT D.PATH_RUTA AS ruta
                                                        FROM ACCESOS_USUARIO A JOIN roles_usuario B ON B.id_rol_usuario = A.id_rol_usuario
                                                        JOIN RUTAS_HABILITADAS_ROL F ON F.id_rol_usuario = B.id_rol_usuario
                                                        JOIN RUTAS_APP D ON D.id_ruta_app = F.id_ruta_app
                                                        JOIN tipos_ruta_app C ON C.id_tipo_ruta_app = D.id_tipo_ruta_app
                                                        JOIN socio G on G.id_acceso_socio = A.id_acceso
                                                    WHERE G.id_socio = ${ id_usuario } `;

            var comprobado = false;
            resultado.forEach(element => {
                const { ruta } = element;
                //console.log( ruta );
                if ( ruta === req.path ){
                    comprobado = true;
                }

            });
            if (!comprobado) throw new Error( "El usuario no tiene el acceso a ese recurso" );
        
            next()                                 
        }


    } catch (error) {
        res.status(500).json( 
            {
                status : false,
                msj : `Ha ocurrido un error al comprobar las rutas del usuario :  ${ error }` ,
                //nuevo_tipo_socio
            }
        );                
    }






}


module.exports =  { validar_acceso_a_ruta };
