const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const validar_rol_usuario = async ( req = request, res = response, next ) =>{

    // ESTA FUNCION VALIDA SI EL USUARIO ES UN USUARIO ADMIN PARA REALIZAR PETICIONES
    const { token_trad } = req;
    
    const { id_usuario } = token_trad;
    //----------------------------------------------------------------------------------------------------------------------------
    /*const [ rol_usuario, rest ] = await prisma.$queryRaw`SELECT A.NOMBRE_USUARIO, B.DESCRIPCION_ACCESO
                                                    FROM SOCIO A JOIN ACCESOS_USUARIO B ON A.ID_ACCESO_SOCIO = B.ID_ACCESO
                                                WHERE A.ID_SOCIO = ${ id_usuario };`*/
    //----------------------------------------------------------------------------------------------------------------------------
    const idUsuario = id_usuario;
    const usuario = await prisma.socio.findUnique( { 
                                                        where : { id_socio : idUsuario },
                                                        /*select : { 
                                                            nombre_usuario : true,
                                                            id_acceso : true
                                                            //descripcion_acceso : true
                                                        },*/
                                                        include: { accesos_usuario : true }
                                                        
                                                    } );
    

     

    const { descripcion_acceso } = usuario.accesos_usuario;




    
    if( descripcion_acceso === 'ACCESO_TOTAL' ){
        next(); 
    }else{
        res.status( 400 ).json( {
            status : false, 
            msg : `El rol del usuario no es uno valido para la peticion ${ id_usuario }`,
        } )
    }
  
}






module.exports = validar_rol_usuario;