
const Router = require( 'express' )

const { actualizar_socio, 
        borrar_socio, 
        crear_socio, 
        obtener_socio, 
        obtener_socios,
        obtener_socios_detallados } = require( '../controlers/socio_controler' );

const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
const validar_existe_usuario = require('../middlewares/validar_existe_usuario');

const router_socio = Router();


router_socio.get( '/',[ validar_token, validar_rol_usuario ], obtener_socios );

router_socio.get( '/socios_detalle',[ validar_token, validar_rol_usuario ], obtener_socios_detallados );

router_socio.get( '/:id',[ validar_token, validar_rol_usuario, validar_existe_usuario ], obtener_socio );

router_socio.post( '/',[ validar_token, validar_rol_usuario, validar_existe_usuario ], crear_socio );

router_socio.delete( '/:id',[ validar_token , validar_rol_usuario], borrar_socio );

router_socio.put( '/:id',[ validar_token , validar_rol_usuario], actualizar_socio );



module.exports = router_socio;
