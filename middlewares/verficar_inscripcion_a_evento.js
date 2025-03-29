const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express')
const prisma = new PrismaClient();


const verificar_inscripcion_a_evento = async ( req = request, res = response, next )=>{

    try {

        const { categorias, idCliente } = req.body;

        let categorias_registradas = [];
        let inscripcion_comprobada = false;
        try {

            for (const element of categorias) {
                
                let { idCategoria, idEvento } = element;
                let inscripciones_registradas = await prisma.inscripciones.findFirst( { 
                                                                                            where : { 
                                                                                                AND : [
                                                                                                    { id_cliente : Number( idCliente ) },
                                                                                                    { id_evento : Number( idEvento ) },
                                                                                                    { id_categoria : Number( idCategoria ) }
                                                                                                ]
                                                                                            } 
                                                                                        } );
                if ( inscripciones_registradas !== null &&  inscripciones_registradas !== undefined) {
                    let categoria = await prisma.categorias.findUnique( { where : { id_categoria : Number( idCategoria ) } } );
                    categorias_registradas.push( categoria.descripcion );
                    inscripcion_comprobada = true;
                    //break;
                }
            }

        } catch (error) {
            console.log( error );
        }

        if ( inscripcion_comprobada === false ){

            next();
        }else {
            res.status( 400 ).json( {
                status : false,
                msg : 'Al menos una inscripcion ya se ha registrado en el sistema',
                descripcion : `Ya se ha registrado la inscripcion a la categoria : ${ categorias_registradas }`
            } ); 
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar la inscripcion al evento disponible',
            //error
        } );
    }

    
}

module.exports = {
    verificar_inscripcion_a_evento,

}









