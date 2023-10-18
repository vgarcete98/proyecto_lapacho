const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();

const estado_pases = {

    pendiente_pago : 1,
    pendiente_federacion : 2,
    suspendido : 3,
    realizado : 4
}

const comprobar_traspaso_activo = async ( req = request, res = response, next )=> {

    const { idSocio } = req.body;
    try {
        const traspaso = await prisma.pases_socio.findFirst( { 
                                                                where : { 
                                                                    id_socio : idSocio, 
                                                                                                                                            
                                                                    AND : [ 
                                                                        { abonado : false }, 
                                                                        
                                                                    ], 
                                                                    NOT : [ { estado_pase_socio : 4 } ]
                                                                },
                                                                 
                                                            } );
        const { id_club_habilitado } = traspaso;
        const idClubhabilitado = id_club_habilitado;
        const club = await prisma.clubes_habilitados.findFirst( { where : { id_club_habilitado : idClubhabilitado } } );
        
        if ( traspaso === null || traspaso === undefined ){
            next()
        }else {
            //console.log( traspaso )
            const { nombre_club_habilitado } = club;
            res.status( 400 ).json( {
                status : false,
                msg : `Ya existe un pase pendiente que el socio debe de abonar al ${ nombre_club_habilitado } `,
                //existe
            } );
        }

    } catch (error) {
        
        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "Ha ocurrido un error al buscar un pase de ese socio",
            //existe
        } );
    }

}



module.exports = comprobar_traspaso_activo;