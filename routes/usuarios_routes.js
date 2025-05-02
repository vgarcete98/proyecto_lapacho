const Router = require( 'express' );

const {  
    crear_usuario,
    editar_usuario,
    obtener_usuarios,
    eliminar_usuario
} = require( '../controlers/usuarios_controller' );
const { validar_existe_socio, comprobar_existe_socio, comprobar_existe_socio_usuario } = require('../middlewares/validar_existe_socio');

const router_usuarios = Router();




router_usuarios.get( '/obtener_socios_usuarios', [  ], obtener_usuarios );

router_usuarios.post( '/crear_socio_usuario', [ comprobar_existe_socio_usuario ], crear_usuario );
router_usuarios.put( '/editar_socio_usuario', [ comprobar_existe_socio_usuario ], editar_usuario );


router_usuarios.delete( '/eliminar_socio_usuario', [  ], eliminar_usuario );






module.exports = { router_usuarios };