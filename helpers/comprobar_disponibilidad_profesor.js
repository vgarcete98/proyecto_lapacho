const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express');
const { generar_fecha } = require('./generar_fecha');
const prisma = new PrismaClient();



const comprobar_horario_profesor = async ( req = request, res = response, next)=> {

    try {
        
        const { idCliente, idProfesor, inicio, fin, idMesa, idAgendamiento } = req.body;
        



        
        
        const query = `SELECT A.id_agendamiento, 
                                B.id_profesor, 
                                B.nombre_profesor, 
                                F.id_cliente, 
                                F.nombre_cmp, A.fecha_agendamiento, C.id_mesa, C.desc_mesa, 
                                A.horario_inicio, A.horario_hasta, A.clase_abonada, A.monto_abonado
                                	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                                	JOIN mesas C ON C.id_mesa = A.id_mesa
                                	JOIN clases_alumnos D ON D.id_agendamiento = A.id_agendamiento
                                    JOIN cliente F on F.id_cliente = D.id_cliente
                                WHERE  ( A.horario_inicio, horario_hasta) overlaps ( TIMESTAMP '${inicio}', TIMESTAMP '${fin}' )
                                        AND B.id_profesor = ${ Number( idProfesor ) }
                                        AND C.id_mesa = ${ Number( idMesa ) }
                                ORDER BY A.fecha_agendamiento DESC`;
        
        const clases_del_dia = await prisma.$queryRawUnsafe( query );
        
        if ( clases_del_dia.length === 0 ){
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
            next()
        } else {
            ;
            res.status( 400 ).json( {
                status : true,
                msg : "clase que coincide, no se puede reservar",
                //claseAgendada
            } );
        }
    } catch (error) {
        
        res.status( 400 ).json( {
            status : false,
            msg : `No se pudo verificar las clases coincidentes, error : ${error}`,
            //nuevoIngreso
        } );
    }




}


module.exports = { comprobar_horario_profesor };
