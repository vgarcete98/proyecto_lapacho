
const Router = require( 'express' )

const { actualizar_socio, 
        borrar_socio, 
        crear_socio, 
        obtener_socio, 
        obtener_socios,
        obtener_socios_detallados,
        //obtener_socio_cedula, 
        obtener_socio_cedula_nombre} = require( '../controlers/socio_controler' );

//const validar_existe_usuario = require('../middlewares/validar_existe_usuario');
const { validar_existe_socio, comprobar_existe_socio }= require('../middlewares/validar_existe_socio');
const router_socio = Router();


router_socio.get( '/',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_socios );

router_socio.get( '/socios_detalle',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_socios_detallados );

router_socio.get( '/socio_cedula/nombre',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_socio_cedula_nombre )



router_socio.get( '/:id_socio',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ comprobar_existe_socio ], obtener_socio );

router_socio.post( '/',[ /*validar_token,*/ /*/*validar_rol_usuario,*/ validar_existe_socio ], crear_socio );

router_socio.delete( '/:id_socio',[ /*/*validar_rol_usuario,*/ comprobar_existe_socio ], borrar_socio );

router_socio.put( '/:id_socio',[ comprobar_existe_socio ], actualizar_socio );



module.exports = router_socio;
