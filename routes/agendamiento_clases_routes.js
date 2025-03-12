const Router = require( 'express' )

const { abonar_una_clase,
        agendar_una_clase,
        editar_una_clase,
        eliminar_clase_con_profesor,
        obtener_clases_del_dia,
        obtener_clases_x_profesor_dia, 
        obtener_clases_del_dia_x_socio,
        obtener_mesas_disponibles_x_horario,
        agendar_una_clase_no_cliente} = require( '../controlers/agendamiento_clases_controller' );
const { comprobar_horario_profesor } = require('../helpers/comprobar_disponibilidad_profesor');
const { obtener_data_socio, verificar_vista_usuario } = require('../helpers/verficar_socio_carga');
const { verificar_existe_clase } = require('../helpers/verificar_existe_clase');
const { verificar_requerimientos_usuario } = require('../middlewares/verficar_requerimientos_usuario');

const { 
        verificar_existe_reserva_agendada_para_clases,
        verificar_existe_evento_agendado_para_clases
    } = require( '../helpers/verificar_disponibilidad_para_servicios' )



const router_agendamientos_clase = Router();


router_agendamientos_clase.get( '/obtener_clases_x_fecha', [ verificar_vista_usuario ], obtener_clases_del_dia );

router_agendamientos_clase.get( '/obtener_clases_x_fecha_socio', [ verificar_vista_usuario ], obtener_clases_del_dia_x_socio );

router_agendamientos_clase.post( '/obtener_mesas_disponibles_x_horario', [ verificar_vista_usuario ], obtener_mesas_disponibles_x_horario );

router_agendamientos_clase.get( '/obtener_clases_x_fecha_profesor', [], obtener_clases_x_profesor_dia );

router_agendamientos_clase.get( '/obtener_mesas_disponibles_x_horario', [], obtener_mesas_disponibles_x_horario );


router_agendamientos_clase.delete( '/cancelar_clase', [], eliminar_clase_con_profesor );

router_agendamientos_clase.put( '/pagar_x_clase', [ obtener_data_socio, verificar_existe_clase  ], abonar_una_clase );

router_agendamientos_clase.put( '/editar_clase', [ obtener_data_socio, verificar_existe_clase ], editar_una_clase );

router_agendamientos_clase.post( '/agendar_clase', 
                                                    [ 
                                                        verificar_existe_reserva_agendada_para_clases,
                                                        verificar_existe_evento_agendado_para_clases,
                                                        comprobar_horario_profesor, 
                                                        obtener_data_socio,
                                                        verificar_requerimientos_usuario 
                                                    ]
                                                    ,agendar_una_clase_no_cliente
                                                    //( req = request, res = response ) => {
//
                                                    //    const { acceso } = req.body;
                                                    //    //console.log( acceso )
                                                    //    if ( acceso === 'ADMINISTRADOR' || acceso === 'PROFESOR') { 
                                                    //        return agendar_una_clase_no_cliente( req, res );
                                                    //    }else {
                                                    //            //return agendar_una_clase( req , res )
                                                    //            return res.status( 200 ).json({
                                                    //                    msg : 'El usuario no posee el rol adecuado'
                                                    //            })
                                                    //    }
                                                    //} 
                                );






module.exports = router_agendamientos_clase;





