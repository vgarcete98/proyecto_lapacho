
const { request, response, query } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



/*
id_inscripcion AS "idInscripcion", 
id_socio AS "idSocio", 
id_evento_calendario AS "idEventoCalendario", 
desc_inscripcion AS "descInscripcion", 
fecha_inscripcion AS "fechaInscripcion", 
abonado AS "abonado", 
inscripcioncreadoen AS "inscripcionCreadoEn", 
estadoinscripcion AS "estadoInscripcion", 
inscripcioneditadoen AS "inscripcionEditadoEn"
*/


const inscribirse_a_evento = async ( req = request, res = response ) =>{
    
    try {
        
        // NECESITO REGISTRAR UNA INSCRIPCION 
        // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
        const { idSocio, idEvento, montoAbonado, categorias } = req.body;

        let cat = [];
        let nuevaInscripcion = [];
        
        for (const element of categorias) {
            
            const { idCategoria } = element;
            const { abonado, desc_inscripcion, estadoinscripcion, 
                    fecha_inscripcion, id_evento_calendario, id_inscripcion,
                    id_socio, inscripcioncreadoen, inscripcioneditadoen, id_categoria } = await prisma.inscripciones.create( { 
                                                                            data : {
                                                                                id_socio : idSocio,
                                                                                id_evento_calendario : idEvento,
                                                                                abonado : montoAbonado,
                                                                                inscripcioncreadoen : new Date(),
                                                                                id_categoria : Number( idCategoria )
                                                                            } 
                                                                        } );
            
            const { nombre_cmp, nombre, apellido } = await prisma.socio.findUnique( 
                                                                    {
    
                                                                        where : { id_socio : Number( idSocio ) } ,
                                                                        include : {  
                                                                            persona : {
                                                                                select : {
                                                                                    apellido : true ,
                                                                                    nombre : true
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                );
            const { nombre_categoria   } = await prisma.categorias.findUnique( { where : { id_categoria  :  Number(idCategoria)} } );

            nuevaInscripcion.push( {
                "idInscripcion" : id_inscripcion , 
                "idSocio" : id_socio , 
                "idEventoCalendario" : id_evento_calendario, 
                "descInscripcion" : desc_inscripcion , 
                "fechaInscripcion" :fecha_inscripcion , 
                "abonado" : abonado , 
                "inscripcionCreadoEn" : inscripcioncreadoen, 
                "estadoInscripcion" : estadoinscripcion, 
                "inscripcionEditadoEn" : inscripcioneditadoen,
                "nombreSocio" : nombre_cmp,
                categoria : { 
                    idCategoria,
                    nombreCategoria : nombre_categoria
                }

            } )
        }




        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion registrada",
            nuevaInscripcion 
        } );        
        


    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo ingresar el registro  ${ error }`,
            //nueva_inscripcion,
            //error

        } );
    }


}


const inscribirse_a_evento_no_socios = async ( req = request, res = response ) =>{

    try {
        // NECESITO REGISTRAR UNA INSCRIPCION 
        const { idEvento, nombreJugador, montoAbonado, categorias  } = req.body;
        
        // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
        
        let cat = [];
        let nuevaInscripcion = [];
         
        for (const element of categorias) {
            const { idCategoria } = element;
            const { abonado, desc_inscripcion, editadoen,
                    estado_inscripcion, fecha_inscripcion, 
                    id_evento_calendario_no_socio , id_inscripcion_no_socio, id_categoria } = await prisma.inscripciones_no_socios.create( { 
                                                                                        data : {
                                                                                            id_evento_calendario_no_socio : idEvento,
                                                                                            nombre_jugador : nombreJugador,
                                                                                            abonado : montoAbonado,
                                                                                            fecha_inscripcion : new Date() ,
                                                                                            id_categoria : Number( idCategoria )
    
                                                                                        } 
                                                                                    } );
            const { nombre_categoria   } = await prisma.categorias.findUnique( { where : { id_categoria  :  Number(idCategoria)} } );
            nuevaInscripcion.push( {
                "idInscripcion" : id_inscripcion_no_socio , 
                "idSocio" : id_socio , 
                "idEventoCalendario" : id_evento_calendario_no_socio, 
                "descInscripcion" : desc_inscripcion , 
                "fechaInscripcion" :fecha_inscripcion , 
                "abonado" : abonado , 
                "inscripcionCreadoEn" : inscripcioncreadoen, 
                "estadoInscripcion" : estado_inscripcion, 
                "inscripcionEditadoEn" : editadoen,
                "nombreSocio" : nombre_cmp,
                nombreCmp : `${ nombre } ${ apellido }`,
                categoria : { 
                    idCategoria,
                    nombreCategoria : nombre_categoria
                }
            } );
            
        }


        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion generada con exito",
            nuevaInscripcion
        } );


    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo crear el registro ${ error }`,
        } );
        
    }


}






const editar_inscripcion = async ( req = request, res = response ) =>{
    
    try {
    
        const { idSocio, idEvento, montoAbonado, idInscripcion, descripcion, estadoInscripcion, categorias } = req.body;
        
        let inscripcionEditada = [];
        
        for (const element of categorias) {
            
            const { idCategoria } = element;
            if ( await prisma.inscripciones.findFirst( { where : { id_categoria : Number( idCategoria ) } } ) ){
                const { abonado, desc_inscripcion, editadoen,
                        estado_inscripcion, fecha_inscripcion, 
                        id_evento_calendario_no_socio , id_inscripcion_no_socio } = await prisma.inscripciones.update( { 
                                                                                    where : { 
                                                                                                AND :[
                                                                                                        { id_inscripcion : Number( idInscripcion ) },
                                                                                                        { id_evento_calendario : Number( idEvento ) },
                                                                                                        { id_socio : Number( idSocio ) },
                                                                                                        { id_categoria : Number( idCategoria )  }
                                                                                                ]
                                                                                            }, 
                                                                                    data : {
                                                                                        abonado : montoAbonado,
                                                                                        desc_inscripcion : (descripcion === undefined) ? '' : 'ACTUALIZACION DE INSCRIPCION',
                                                                                        estadoinscripcion : (estadoInscripcion === undefined) ? false : true
                                                                                    }
                                                                                } );

                const { nombre_cmp, nombre, apellido } = await prisma.socio.findUnique( 
                                                                                        {
                                                                                            where : { id_socio : Number(idSocio) } ,
                                                                                            include : {  
                                                                                                persona : {
                                                                                                    select : {
                                                                                                        apellido : true ,
                                                                                                        nombre : true
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    );


                inscripcionEditada.push( {
                    "idInscripcion" : id_inscripcion_no_socio , 
                    "idSocio" : Number( idSocio ) , 
                    "idEventoCalendario" : id_evento_calendario_no_socio, 
                    "descInscripcion" : desc_inscripcion , 
                    "fechaInscripcion" :fecha_inscripcion , 
                    "abonado" : abonado , 
                    "inscripcionCreadoEn" : inscripcioncreadoen, 
                    "estadoInscripcion" : estado_inscripcion, 
                    "inscripcionEditadoEn" : editadoen,
                    "nombreSocio" : nombre_cmp,
                    nombreCmp : `${ nombre } ${ apellido }`,
                    idCategoria
                } )
            }
            
        }

        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            inscripcionEditada
        } );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false, 
            msg : `No se pudo editar la inscripcion  ${ error }`,
            //error
        } );
    }


}



const editar_inscripcion_no_socio = async ( req = request, res = response ) =>{

    
    try {
        const { id_inscripcion } = req.params;
        const { descripcion, estadoInscripcion, abonado, } = req.body;

        const inscripcion_editada = await prisma.inscripciones_no_socios.update ( { 
                                                                                    where :  { id_inscripcion_no_socio : id_inscripcion },
                                                                                    data : {
                                                                                        abonado,
                                                                                        desc_inscripcion : descripcion,
                                                                                        estado_inscripcion : estadoInscripcion
                                                                                    }
                                                                                } );
        res.status( 200 ).json( {
            status : true,
            msg : 'Inscripcion editada con exito',
            inscripcion_editada

        } );
    } catch (error) {

        console.log( error )

        res.status( 500 ).json( {

        } );
        
    }
        

}


const abonar_x_inscripcion = async ( req = request, res = response ) =>{
    
    try {
        const { idSocio, idEvento, montoAbonado, idInscripcion, descripcion, estadoInscripcion } = req.body;
        
        const { abonado, desc_inscripcion, editadoen,
                estado_inscripcion, fecha_inscripcion, 
                id_evento_calendario_no_socio , id_inscripcion_no_socio } = await prisma.inscripciones.update( { 
                                                                            where : { 
                                                                                        AND :[
                                                                                                { id_inscripcion : Number( idInscripcion ) },
                                                                                                { id_evento_calendario : Number( idEvento ) },
                                                                                                { id_socio : Number( idSocio ) }
                                                                                        ]
                                                                                    }, 
                                                                            data : {
                                                                                abonado : montoAbonado,
                                                                                desc_inscripcion : (descripcion === undefined) ? '' : 'ACTUALIZACION DE INSCRIPCION',
                                                                                estadoinscripcion : (estadoInscripcion === undefined) ? false : true
                                                                            }
                                                                        } );

        const { nombre_cmp, nombre, apellido } = await prisma.socio.findUnique( 
                                                                                {
                                                                                    where : { id_socio } ,
                                                                                    include : {  
                                                                                        persona : {
                                                                                            select : {
                                                                                                apellido : true ,
                                                                                                nombre : true
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            );
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            InscripcionEditada : {
                "idInscripcion" : id_inscripcion_no_socio , 
                "idSocio" : id_socio , 
                "idEventoCalendario" : id_evento_calendario_no_socio, 
                "descInscripcion" : desc_inscripcion , 
                "fechaInscripcion" :fecha_inscripcion , 
                "abonado" : abonado , 
                "inscripcionCreadoEn" : inscripcioncreadoen, 
                "estadoInscripcion" : estado_inscripcion, 
                "inscripcionEditadoEn" : editadoen,
                "nombreSocio" : nombre_cmp,
                nombreCmp : `${ nombre } ${ apellido }`
            }
        } );  

    } catch (error) {

        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo actualizar el registro",
            //inscripcion_abonada
        } );
                
    }

}

const abonar_x_inscripcion_no_socio = async ( req = request, res = response ) =>{

    const { id_inscripcion } = req.params;
    
    try {
        const inscripcion_abonada = await prisma.inscripciones_no_socios.update( { 
                                                                            where : { id_inscripcion_no_socio : id_inscripcion }, 
                                                                            data : {
                                                                                abonado : true

                                                                            }
                                                                    } );
        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            inscripcion_abonada
        } );    

    } catch (error) {

        console.log ( error );
        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo actualizar el registro",
            //inscripcion_abonada
        } );
                
    }

}



const ver_inscripciones_x_evento = async ( req = request, res = response ) =>{

    
    try {
        const { id_evento } = req.params;
        
        const query = `SELECT   A.id_inscripcion AS "idInscripcion", 
                                A.id_socio AS "idSocio", 
                                A.id_evento_calendario AS "idEventoCalendario", 
                                A.desc_inscripcion AS "descInscripcion", 
                                A.fecha_inscripcion AS "fechaInscripcion", 
                                A.abonado AS "abonado", 
                                A.inscripcioncreadoen AS "inscripcionCreadoEn", 
                                A.estadoinscripcion AS "estadoInscripcion", 
                                A.inscripcioneditadoen AS "inscripcionEditadoEn",
                                B.nombre_cmp as "nombreSocio",
                                CONCAT( C.nombre, ' ', C.apellido ) as "nombreCmp"
                            FROM inscripciones JOIN SOCIO B ON A.id_socio = B.id_socio
                        WHERE id_evento_calendario = ${ id_evento };`
        const inscripciones = await prisma.$queryRawUnsafe( query )
        const cantInscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cantInscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }


}

const ver_inscripciones_x_evento_no_socio = async ( req = request, res = response ) =>{

    
    try {
        const { id_evento } = req.params;
        
        const inscripciones = await prisma.inscripciones_no_socios.findMany( {
                                                                                where : { id_evento_calendario_no_socio : id_evento }
                                                                            } );
        const cant_inscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cant_inscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }


}




const ver_todas_las_inscripciones_x_evento = async ( req = request, res = response  ) =>{
        
    try {
        const { id_evento } = req.params;
        
        const inscripciones = await prisma.inscripciones_no_socios.findMany( {
                                                                    where : { id_evento_calendario_no_socio : id_evento }
                                                                } );
        const cant_inscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cant_inscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }
}


const obtener_cantidad_inscriptos_x_evento = async ( req = request, res = response  ) =>{
        
    try {
        const { id_evento } = req.params;
        
        const inscripciones = await prisma.inscripciones_no_socios.findMany( {
                                                                    where : { id_evento_calendario_no_socio : id_evento }
                                                                } );
        const cant_inscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cant_inscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }
}



const obtener_grafico_inscriptos_x_evento_categoria = async ( req = request, res = response  ) =>{
        
    try {
        const { id_evento } = req.params;
        
        const inscripciones = await prisma.inscripciones_no_socios.findMany( {
                                                                    where : { id_evento_calendario_no_socio : id_evento }
                                                                } );
        const cant_inscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cant_inscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }
}



const obtner_todas_inscripciones_x_evento = async ( req = request, res = response  ) =>{

    try {

        const { id_evento } = req.query;


        const query_inscripciones_no_socios = `SELECT A.id_inscripcion AS "idInscripcion",
                                                        C.id_socio AS "idSocio",
                                                        C.nombre_cmp AS "nombreCmp",
                                                        D.id_categoria AS "idCategoria",
                                                        D.nombre_categoria AS "categoria",
                                                        A.fecha_inscripcion AS "fechaInscripcion",
                                                        A.abonado,
                                                        E.costo AS "costoInscripcion"
                                                    FROM inscripciones A JOIN inscripcion_evento_categria_socio B ON B.id_inscripcion = A.id_inscripcion
                                                    JOIN socio C ON C.id_socio = A.id_socio
                                                    JOIN categorias D ON D.id_categoria = B.id_categoria
                                                    JOIN calendario_eventos E ON E.id_evento_calendario = B.id_evento_calendario
                                                    
                                                WHERE E.id_evento_calendario = ${ Number( id_evento ) }`,
                inscripcionesSocios = await prisma.$queryRawUnsafe( query_inscripciones_socios );
        const cantInscripcionesNoSocios = inscripcionesSocios.length;

        const query_inscripciones_socios = `SELECT A.id_inscripcion AS "idInscripcion",
                                                    C.id_socio AS "idSocio",
                                                    C.nombre_cmp AS "nombreCmp",
                                                    D.id_categoria AS "idCategoria",
                                                    D.nombre_categoria AS "categoria",
                                                    A.fecha_inscripcion AS "fechaInscripcion",
                                                    A.abonado,
                                                    E.costo AS "costoInscripcion"
                                                FROM inscripciones A JOIN inscripcion_evento_categria_socio B ON B.id_inscripcion = A.id_inscripcion
                                                JOIN socio C ON C.id_socio = A.id_socio
                                                JOIN categorias D ON D.id_categoria = B.id_categoria
                                                JOIN calendario_eventos E ON E.id_evento_calendario = B.id_evento_calendario
                                                
                                            WHERE E.id_evento_calendario = ${ Number( id_evento ) }`,
                inscripcionesNoSocios= await prisma.$queryRawUnsafe( query_inscripciones_socios );
        const cantInscripcionesSocios = inscripcionesSocios.length;

        res.status( 200 ).json( { 
            status : true,
            msg : "Inscripciones de ese evento",
            socios : {inscripcionesSocios, cantInscripcionesSocios },
            noSocios : { inscripcionesNoSocios, cantInscripcionesNoSocios }
        } );

        
    } catch (error) {
        //console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener todas las inscripciones del evento ",
            //cant_inscripciones : 0
        } );
    }



}






const obtener_ganancias_gastos_x_evento = async ( req = request, res = response  ) =>{
        
    try {
        const { id_evento } = req.params;
        
        const inscripciones = await prisma.inscripciones_no_socios.findMany( {
                                                                    where : { id_evento_calendario_no_socio : id_evento }
                                                                } );
        const cant_inscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cant_inscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : "No se ha podido obtener las inscripciones de ese evento",
            //cant_inscripciones : 0
        } );

    }
}



const borrar_inscripcion_socio = async ( req = request, res = response ) =>{

    try {
        
        const { idSocio, idEvento, montoAbonado, idInscripcion, descripcion, estadoInscripcion, categorias } = req.body;
        for (const element of categorias) {
            
            const { idCategoria } = element;
            if ( await prisma.inscripciones.findFirst( { where : { AND :[ { id_categoria : Number( idCategoria ) }, { id_inscripcion : Number( idInscripcion ) } ] } } ) ){
                const { abonado, desc_inscripcion, editadoen,
                        estado_inscripcion, fecha_inscripcion, 
                        id_evento_calendario_no_socio , id_inscripcion_no_socio } = await prisma.inscripciones.delete( { 
                                                                                    where : { 
                                                                                                AND :[
                                                                                                        { id_inscripcion : Number( idInscripcion ) },
                                                                                                        { id_evento_calendario : Number( idEvento ) },
                                                                                                        { id_socio : Number( idSocio ) },
                                                                                                        { id_categoria : Number( idCategoria )  }
                                                                                                ]
                                                                                            }
                                                                                } );

                const { nombre_cmp, nombre, apellido } = await prisma.socio.findUnique( 
                                                                                        {
                                                                                            where : { id_socio : Number(idSocio) } ,
                                                                                            include : {  
                                                                                                persona : {
                                                                                                    select : {
                                                                                                        apellido : true ,
                                                                                                        nombre : true
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    );


                inscripcionEditada.push( {
                    "idInscripcion" : id_inscripcion_no_socio , 
                    "idSocio" : Number( idSocio ) , 
                    "idEventoCalendario" : id_evento_calendario_no_socio, 
                    "descInscripcion" : desc_inscripcion , 
                    "fechaInscripcion" :fecha_inscripcion , 
                    "abonado" : abonado , 
                    "inscripcionCreadoEn" : inscripcioncreadoen, 
                    "estadoInscripcion" : estado_inscripcion, 
                    "inscripcionEditadoEn" : editadoen,
                    "nombreSocio" : nombre_cmp,
                    nombreCmp : `${ nombre } ${ apellido }`,
                    idCategoria
                } )
            }
            
        }

        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            inscripcionEditada
        } );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false, 
            msg : `No se pudo editar la inscripcion  ${ error }`,
            //error
        } );
    }

}

const borrar_inscripcion_no_socio = async ( req = request, res = response ) =>{

    try {

        const { idEvento, montoAbonado, idInscripcionNoSocio, descripcion, estadoInscripcion, categorias } = req.body;
        for (const element of categorias) {
            
            const { idCategoria } = element;
            if ( await prisma.inscripciones_no_socios.findFirst( { where : { AND :[ { id_categoria : Number( idCategoria ) }, { id_inscripcion_no_socio : Number( idInscripcionNoSocio ) } ] } } ) ){
                const { abonado, desc_inscripcion, editadoen,
                        estado_inscripcion, fecha_inscripcion, nombre_jugador, 
                        id_evento_calendario_no_socio , id_inscripcion_no_socio } = await prisma.inscripciones_no_socios.delete( { 
                                                                                    where : { 
                                                                                                AND :[
                                                                                                        { id_inscripcion_no_socio : Number( idInscripcionNoSocio ) },
                                                                                                        { id_evento_calendario : Number( idEvento ) },
                                                                                                        { id_categoria : Number( idCategoria )  }
                                                                                                ]
                                                                                            }
                                                                                } );


                inscripcionEditada.push( {
                    "idInscripcion" : id_inscripcion_no_socio , 
                    "idSocio" : Number( idSocio ) , 
                    "idEventoCalendario" : id_evento_calendario_no_socio, 
                    "descInscripcion" : desc_inscripcion , 
                    "fechaInscripcion" :fecha_inscripcion , 
                    "abonado" : abonado , 
                    "inscripcionCreadoEn" : inscripcioncreadoen, 
                    "estadoInscripcion" : estado_inscripcion, 
                    "inscripcionEditadoEn" : editadoen,
                    "nombreSocio" : nombre_jugador,
                    nombreCmp : `${ nombre_jugador }`,
                    idCategoria
                } )
            }
            
        }

        res.status( 200 ).json( {
            status : true,
            msg : "Inscripcion editada con exito",
            inscripcionEditada
        } );

    } catch (error) {
        //console.log( error );
        res.status( 500 ).json( {
            status : false, 
            msg : `No se pudo editar la inscripcion  ${ error }`,
            //error
        } );
    }

    
}

module.exports = {

    abonar_x_inscripcion,
    editar_inscripcion,
    inscribirse_a_evento,
    ver_inscripciones_x_evento,
    inscribirse_a_evento_no_socios,
    abonar_x_inscripcion_no_socio,
    editar_inscripcion_no_socio,
    ver_inscripciones_x_evento_no_socio,
    ver_todas_las_inscripciones_x_evento,
    obtener_cantidad_inscriptos_x_evento,
    obtener_grafico_inscriptos_x_evento_categoria,
    obtener_ganancias_gastos_x_evento,
    obtner_todas_inscripciones_x_evento,
    borrar_inscripcion_socio,
    borrar_inscripcion_no_socio
}