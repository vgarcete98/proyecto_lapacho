const Router = require( 'express' )


const router_profesores = Router();

const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');

const {  
        actualizar_profesor,
        crear_profesor,
        eliminar_profesor,
        obtener_nomina_profesores,
        obtener_profesor } = require( '../controlers/profesores_controller' )



router_profesores.get( '/', );

router_profesores.get( '/', [ validar_token, validar_rol_usuario ], obtener_nomina_profesores );

router_profesores.post( '/', [ validar_token, validar_rol_usuario ], obtener_profesor );

router_profesores.put( '/', [ validar_token, validar_rol_usuario ], actualizar_profesor );


router_profesores.delete( '/', [ validar_token, validar_rol_usuario ], eliminar_profesor );

module.exports = router_profesores;