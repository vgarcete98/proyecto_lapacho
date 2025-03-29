const { request, response } = require('express');

const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();



const verificar_edad = async ( req = request, res = response, next )=>{

    try {
        const { idEvento, categorias, idCliente } = req.body;


        let inscripciones_validas = false;
        const cliente = await prisma.cliente.findUnique( { where : { id_cliente : Number(idCliente) } } )
        const cliente_edad = (new Date()).getFullYear - cliente.fecha_nacimiento.getFullYear();
        for (const element of categorias) {
            let { idCategoria } = element;
            let reglas_categoria = await prisma.categorias.findUnique( { where : { 
                                                                            id_categoria : Number(idCategoria)
                                                                        },
                                                                        select : {
                                                                            edad_maxima : true,
                                                                            edad_minima : true
                                                                        } 
                                                                    } );
            if ( reglas_categoria !== null ) {
                if (  cliente_edad >= reglas_categoria.edad  && cliente_edad <= reglas_categoria.edad) {
                    inscripciones_validas = true;
                    break;
                }
            }
        }
        
        if ( inscripciones_validas === true ){

            res.status( 400 ).json( {
                status : false,
                msg : 'Debee verificar una de las inscripciones ya que no cumple con las reglas de la categoria',
                descripcion : `Una inscripcion no cumple con las reglas del evento : edad`
            } ); 
        }else {
            next();
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar la reglas reglas del evento',
            //error
        } );
    }

    
}


const verificar_sexo = async ( req = request, res = response, next )=>{

    try {
        const { idEvento, categorias, idCliente } = req.body;


        let inscripciones_validas = false;
        const cliente = await prisma.cliente.findUnique( { where : { id_cliente : Number(idCliente) } } )
        const cliente_sexo = cliente.sexo;
        for (const element of categorias) {
            let { idCategoria } = element;
            let reglas_categoria = await prisma.categorias.findUnique( { where : { 
                                                                            
                                                                            id_categoria : Number(idCategoria) ,
                                                                        },
                                                                        select : {
                                                                            sexo : true
                                                                        } 
                                                                    } );
            if( reglas_categoria !== null ) {
                console.log( cliente_sexo )
                if ( cliente_sexo !== reglas_categoria.sexo ) {
                    inscripciones_validas = true;
                    break;
                }
            }
        }
        
        if ( inscripciones_validas === true ){

            res.status( 400 ).json( {
                status : false,
                msg : 'Debee verificar una de las inscripciones ya que no cumple con las reglas de la categoria',
                descripcion : `Una inscripcion no cumple con las reglas del evento : sexo`
            } ); 
        }else {
            next();
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar la reglas reglas del evento',
            //error
        } );
    }

    
}




const verificar_nivel = async ( req = request, res = response, next )=>{


    try {
        const { idEvento, categorias, idCliente } = req.body;


        let inscripciones_validas = false;
        const cliente = await prisma.cliente.findUnique( { where : { id_cliente : Number(idCliente) } } )
        const cliente_nivel = cliente.nivel;
        for (const element of categorias) {
            let { idCategoria } = element;
            let reglas_categoria = await prisma.categorias.findUnique( { where : { 
                                                                            id_categoria : Number(idCategoria)
                                                                        },
                                                                        select : {
                                                                            nivel_maximo : true,
                                                                            nivel_minimo : true
                                                                        } 
                                                                    } );
            if ( reglas_categoria !== null ){

                console.log(cliente_nivel);
                if ( cliente_nivel !== null ){
                    
                    if (  cliente_nivel >= reglas_categoria.nivel_minimo  && cliente_nivel <= reglas_categoria.nivel_maximo ) {
                        inscripciones_validas = true;
                        break;
                    }
                }
            }
        }
        
        if ( inscripciones_validas === true ){

            res.status( 400 ).json( {
                status : false,
                msg : 'Debee verificar una de las inscripciones ya que no cumple con las reglas de la categoria',
                descripcion : `Una inscripcion no cumple con las reglas del evento : nivel requerido`
            } ); 
        }else {
            next();
        }

        
    } catch (error) {
        console.log ( error );   
        res.status( 500 ).json( {
            status : false,
            msg : 'No se logro verificar la reglas reglas del evento',
            //error
        } );
    }
    
}








module.exports = {
    verificar_edad,
    verificar_nivel,
    verificar_sexo

}