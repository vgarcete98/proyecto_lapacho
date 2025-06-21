
const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')
const { withOptimize } = require("@prisma/extension-optimize");
//PARA PRUEBAS
//-----------------------------------------------------------------------------------------------------
//const prisma = new PrismaClient().$extends(withOptimize( { apiKey: process.env.OPTIMIZE_API_KEY } ));
//-----------------------------------------------------------------------------------------------------
const prisma = new PrismaClient();




const inscribirse_a_evento = async ( req = request, res = response ) =>{
    
    try {
        
        // NECESITO REGISTRAR UNA INSCRIPCION 
        // Voy a manejar que se abona entero por la inscripcion y no por partes como sucede con las clases particulares
        const { idCliente, categorias } = req.body;

        let cat = [];
        let inscripciones_registradas = 0;
        for (const element of categorias) {
            
            try {


                let { idCategoria, descInscripcion, idEvento } = element;
                let categoria = await prisma.categorias.findUnique( { 
                                                                        where : { id_categoria : Number( idCategoria ) },
                                                                        select : {
                                                                            id_categoria : true,
                                                                            costo : true,

                                                                        }
                                                                    } );
                
                let inscripcion  = await prisma.inscripciones.create( { 
                                                                        data : {
                                                                            id_cliente : Number(idCliente),
                                                                            id_evento : Number(idEvento),
                                                                            inscripcioncreadoen : new Date(),
                                                                            id_categoria : Number( categoria.id_categoria ),
                                                                            fecha_inscripcion : new Date(),
                                                                            desc_inscripcion : descInscripcion,
                                                                            costo_inscripcion : Number( categoria.costo ),
                                                                            estado : 'PENDIENTE DE COBRO'
                                                                        },
                                                                        select : {
                                                                            id_categoria : true,
                                                                            id_evento : true 
                                                                        }
                                                                    } );
                let nueva_venta = null;
                if ( inscripcion !== null ){

                    inscripciones_registradas += 1;

                }
                
            } catch (error) {
                console.log( error );
            }
                                                                
        }

        if ( inscripciones_registradas === categorias.length && categorias.length > 0 ){
            
            res.status( 200 ).json( {
                status : true,
                msg : "Inscripcion registrada",
                descripcion : "Se ha registrado la inscripcion con exito" 
            } );        
        }else {
            res.status( 400 ).json({
                
                    status : true,
                    msg : 'No se lograron registrar todas las inscripciones a las categorias',
                    descripcion : `Solo se procesaron ${ inscripciones_registradas } de ${ categorias.length } inscripciones`
                }
            ); 
        }

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
        const query = `SELECT   A.id_inscripcion AS "idInscripcion",
								C.id_categoria AS "idCategoria",
								C.nombre_categoria AS "nombreCategoria",
                                A.id_cliente AS "idCliente", 
                                A.id_evento AS "idEventoCalendario", 
                                A.desc_inscripcion AS "descInscripcion", 
                                A.fecha_inscripcion AS "fechaInscripcion", 
                                A.inscripcioncreadoen AS "inscripcionCreadoEn", 
                                A.estado AS "estado", 
                                A.inscripcioneditadoen AS "inscripcionEditadoEn",
                                B.nombre_cmp as "nombre"--,
                                --CONCAT( B.nombre, ' ', B.apellido ) as "nombreCmp",
								--B.nombrecmp AS "nombreCmp"
                            FROM inscripciones A JOIN CLIENTE B ON A.id_cliente = B.id_cliente
							JOIN CATEGORIAS C on A.id_categoria = c.id_categoria
                        WHERE ${ ( id_evento !== undefined ) ? `A.id_evento = ${ id_evento }` : `` }
                            ${ ( id_categoria !== undefined ) ? `AND C.id_categoria = ${ id_categoria }` : `` }`
        const inscripciones = await prisma.$queryRawUnsafe( query )
        const cantInscripciones = inscripciones.length;

        if ( cantInscripciones > 0  ){
            res.status( 200 ).json( { 
                                        status : true,
                                        msg : "Inscripciones de ese evento",
                                        cantInscripciones,
                                        inscripciones
                                    } );

        }else {
            res.status( 400 ).json( { 
                status : false,
                msg : "Aun no se registran inscripciones para el evento",
                descripcion : 'Registre alguna inscripcion y vuelva a intentar'
            } );
        }

    } catch (error) {
        res.status( 500 ).json( { 
            status : false,
            msg : `No se ha podido obtener las inscripciones de ese evento ${error}`,
            //cant_inscripciones : 0
        } );

    }


}





const ver_inscripciones_x_evento_x_categoria = async ( req = request, res = response ) =>{
      
    try {
        const { id_evento, id_categoria } = req.query;
        const query = `SELECT C.id_categoria AS "idCategoria",
		                        C.nombre_categoria AS "nombreCategoria",
								JSON_AGG(JSON_BUILD_OBJECT(
									'idCliente', A.id_cliente, 
									'idEventoCalendario', A.id_evento , 
									'descInscripcion', A.desc_inscripcion, 
									'fechaInscripcion', A.fecha_inscripcion, 
									'inscripcionCreadoEn', A.inscripcioncreadoen, 
									'estado', A.estado, 
								 	'idInscripcion', A.id_inscripcion,
									'nombre', B.nombre_cmp --,
									--CONCAT( B.nombre, ' ', B.apellido ) as "nombreCmp",
									--B.nombrecmp AS "nombreCmp"			
								)) AS "inscriptos"
                            FROM inscripciones A JOIN CLIENTE B ON A.id_cliente = B.id_cliente
							JOIN CATEGORIAS C on A.id_categoria = c.id_categoria
                        WHERE ${ ( id_evento !== undefined ) ? `A.id_evento = ${ id_evento }` : `` }
                            ${ ( id_categoria !== undefined ) ? `AND C.id_categoria = ${ id_categoria }` : `` }
                        GROUP BY C.id_categoria, C.nombre_categoria`
        const inscripciones = await prisma.$queryRawUnsafe( query )
        const cantInscripciones = inscripciones.length;

        if ( cantInscripciones > 0  ){
            res.status( 200 ).json( { 
                                        status : true,
                                        msg : "Inscripciones de ese evento",
                                        cantidad : cantInscripciones,
                                        inscripciones
                                    } );

        }else {
            res.status( 400 ).json( { 
                status : false,
                msg : "Aun no se registran inscripciones para el evento",
                descripcion : 'Registre alguna inscripcion y vuelva a intentar'
            } );
        }

    } catch (error) {
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
        
        res.status( 500 ).json( {
            status : false, 
            msg : `No se pudo editar la inscripcion  ${ error }`,
            //error
        } );
    }

}




const agregar_inscripciones_a_venta = async ( req = request, res = response ) =>{


    try {
        
        const { inscripciones } = req.body;
        
        let inscripciones_añadidas = 0;
        let ingreso_por_inscripcion = await prisma.tipos_ingreso.findFirst( { 
            where : { descripcion : 'TORNEOS' },
            select : {
                id_tipo_ingreso : true
            } 
        } );

        for (const element of inscripciones) {
            
            try {
                let { idInscripcion } = element;
                
                let inscripcion = await prisma.inscripciones.findUnique( { where : { id_inscripcion : Number( idInscripcion ) } } );
                let  { id_inscripcion, id_cliente, costo_inscripcion, fecha_inscripcion } = inscripcion;
                let cliente = await prisma.cliente.findUnique( { where : { id_cliente : id_cliente } } );
                let categoria = await prisma.categorias.findUnique( { where : { id_categoria : inscripcion.id_categoria } } )
                if ( inscripcion !== null  ) { 

                    let nueva_venta = await prisma.ventas.create( {
                        data : {
                            creado_en : new Date(),
                            creado_por : 1,
                            descripcion_venta : `INSCRIPCION CATEGORIA ${ categoria.nombre_categoria }, ${cliente.nombre_cmp} `,
                            monto : Number( inscripcion.costo_inscripcion ),
                            estado : 'PENDIENTE DE PAGO',
                            fecha_operacion : new Date(),
                            cedula : cliente.cedula,
                            id_cliente : cliente.id_cliente,
                            id_inscripcion : inscripcion.id_inscripcion,
                            id_cuota_socio : null,
                            id_cliente_reserva : null,
                            id_tipo_ingreso : ingreso_por_inscripcion.id_tipo_ingreso,
                            id_agendamiento : null,
                            
                        }
                    } );
                    ( nueva_venta !== null )? console.log( 'Venta registrada con exito' ) : console.log( 'No se registro la venta' );
                    inscripciones_añadidas += 1;
                }
            } catch (error) {
                console.log ( error )
            }

        }

        if ( inscripciones_añadidas > 0 && inscripciones_añadidas ===  inscripciones.length){

            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Ventas Creadas',
                    descripcion : `Todas las Ventas fueron generadas con exito`
                }
            );   
        }else {
            res.status( 400 ).json(
                {
    
                    status : true,
                    msg : 'No se lograron crear todas las ventas que se adjunto',
                    descripcion : `Ventas que fueron generadas con exito ${ inscripciones_añadidas }, Ventas fallidas ${ inscripciones.length - inscripciones_añadidas }`
                }
            ); 
        }
        
        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al generar la venta : ${ error }`,
            //error
        } );

    }

}



const cerrar_inscripciones_de_evento = async ( req = request, res = response  ) =>{

    try {
        const { id_evento } = req.query;


        const cierre_evento = await prisma.eventos.update( { 
                                                                data : { 
                                                                    cierre_inscripciones : new Date()
                                                                },
                                                                where : { 
                                                                    id_evento : Number( id_evento )
                                                                } 
                                                            } );
        if ( cierre_evento !== null && cierre_evento !== undefined && cierre_evento){
            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Cierre del evento realizado con exito',
                    descripcion : `Se cerro el evento, cualquier inscripcion no sera registrada`
                }
            );
        }else {
            res.status( 400 ).json(
                {
    
                    status : false,
                    msg : 'No se logro realizar el cierre del evento',
                    descripcion : `No se logro concretar el cierre del evento, favor intente de vuelta`
                }
            );
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al cerrar el evento : ${ error }`,
            //error
        } );
    }


}

const cerrar_inscripciones_de_categoria = async ( req = request, res = response  ) =>{

    try {
        const { id_evento, id_categoria } = req.query;


        const cierre_evento = await prisma.categorias.update( { 
                                                                data : { 
                                                                    cierre_inscripciones : new Date()
                                                                },
                                                                where : { 
                                                                    AND : [

                                                                        { id_evento : Number( id_evento ) },
                                                                        { id_categoria : Number( id_categoria ) }
                                                                    ]
                                                                } 
                                                            } );
        if ( cierre_evento !== null && cierre_evento !== undefined && cierre_evento){
            res.status( 200 ).json(
                {
    
                    status : true,
                    msg : 'Cierre del evento realizado con exito',
                    descripcion : `Se cerro el evento, cualquier inscripcion no sera registrada`
                }
            );
        }else {
            res.status( 400 ).json(
                {
    
                    status : false,
                    msg : 'No se logro realizar el cierre del evento',
                    descripcion : `No se logro concretar el cierre del evento, favor intente de vuelta`
                }
            );
        }

    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : `Ha ocurrido un error al cerrar el evento : ${ error }`,
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
    agregar_inscripciones_a_venta,
    cerrar_inscripciones_de_evento,
    cerrar_inscripciones_de_categoria,
    ver_inscripciones_x_evento_x_categoria
}