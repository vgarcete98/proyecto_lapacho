const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const obtener_id_ingreso_clases = async () =>{

    try {
        
        const ingreso_clase = await prisma.tipos_ingreso.findFirst( { 
                                                                        where : { descripcion : 'INGRESO_X_CLASES_PROFESORES' }, 
                                                                        select : {
                                                                            id_tipo_ingreso : true
                                                                        } 
                                                                    } );


        if ( ingreso_clase !== null ){
            const { id_tipo_ingreso } = ingreso_clase;
            return id_tipo_ingreso;
        }else {
            return 1;
        }


    } catch (error) {
        
    }


}

const cron_job_genera_venta_clases_profesores = async (  ) => { 

    try {

        //VAMOS A CONTAR LA CANTIDAD DE CLASES QUE TUVO ESE PROFESOR DENTRO DEL PERIODO
        console.log( `EJECUTANDO PROCEDIMIENTO PARA CALCULO DE VENTA A PROFESORES` );
        const [ inicio, fin ] = [ new Date( ( new Date() ).getFullYear(), ( new Date() ).getMonth(), 20 ), 
                            new Date( ( new Date() ).getFullYear(), ( new Date() ).getMonth() + 1, 20, 23, 59, 59, 999 ) ];
        
        const profesores = await prisma.profesores.findMany( { select : { id_profesor : true } } );

        let periodo_procesado = await prisma.periodos_facturacion.findMany( { 
                                                                                where : {  
                                                                                    AND : [
                                                                                        { inicio : { gte : inicio } },
                                                                                        { fin : { lte : fin } }
                                                                                    ]
                                                                                }, 
                                                                                select : {
                                                                                    id_profesor : true
                                                                                }
                                                                            } )
        let idProfesor = 0;
        const diferencia = profesores.filter(x => !periodo_procesado.includes(x));
        let cedulaProfe = '';
        let monto_venta = 0;
        if ( diferencia.length > 0  ) { 

            const id_ingreso_clase = await obtener_id_ingreso_clases();
            for (const element of diferencia) {
    
                let { id_profesor } = element;
                idProfesor = id_profesor;
    
                try {
    
                    const clases_profesor = await prisma.agendamiento_clase.count( { 
                                                                        where : {
                                                                            AND : [
                                                                                { horario_inicio : { gte : new Date( inicio ) } },
                                                                                { horario_hasta : { lte : new Date( fin ) } },
                                                                                { id_profesor : Number( idProfesor ) }
                                                                            ]
                                                                        } 
                                                                } );
                    const datos_profesor = await prisma.profesores.findUnique( { 
                                                                                    where : { id_profesor : Number(idProfesor) },
                                                                                    select : { 
                                                                                        id_profesor : true,
                                                                                        porc_facturacion : true,
                                                                                        costo_x_hora : true,
                                                                                        cedula : true
                                                                                    }
                                                                                } );
        
        
                    const { id_profesor, porc_facturacion, costo_x_hora, cedula } = datos_profesor;
                    cedulaProfe = cedula;
                                                                                
                    //VOY A BUSCAR EL PERIODO PRIMERO DE MODO A NO PROCESAR 2 VECES LO MISMO 
                    monto_venta = ( costo_x_hora*clases_profesor )*porc_facturacion;

                    if ( monto_venta !== 0 && isNaN( monto_venta )  ) {

                        const periodo_facturacion_clase = await prisma.periodos_facturacion.create( {  
                                                                                                        data : {
                                                                                                            creado_en : new Date(),
                                                                                                            creado_por : 1,
                                                                                                            fin : new Date( fin ),
                                                                                                            inicio : new Date( inicio ),
                                                                                                            monto_total : isNaN( monto_venta ) ? 0 : monto_venta,
                                                                                                            id_profesor : id_profesor
                                                                                                        },
                                                                                                        select : { 
                                                                                                            monto_total : true,
                                                                                                            id_periodo_fact : true
                                                                                                        }
                                                                                                    } )
            
                        if ( periodo_facturacion_clase !== null ){
                            const { monto_total, id_periodo_fact } = periodo_facturacion_clase;
                            //ESO SE AGREGA DIRECTO A UNA VENTA PARA EL PROFESOR QUE TIENE QUE ABONAR
            
                            const cliente = await prisma.cliente.findFirst( { 
                                                                                where : { cedula : cedulaProfe }, 
                                                                                select : { 
                                                                                    id_cliente : true,
                                                                                    cedula : true
                                                                                }
                                                                            } );
                            console.log( cliente )
                            const { id_cliente, cedula } = cliente;
            
                            const descripcion = `COBRO POR USO DEL CLUB, CLASES PARTICULARES`;
            
                            const nueva_venta = await prisma.ventas.create( { 
                                                                                data : {
                                                                                    creado_en : new Date( ),
                                                                                    creado_por : 1,
                                                                                    estado : 'PENDIENTE DE PAGO',
                                                                                    descripcion_venta : descripcion,
                                                                                    monto : monto_total,
                                                                                    cedula : cedula,
                                                                                    id_agendamiento : null,
                                                                                    id_periodo_fact : id_periodo_fact,
                                                                                    id_cliente_reserva : null,
                                                                                    id_cuota_socio : null,
                                                                                    id_cliente : id_cliente,
                                                                                    id_inscripcion : null,
                                                                                    fecha_operacion : new Date(),
                                                                                    id_tipo_ingreso : id_ingreso_clase
            
                                                                                },
                                                                                select : { 
                                                                                    id_venta : true
                                                                                }
                                                                            } );
            
                            if (nueva_venta !== null){
                                console.log( `VENTA GENERADA CON EXITO PARA CLASES DE PROFESORES` );
                                
                            }else {
                                console.log( `LA VENTA PARA EL PROFESOR ${idProfesor} NO FUE GENERADA` ); 
                            }
            
                        }
                        console.log( `PROCESO EJECUTADO PARA PROFESOR ${idProfesor}` )
                    }
                } catch (error_profesor) {
                    console.log( `HUBO UN ERROR AL PROCESAR LAS CLASES DE ESE PROFESOR ${error_profesor}` );
                    
                }
            }
        }

        
    } catch (error) {
        console.log( `HUBO UN ERROR AL BUSCAR A LOS PROFESORES HABILITADOS PARA COBRO ${error}` );
    }


}



module.exports = {
    cron_job_genera_venta_clases_profesores
}



