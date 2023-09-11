const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const validar_usuario_administrador = async ( req = request, res = response, next ) =>{

    const { token_trad } = req;

    const { id_usuario } = token_trad;

    const [ rol_usuario, rest ] = await prisma.$queryRaw`SELECT A.NOMBRE_USUARIO, B.DESCRIPCION_ACCESO
                                                            FROM USUARIO A JOIN ACCESOS_USUARIO B ON A.ID_ACCESO = B.ID_ACCESO
                                                        WHERE A.ID_USUARIO = ${ id_usuario };`

    const { descripcion_acceso } = rol_usuario;
    //console.log( rol_usuario );  
    if( descripcion_acceso === 'ACCESO_TOTAL' ){
        next(); 
    }else{
        res.status( 400 ).json( {
            msg : "El rol del usuario no es uno valido para la peticion",
            descripcion_acceso
        } )
    }

}


const validar_usuario_socio = async ( req = request, res = response, next ) =>{

    const { token_trad } = req;

    const { id_usuario } = token_trad;

    const [ rol_usuario, rest ] = await prisma.$queryRaw`SELECT A.NOMBRE_USUARIO, B.DESCRIPCION_ACCESO
                                                            FROM USUARIO A JOIN ACCESOS_USUARIO B ON A.ID_ACCESO = B.ID_ACCESO
                                                        WHERE A.ID_USUARIO = ${ id_usuario };`

    const { descripcion_acceso } = rol_usuario;
    //console.log( rol_usuario );  
    if( descripcion_acceso === 'ACCESO_NORMAL' ){
        next(); 
    }else{
        res.status( 400 ).json( {
            msg : "El rol del usuario no es uno valido para la peticion",
            descripcion_acceso
        } )
    }

}


const validar_usuario_profesor = async ( req = request, res = response, next ) =>{

    const { token_trad } = req;

    const { id_usuario } = token_trad;

    const [ rol_usuario, rest ] = await prisma.$queryRaw`SELECT A.NOMBRE_USUARIO, B.DESCRIPCION_ACCESO
                                                            FROM USUARIO A JOIN ACCESOS_USUARIO B ON A.ID_ACCESO = B.ID_ACCESO
                                                        WHERE A.ID_USUARIO = ${ id_usuario };`

    const { descripcion_acceso } = rol_usuario;
    //console.log( rol_usuario );  
    if( descripcion_acceso === 'ACCESO_PROFESOR' ){
        next(); 
    }else{
        res.status( 400 ).json( {
            msg : "El rol del usuario no es uno valido para la peticion",
            descripcion_acceso
        } )
    }

}






module.exports = { validar_usuario_administrador, validar_usuario_profesor, validar_usuario_socio }