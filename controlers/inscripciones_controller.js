
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
        const { idSocio, idEvento, categorias } = req.body;

        let cat = [];
        let nuevaInscripcion = [];
        
        for (const element of categorias) {
            
            const { idCategoria, idEventoCalendario, montoAbonado, descInscripcion } = element;
            //console.log( req.body );
            const { abonado, desc_inscripcion, estadoinscripcion, 
                    fecha_inscripcion, id_evento_calendario, id_inscripcion,
                    id_socio, inscripcioncreadoen, inscripcioneditadoen, id_categoria } = await prisma.inscripciones.create( { 
                                                                                                                                data : {
                                                                                                                                    id_socio : idSocio,
                                                                                                                                    id_evento_calendario : idEvento,
                                                                                                                                    abonado : montoAbonado,
                                                                                                                                    inscripcioncreadoen : new Date(),
                                                                                                                                    id_categoria : Number( idCategoria ),
                                                                                                                                    abonado : montoAbonado,
                                                                                                                                    fecha_inscripcion : new Date(),
                                                                                                                                    desc_inscripcion : descInscripcion
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
                "idInscripcion" :  (typeof id_inscripcion === 'bigint' ? Number(id_inscripcion.toString()) : id_inscripcion), 
                "idSocio" :  (typeof id_socio === 'bigint' ? Number(id_socio.toString()) : id_socio), 
                "idEventoCalendario" : (typeof id_evento_calendario === 'bigint' ? Number(id_evento_calendario.toString()) : id_evento_calendario), 
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
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `No se pudo ingresar el registro  ${ error }`,
            //nueva_inscripcion,
            //error

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




const ver_inscripciones_x_evento = async ( req = request, res = response ) =>{

    
    try {
        const { id_evento, id_categoria } = req.query;
        //console.log( req.query )
        const query = `SELECT   CAST ( A.id_inscripcion AS INTEGER )AS "idInscripcion",
								C.id_categoria AS "idCategoria",
								C.nombre_categoria AS "nombreCategoria",
                                CAST ( A.id_socio AS INTEGER ) AS "idSocio", 
                                CAST ( A.id_evento_calendario AS INTEGER ) AS "idEventoCalendario", 
                                A.desc_inscripcion AS "descInscripcion", 
                                A.fecha_inscripcion AS "fechaInscripcion", 
                                A.abonado AS "abonado", 
                                A.inscripcioncreadoen AS "inscripcionCreadoEn", 
                                A.estadoinscripcion AS "estadoInscripcion", 
                                A.inscripcioneditadoen AS "inscripcionEditadoEn",
                                B.nombre_cmp as "nombreSocio"--,
                                --CONCAT( B.nombre, ' ', B.apellido ) as "nombreCmp",
								--B.nombrecmp AS "nombreCmp"
                            FROM inscripciones A JOIN SOCIO B ON A.id_socio = B.id_socio
							JOIN CATEGORIAS C on A.id_categoria = c.id_categoria
                        WHERE A.id_evento_calendario = ${ id_evento }
                            ${ ( id_categoria !== undefined ) ? `AND C.id_categoria = ${ id_categoria }` : `` }`
        const inscripciones = await prisma.$queryRawUnsafe( query )
        const cantInscripciones = inscripciones.length;

        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Inscripciones de ese evento",
                                    cantInscripciones,
                                    inscripciones
                                } );

    } catch (error) {
        //console.log ( error );  
        res.status( 500 ).json( { 
            status : false,
            msg : `No se ha podido obtener las inscripciones de ese evento ${error}`,
            //cant_inscripciones : 0
        } );

    }


}



const ver_todas_las_inscripciones_x_evento = async ( req = request, res = response  ) =>{
        
    try {

        //VOY A DEVOLVER LA CANTIDAD DE INSCRIPTOS POR CATEGORIA CON EL PORCENTAJE QUE ESO REPRESENTA
        const { id_evento } = req.params;
        
        let inscripciones = 0;

        const cant_inscripciones = inscripciones.length;

        const query = `SELECT A.cant_inscripciones AS "cantInscripciones",
                                A.id_categoria AS "idCategoria",
                                A.categoria AS "categoria",
                                A.id_evento AS "idEvento",
                                B.cant_inscripciones_evento AS "cantInscripciones",
                                CAST (A.cant_inscripciones AS FLOAT) / CAST (B.cant_inscripciones_evento AS FLOAT ) * 100 AS "porcentaje"
                            FROM ( SELECT COUNT(A.id_inscripcion) AS "cant_inscripciones_evento"
                                        FROM INSCRIPCIONES A 
                                    WHERE A.id_evento_calendario = ${id_evento} ) B
                                    
                                CROSS JOIN 
                                    
                                ( SELECT COUNT(A.id_inscripcion) AS "cant_inscripciones",
                                            C.id_categoria AS "id_categoria",
                                            C.nombre_categoria AS "categoria",
                                            A.id_evento_calendario AS "id_evento"
                                        FROM INSCRIPCIONES A JOIN CATEGORIAS C ON A.id_categoria = C.id_categoria
                                    WHERE A.id_evento_calendario = ${id_evento}
                                    GROUP BY C.id_categoria, C.nombre_categoria, A.id_evento_calendario ) A ;`



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


        const query = `SELECT *
                            --CANT_INSCRIPTOS_X_CATEGORIA.nombreCategoria,
                            --CANT_INSCRIPTOS_X_CATEGORIA.cantInscriptos AS "inscriptosCategoria", 
                            --CANT_INSCRIPTOS_X_CATEGORIA.cantInscriptos/CANT_INSCRIPTOS.cantInscriptos AS "porcentaje"
                        FROM (SELECT COUNT (A.id_inscripcion) AS "cantInscriptos", 
                                        A.id_categoria AS "idCategoria",
                                        C.nombre_categoria AS "nombreCategoria"
                                    FROM inscripciones A JOIN calendario_eventos B ON A.id_evento_calendario = B.id_evento_calendario
                                    JOIN categorias C ON C.id_evento_calendario = B.id_evento_calendario AND A.id_categoria = C.id_categoria
                                WHERE A.id_evento_calendario = ${ id_evento }
                                GROUP BY A.id_categoria, C.nombre_categoria) AS CANT_INSCRIPTOS_X_CATEGORIA, 
                                ( SELECT COUNT (A.id_inscripcion) AS "cantInscriptos"
                                        FROM inscripciones A JOIN calendario_eventos B ON A.id_evento_calendario = B.id_evento_calendario
                                        JOIN categorias C ON C.id_evento_calendario = B.id_evento_calendario AND A.id_categoria = C.id_categoria
                                    WHERE A.id_evento_calendario =  ${ id_evento }
                                    GROUP BY A.id_categoria ) AS CANT_INSCRIPTOS`
        const graficoInscriptos = await prisma.$queryRawUnsafe( query );
        res.status( 200 ).json( { 
                                    status : true,
                                    msg : "Datos para grafico de inscripciones",
                                    graficoInscriptos
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

        const query_inscripciones_socios = `SELECT A.id_inscripcion AS "idInscripcion",
                                                    C.id_socio AS "idSocio",
                                                    C.nombre_cmp AS "nombreCmp",
                                                    D.id_categoria AS "idCategoria",
                                                    D.nombre_categoria AS "categoria",
                                                    A.fecha_inscripcion AS "fechaInscripcion",
                                                    A.abonado,
                                                    E.costo AS "costoInscripcion"
                                                FROM inscripciones A JOIN socio C ON C.id_socio = A.id_socio
                                                JOIN categorias D ON D.id_categoria = B.id_categoria
                                                JOIN calendario_eventos E ON E.id_evento_calendario = B.id_evento_calendario
                                                
                                            WHERE E.id_evento_calendario = ${ Number( id_evento ) }`;
        const cantInscripcionesSocios = inscripcionesSocios.length;

        res.status( 200 ).json( { 
            status : true,
            msg : "Inscripciones de ese evento",
            socios : { cantInscripcionesSocios },
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


        //GANANCIAS SERIAN POR EJEMPLO LA CANTIDAD DE PERSONAS INSCRIPTAS PARA LOS TORNEOS 
        
        const { costo } = await prisma.calendario_eventos.findUnique( { where :  { id_evento_calendario : Number( id_evento ) } } );

        const inscripciones_socios =  await prisma.inscripciones.count( { where : { id_evento_calendario : Number(id_evento) } } );

        const ganacias =  (costo*inscripciones_socios);
        
        //GASTOS SERIAN LOS REQUERIMIENTOS Y DEMAS QUE SE UTILIZO PARA EL EVENTO

        const gastos = await prisma.requerimientos.findMany( { where : { id_evento_calendario : Number( id_evento ) } } );

        gastos.forEach( ( element ) =>{ 

            const { cantidad, costo_unidad, id_requerimiento } = element;
            
        } );






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


module.exports = {

    abonar_x_inscripcion,
    editar_inscripcion,
    inscribirse_a_evento,
    ver_inscripciones_x_evento,
    ver_todas_las_inscripciones_x_evento,
    obtener_cantidad_inscriptos_x_evento,
    obtener_grafico_inscriptos_x_evento_categoria,
    obtener_ganancias_gastos_x_evento,
    obtner_todas_inscripciones_x_evento,
    borrar_inscripcion_socio,
}