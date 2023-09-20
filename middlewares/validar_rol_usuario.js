const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const validar_rol_usuario = async ( req = request, res = response, next ) =>{


    const { token_trad } = req;
    //console.log( token_trad );
    const { id_usuario } = token_trad;
    const [ rol_usuario, rest ] = await prisma.$queryRaw`SELECT A.NOMBRE_USUARIO, B.DESCRIPCION_ACCESO
                                                    FROM USUARIO A JOIN ACCESOS_USUARIO B ON A.ID_ACCESO = B.ID_ACCESO
                                                WHERE A.ID_USUARIO = ${ id_usuario };`
    //console.log( rol_usuario );
    const { descripcion_acceso } = rol_usuario;
    //console.log( rol_usuario );  
    if( descripcion_acceso === 'ACCESO_TOTAL' ){
        next(); 
    }else{
        res.status( 400 ).json( {
            msg : "El rol del usuario no es uno valido para la peticion",
            id_usuario
        } )
    }
  
}



module.exports = validar_rol_usuario;