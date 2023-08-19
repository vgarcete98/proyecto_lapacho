
const Router = require( 'express' )

const { actualizar_usuario,
        borrar_usuario,
        crear_usuario,
        obtener_accesos_usuario,
        obtener_usuario,
        obtener_usuarios } = require( '../controlers/usuario_controller' );

const validar_token = require( '../middlewares/validar_token' );
const validar_rol_usuario = require('../middlewares/validar_rol_usuario');
const router_usuario = Router();


router_usuario.get( '/', obtener_usuarios );
router_usuario.get( '/:id', obtener_usuario );
router_usuario.get( '/accesos', obtener_accesos_usuario );

router_usuario.post( '/', crear_usuario );

router_usuario.delete( '/:id', borrar_usuario );

router_usuario.put( '/:id', actualizar_usuario );



module.exports = router_usuario;
