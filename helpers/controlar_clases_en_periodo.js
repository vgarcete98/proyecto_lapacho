const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();



const controlar_clases_en_periodo = async (req = request, res = response, next)=>{



    try {
        const { inicio, fin, idProfesor } = req.body;
        
        const clases_profesor = await prisma.agendamiento_clase.count( { 
                                                                            where : {
                                                                                AND : [
                                                                                    { inicio : { gte : new Date( inicio ) } },
                                                                                    { fin : { lte : new Date( fin ) } },
                                                                                    { id_profesor : Number( idProfesor ) }
                                                                                ]
                                                                            } 
                                                                        } );        

        if ( clases_profesor = 0 ){
                res.status( 400 ).json(
                    {
                        status : true,
                        msg : 'El periodo Seleccionado de Clases no tiene clases para procesar',
                        descripcion : `El periodo Seleccionado de Clases ${inicio} a ${fin} notiene clases para procesar`
                    }
                );
        }else {
            next();
        }                                                              

    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `Ocurrio un error al generar la venta para cobro de clases del profesor ${ error }`,
            //error
        } );
    }
}






module.exports = {
    controlar_clases_en_periodo
}