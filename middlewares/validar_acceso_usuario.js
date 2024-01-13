
//AQUI ME FIJO SI ES QUE EL USUARIO TIENE ACCESO A ESA RUTA


const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

const comprobar_acceso_ruta = async (req = request, res = response, next) => {

    const tipo = req.method, ruta = req.url
    var acceso_valido = false;
    const { id_usuario } = req.token_trad ;
    const accesos_ruta_usuario = await prisma.$queryRaw`SELECT D.PATH_RUTA
                                                            FROM ACCESOS_USUARIO A JOIN roles_usuario B ON B.id_rol_usuario = A.id_rol_usuario
                                                            JOIN RUTAS_HABILITADAS_ROL F ON F.id_rol_usuario = B.id_rol_usuario
                                                            JOIN RUTAS_APP D ON D.id_ruta_app = F.id_ruta_app
                                                            JOIN tipos_ruta_app C ON C.id_tipo_ruta_app = D.id_tipo_ruta_app
                                                            JOIN socio G on G.id_acceso_socio = A.id_acceso
                                                        WHERE G.id_socio = ${ id_usuario }`;
    for (const acceso in accesos_ruta_usuario) {

        if(acceso.path_ruta === ruta ){
            acceso_valido = true;
            break;
        }
    }


    (acceso_valido === true) ? next() : res.status( 400 ).json( { msg : "El usuario no tiene acceso a esa ruta" } );
    
}




module.exports = { comprobar_acceso_ruta };






