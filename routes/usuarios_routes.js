const Router = require( 'express' );

const {  
    crear_usuario,
    editar_usuario,
    obtener_usuarios,
    eliminar_usuario
} = require( '../controlers/usuarios_controller' )

const router_usuarios = Router();




router_usuarios.get( '/obtener_usuarios', [  ], obtener_usuarios );

router_usuarios.post( '/crear_usuario', [  ], crear_usuario );
router_usuarios.put( '/editar_usuario', [  ], editar_usuario );


router_usuarios.delete( '/eliminar_usuario', [  ], eliminar_usuario );






module.exports = { router_usuarios };