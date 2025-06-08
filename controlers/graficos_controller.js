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



module.exports = {

    obtener_socios_al_dia_detalle,
    obtener_cant_socios_al_dia
}