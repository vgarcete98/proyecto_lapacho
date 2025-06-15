const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();



const obtener_socios_al_dia_detalle = async ( req = request, res = response ) =>{ 
    try {


        //ESTO ES PARA REALIZARLO DE UNA FORMA MAS RESUMIDA
        const query = `select  X.id_cliente::integer as "idCliente",
                                X.nombre_cmp as "nombreCmp",
                                COUNT(X.id_cuota_socio)::integer as "cantPendiente",
                                ARRAY_AGG( TO_CHAR(X.fecha_vencimiento, 'Month YYYY') ) as "mesesPendientes"
                        from ( select distinct cs.id_cuota_socio,
                                            c.id_cliente,
                                            c.cedula,
                                            c.nombre_cmp,
                                            v.id_cuota_socio as cuota_venta,
                                            cs.descripcion,
                                            mc.fecha_operacion,
                                            cs.estado  as cuota_estado,
                                            v.estado  as venta_estado,
                                            cs.fecha_vencimiento
                                        from cliente c join cuotas_socio cs on c.id_cliente = cs.id_cliente 
                                        left join movimiento_caja mc on mc.id_cliente = c.id_cliente 
                                        left join ventas v on v.id_cliente = c.id_cliente 
                                    where c.id_tipo_socio is not null 
                                        and ( v.estado like '%PENDIENTE%' or cs.estado like '%PENDIENTE%')
                                        and ( cs.fecha_vencimiento <= current_date )
                                    order by cs.id_cuota_socio ) X 
                        group by  X.id_cliente, X.nombre_cmp
                        order by X.id_cliente`;
        const sociosAlDiaDetalle = await prisma.$queryRawUnsafe(query)



        if ( sociosAlDiaDetalle.length === 0  ){

            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo detalle de los socios al dia',
                descripcion : `No hay ningun detalle de los socios al dia`
            } ); 


        }else {

            res.status( 200 ).json( {
                status : true,
                msg : 'Socios del Club al dia con detalle',
                sociosAlDiaDetalle
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } ); 
        }



        
    } catch (error) {
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo obtener el detalle de los socios al dia',
            //error
        } );
        
    }  
}




const obtener_cant_socios_al_dia = async ( req = request, res = response ) =>{ 
    try {


        //ESTO ES PARA REALIZARLO DE UNA FORMA MAS RESUMIDA
        const query = `select B.estado as estado,
                                count(B.estado)::integer as cantidad
                            from (select Z.id_cliente,
                                        case when (Z.cant_pendiente > 1) then 'NO ESTA AL DIA' else 'ESTA AL DIA' end as estado
                                        from ( select  X.id_cliente,
                                                        X.nombre_cmp,
                                                        COUNT(X.id_cuota_socio) as cant_pendiente,
                                                        ARRAY_AGG( TO_CHAR(X.fecha_vencimiento, 'Month YYYY') )
                                                from ( select distinct cs.id_cuota_socio,
                                                                    c.id_cliente,
                                                                    c.cedula,
                                                                    c.nombre_cmp,
                                                                    v.id_cuota_socio as cuota_venta,
                                                                    cs.descripcion,
                                                                    mc.fecha_operacion,
                                                                    cs.estado  as cuota_estado,
                                                                    v.estado  as venta_estado,
                                                                    cs.fecha_vencimiento
                                                                from cliente c join cuotas_socio cs on c.id_cliente = cs.id_cliente 
                                                                left join movimiento_caja mc on mc.id_cliente = c.id_cliente 
                                                                left join ventas v on v.id_cliente = c.id_cliente 
                                                            where c.id_tipo_socio is not null 
                                                                and ( v.estado like '%PENDIENTE%' or cs.estado like '%PENDIENTE%')
                                                                and ( cs.fecha_vencimiento <= current_date )
                                                            order by cs.id_cuota_socio ) X 
                                                group by  X.id_cliente, X.nombre_cmp
                                                order by X.id_cliente ) Z ) B
                        group by B.estado`;

        const estados = await prisma.$queryRawUnsafe(query)



        if ( estados.length === 0  ){

            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo detalle de los socios al dia',
                descripcion : `No hay ningun detalle de los socios al dia`
            } ); 


        }else {

            res.status( 200 ).json( {
                status : true,
                msg : 'Socios del Club al dia ',
                estados
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } ); 
        }



        
    } catch (error) {
        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}


const obtener_data_costo_clase = async ( req = request, res = response ) =>{ 
    try {


        //ESTO ES PARA REALIZARLO DE UNA FORMA MAS RESUMIDA
        const query = `select p.nombre_profesor as "profesor",
                            p.costo_x_hora as "costo"
                        from  profesores p `;

        const costosClase = await prisma.$queryRawUnsafe(query)

        if ( costosClase.length === 0  ){

            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo detalle costos de clases de profesores',
                descripcion : `No hay ningun detalle de los costos de clases de profesores`
            } ); 


        }else {

            res.status( 200 ).json( {
                status : true,
                msg : 'Costos de clases de profesores',
                costosClase
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } ); 
        }



        
    } catch (error) {
        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}



const obtener_data_alumnos_promedio = async ( req = request, res = response ) =>{ 
    try {


        //ESTO ES PARA REALIZARLO DE UNA FORMA MAS RESUMIDA
        const query = `select p.nombre_profesor as "profesor",
                                AVG ( ac.id_agendamiento  ) as "alumnos"
                            from agendamiento_clase ac join clases_alumnos ca on ac.id_agendamiento = ca.id_agendamiento 
                            join profesores p on ac.id_profesor = p.id_profesor 
                        where ac.clase_abonada = true
                        group by p.nombre_profesor`;

        const dataAlumnosPromedio = await prisma.$queryRawUnsafe(query)

        if ( dataAlumnosPromedio.length === 0  ){

            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo detalle del promedio de alumnos de un profesor',
                descripcion : `No hay ningun detalle de los alumnos de un profesor`
            } ); 


        }else {

            res.status( 200 ).json( {
                status : true,
                msg : 'Alumnos promedio de un profesor',
                dataAlumnosPromedio
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } ); 
        }



        
    } catch (error) {
        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}



const obtener_data_aceptacion_profesores = async ( req = request, res = response ) =>{ 
    try {


        //ESTO ES PARA REALIZARLO DE UNA FORMA MAS RESUMIDA
        const query = `select X.profesor,
                            json_agg(X.aceptacion ) AS resultado from ( select p.nombre_profesor as "profesor",
                                                        MES_EN_ESPANOL( TO_CHAR(ac.horario_inicio , 'Month')) as "mes",
                                                        COUNT( ac.id_agendamiento ) as "aceptacion"
                                                    from agendamiento_clase ac join clases_alumnos ca on ac.id_agendamiento = ca.id_agendamiento 
                                                    join profesores p on ac.id_profesor = p.id_profesor 
                                                where ac.clase_abonada = false and 
                                                ac.horario_inicio >= (CURRENT_DATE - INTERVAL '5 months')
                                                group by p.nombre_profesor,
                                                        MES_EN_ESPANOL( TO_CHAR(ac.horario_inicio , 'Month'))
                                                order by p.nombre_profesor desc ) as X
                        group by X.profesor`;

        const dataQueryAceptacion = await prisma.$queryRawUnsafe(query)
        if ( dataQueryAceptacion.length === 0  ){

            res.status( 400 ).json( {
                status : false,
                msg : 'No se obtuvo detalle de la aceptacion de los profesores',
                descripcion : `No hay ningun detalle de la aceptacion de los profesores`
            } ); 


        }else {

            const dataAceptacion = dataQueryAceptacion.map( ( element )=>{
                let { profesor, resultado } = element;
                const [ muyBueno, bueno, regular, malo, ... resto ] = resultado.sort();

                let data = {
                    profesor,
                    muyBueno, 
                    bueno, 
                    regular, 
                    malo
                }

                return data;

            } );

            res.status( 200 ).json( {
                status : true,
                msg : 'Alumnos promedio de un profesor',
                dataAceptacion
                //descripcion : `No existe ninguna venta generada para ese cliente`
            } ); 
        }



        
    } catch (error) {
        console.log(error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo realizar esa accion sobre la caja',
            //error
        } );
        
    }  
}





module.exports = {

    obtener_socios_al_dia_detalle,
    obtener_cant_socios_al_dia,
    obtener_data_costo_clase,
    obtener_data_alumnos_promedio,
    obtener_data_aceptacion_profesores
}