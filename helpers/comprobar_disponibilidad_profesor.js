const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();



const comprobar_horario_profesor = async ( fecha_clase  = new Date(), inicio = '', fin = '', profesor = 1 )=> {

    const [ dia, mes, anio ] = [ fecha_clase.getDate, fecha_clase.getMonth, fecha_clase.getFullYear ]

    const clases_del_dia = await prisma.$queryRaw`SELECT B.ID_AGENDAMIENTO, A.NOMBRE_PROFESOR, B.FECHA_AGENDAMIENTO, 
                                                    B.HORARIO_INICIO, B.HORARIO_HASTA
                                                FROM AGENDAMIENTO_CLASE B JOIN PROFESORES A ON A.ID_PROFESOR = B.ID_PROFESOR
                                                WHERE EXTRACT ( MONTH FROM B.FECHA_AGENDAMIENTO ) = ${ mes } AND 	
                                                    EXTRACT ( DAY FROM B.FECHA_AGENDAMIENTO ) = ${ dia } AND 
                                                    EXTRACT ( YEAR FROM B.FECHA_AGENDAMIENTO) = ${ anio } AND 
                                                    A.ID_PROFESOR = ${ profesor };`
    if ( clases_del_dia.length === 0 ){
        // HAY CLASES DISPONIBLES PARA ESE DIA Y CON ESE PROFESOR
        return true;
    } else {
        console.log ( "clase que coincide, no se puede reservar" );
        return false;
    }


}


module.exports = { comprobar_horario_profesor };
