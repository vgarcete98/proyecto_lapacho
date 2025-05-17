const { request, response } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const verificar_precio_clase_profesor = async ( req = request, res = response, next ) =>{

    try {
        


        const { idProfesor } = req.body;
        

        const precio_profesor = await prisma.precio_clase.findFirst( { 
                                                                        where : { 
                                                                            AND : [
                                                                                { id_profesor : Number( idProfesor ) },
                                                                                { valido : true }
                                                                            ]
                                                                            
                                                                        } 
                                                                    } )
        if ( precio_profesor !== null ){
            next();
            
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'Debe de generar el precio para las clases de ese profesor',
                descripcion : `No existe un precio establecido para la clase con ese profesor`
            } ); 
        }



    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se logro verificar el precio correspondiente para esa clase ${ error }`,
            //error
        } );
    }


}



module.exports = { 
    verificar_precio_clase_profesor
}



