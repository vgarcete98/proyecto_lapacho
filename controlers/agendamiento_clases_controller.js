const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const { comprobar_horario_profesor } = require( '../helpers/comprobar_disponibilidad_profesor' )


const obtener_clases_del_dia = async ( req = request, res = response ) =>{

    // OBTENGO LAS CLASES DEL DIA Y LAS MANDO CON SU ID Y EL NOMBRE DEL PROFESOR ASOCIADO

    try {
        const clases_del_dia = await prisma.$queryRaw`SELECT B.ID_AGENDAMIENTO, A.NOMBRE_PROFESOR, B.FECHA_AGENDAMIENTO, 
                                                                B.HORARIO_INICIO, B.HORARIO_HASTA
                                                            FROM AGENDAMIENTO_CLASE B JOIN PROFESORES A ON A.ID_PROFESOR = B.ID_PROFESOR
                                                        WHERE EXTRACT ( MONTH FROM B.FECHA_AGENDAMIENTO ) = EXTRACT ( MONTH FROM CURRENT_DATE) AND 	
                                                                EXTRACT ( DAY FROM B.FECHA_AGENDAMIENTO ) = EXTRACT ( DAY FROM CURRENT_DATE) AND 
                                                                EXTRACT ( YEAR FROM B.FECHA_AGENDAMIENTO) = EXTRACT ( YEAR FROM CURRENT_DATE);`;        
        if ( clases_del_dia.length === 0 ){
            res.status( 200 ).json( {
                status : false,
                msg : "No se encontraron clases para el dia de hoy",
                cantidad : clases_del_dia.length,
                clases_del_dia
            } );
        }else {
            res.status( 200 ).json( {
                status : true,
                msg : "Clases para el dia de hoy",
                cantidad : clases_del_dia.length,
                clases_del_dia
            } );
        }
    } catch (error) {
        console.log ( ` Error encontrado ${error}` );

        res.status( 500 ).json( {
            status : false,
            msg : "Ocurrio un error al realizar la consulta",
            error
        } );
    }

    





}



const agendar_una_clase = async ( req = request, res = response ) =>{


    const { id_socio, id_profesor, fecha_para_la_clase, inicio, fin } = req.body;

    // VOY A COMPROBAR LAS CLASES QUE HAY EN EL DIA PRIMERO PARA PODER VER SI SE PUEDE RESERVAR O NO
    const disponibilidad = await comprobar_horario_profesor( fecha_para_la_clase, inicio, fin, id_profesor );
    if ( disponibilidad === true ) {
        
        try {
            const agendar_clase = await prisma.agendamiento_clase.create( { 
                                                                            data : { 
                                                                                        id_socio,
                                                                                        id_profesor,
                                                                                        fecha_agendamiento : fecha_para_la_clase,
                                                                                        horario_inicio : inicio,
                                                                                        horario_hasta : fin,
                                                                                        creadoen : new Date(),
                                                                                        clase_eliminada : false
                                                                                    } 
                                                                        } );
            
            if ( agendar_clase === null ) {
                res.status( 200 ).json( {
                    status : false,
                    msg : "No se pudo insertar el registro",
                    agendar_clase
                } );
            }else {
                res.status( 200 ).json( {
                    status : true,
                    msg : "registro insertado",
                    agendar_clase
                } );
            }
        } catch (error) {
    
            console.log ( error );
            res.status( 500 ).json( {
                status : false,
                msg : "Ocurrio un error al insertar el registro",
                error
            } );
    
        }

    } else {
        res.status( 200 ).json( {
            status : false,
            msg : "No se pudo agendar la clase, ya existe una en el mismo horario",
            agendar_clase
        } );
    }




}

const editar_una_clase = async ( req = request, res = response ) =>{

    const {  } = req.body;







}



const abonar_una_clase = async ( req = request, res = response ) =>{

    const { id_de_clase, monto_abonado_x_clase } = req.body;

    try {
        

        const clase_a_abonar = await prisma.agendamiento_clase.findUnique( { where : { id_agendamiento : id_de_clase } } );

        const { monto_abonado, clase_abonada, id_profesor } = clase_a_abonar;

        if ( monto_abonado === monto_abonado_x_clase || clase_abonada === true ) {  
            res.status( 400 ).json( {
                status : false,
                msg : "Ya se ha abonado la totalidad de esta clase",
                clase_a_abonar
            } );
        } else {

            const costo_x_hora_profesor = await prisma.profesores.findUnique( { where : { id_profesor } } );
            const { costo_x_hora } = costo_x_hora_profesor;
            let abonar_x_clase;
            if ( monto_abonado_x_clase ===  costo_x_hora ){
                abonar_x_clase = await prisma.agendamiento_clase.update( { 
                    where : { id_agendamiento : id_de_clase },
                    data : {
                                clase_abonada : monto_abonado_x_clase,
                                clase_abonada : true
                            } 
                } );
            }else {

                abonar_x_clase = await prisma.agendamiento_clase.update( { 
                    where : { id_agendamiento : id_de_clase },
                    data : {
                                clase_abonada : monto_abonado_x_clase,
                            } 
                } );
            }

            res.status( 200 ).json( { status : true, msg : "Clase abonada", abonar_x_clase } );


        }


    } catch (error) {

        console.log ( error );

        res.status( 500 ).json( {
            status : false,
            msg : "No se pudo abonar por la clase, ocurrio un error",
            error
        } );
    }


}





module.exports = {

    agendar_una_clase,
    editar_una_clase,
    abonar_una_clase,
    obtener_clases_del_dia

}