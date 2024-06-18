const { PrismaClient } = require('@prisma/client')
const { request, response } = require('express');
const { generar_fecha } = require('./generar_fecha');
const prisma = new PrismaClient();



const comprobar_horario_profesor = async ( req = request, res = response, next)=> {

    try {
        
        const { idSocio, idProfesor, inicio, fin, idMesa, idAgendamiento } = req.body;
        
        //const [ dia, mes, annio ] = fechaAgendamiento.split( '/' );

        //const fecha_agendamiento = `${annio}-${mes}-${dia}`; 
        
        
        const query = `SELECT A.id_agendamiento, B.id_profesor, B.nombre_profesor, D.id_socio, 
                                                        		D.nombre_cmp, A.fecha_agendamiento, C.id_mesa, C.desc_mesa, 
                                                        		A.horario_inicio, A.horario_hasta, A.clase_abonada, A.monto_abonado
                                                        	FROM agendamiento_clase A JOIN profesores B ON B.id_profesor = A.id_profesor
                                                        	JOIN mesas C ON C.id_mesa = A.id_mesa
                                                        	JOIN socio D ON D.id_socio = A.id_socio
                                                        WHERE  A.horario_inicio = TIMESTAMP '${inicio}' 
                                                                AND A.horario_hasta = TIMESTAMP '${fin}'
                                                                AND B.id_profesor = ${ Number( idProfesor ) }
                                                                AND C.id_mesa = ${ Number( idMesa ) }
                                                        ORDER BY A.fecha_agendamiento DESC`
        //console.log ( query )
        const clases_del_dia = await prisma.$queryRawUnsafe( query );
        
        if ( clases_del_dia.length === 0 ){
            // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
            next()
        } else {
            //console.log ( "clase que coincide, no se puede reservar" );
            res.status( 400 ).json( {
                status : true,
                msg : "clase que coincide, no se puede reservar",
                //claseAgendada
            } );
        }
    } catch (error) {
        //console.log( error );
        res.status( 400 ).json( {
            status : false,
            msg : `No se pudo verificar las clases coincidentes, error : ${error}`,
            //nuevoIngreso
        } );
    }




}


module.exports = { comprobar_horario_profesor };
