const Router = require( 'express' )
const { request, response } = require('express')

// VALIDADORES 
//------------------------------------------------------------------------
//------------------------------------------------------------------------


const { 
        abonar_x_inscripcion,
        editar_inscripcion,
        inscribirse_a_evento,
        ver_inscripciones_x_evento,
        obtener_cantidad_inscriptos_x_evento,
        obtener_grafico_inscriptos_x_evento_categoria,
        obtener_ganancias_gastos_x_evento,
        ver_todas_las_inscripciones_x_evento,
        agregar_inscripciones_a_venta,
        cerrar_inscripciones_de_evento,
        ver_inscripciones_x_evento_x_categoria} = require( '../controlers/inscripciones_controller' );

const { verificar_edad, verificar_nivel, verificar_sexo } = require('../middlewares/reglas_para_eventos')
const { obtener_data_socio } = require('../helpers/verficar_socio_carga');
const { verificar_requerimientos_usuario } = require('../middlewares/verficar_requerimientos_usuario');
const { verificar_existencia_evento } = require('../middlewares/verificar_existencia_evento');
const { verificar_inscripcion_a_evento } = require('../middlewares/verficar_inscripcion_a_evento');
const { verificar_inscripciones_generadas } = require('../middlewares/verificar_inscripciones_generadas');



const router_inscripciones = Router();



//PARA LOS QUE SON SOCIOS 

router_inscripciones.get( '/ver_inscripciones_x_evento',[ obtener_data_socio ], ver_inscripciones_x_evento );

router_inscripciones.get( '/ver_inscripciones_x_evento_x_categoria', [], ver_inscripciones_x_evento_x_categoria );

router_inscripciones.post( '/agregar_inscripciones_a_venta',[ obtener_data_socio, verificar_inscripciones_generadas ], agregar_inscripciones_a_venta );

router_inscripciones.get( '/obtener_cantidad_inscriptos',[ obtener_data_socio ], obtener_cantidad_inscriptos_x_evento );

router_inscripciones.get( '/obtener_grafico_inscriptos',[ obtener_data_socio ], obtener_grafico_inscriptos_x_evento_categoria );

router_inscripciones.get( '/obtener_ganancias_gastos_x_evento',[ obtener_data_socio ], obtener_ganancias_gastos_x_evento );

router_inscripciones.put( '/editar_inscripcion',[ obtener_data_socio ], editar_inscripcion );

router_inscripciones.put( '/abonar_x_inscripcion',[ obtener_data_socio  ], abonar_x_inscripcion );

router_inscripciones.post( '/inscribirse_a_evento',
                                [ 
                                        verificar_existencia_evento, 
                                        obtener_data_socio, 
                                        verificar_requerimientos_usuario, 
                                        verificar_inscripcion_a_evento,
                                        verificar_edad, 
                                        verificar_nivel, 
                                        verificar_sexo  
                                ], 
                                //( req = request, res = response ) => {
                                //        const { acceso } = req.body;
                                //        if ( acceso === 'ADMINISTRADOR' ) { 
                                //                return inscribirse_a_evento( req , res )
                                //        }else {
                                //                return res.status( 200 ).json({
                                //                        msg : 'El usuario no es admin'
                                //                })
                                //        }
                                //}
                                inscribirse_a_evento
                        );

router_inscripciones.get( '/ver_todas_inscripciones_x_evento',[  ], ver_todas_las_inscripciones_x_evento );


router_inscripciones.put( '/cerrar_inscripciones', [  ], cerrar_inscripciones_de_evento);



module.exports = router_inscripciones;