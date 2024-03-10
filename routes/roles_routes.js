
const Router = require( 'express' )

const { actualizar_rol, 
        borrar_rol, 
        crear_rol, 
        obtener_roles, 
        obtener_modulos_x_rol} = require( '../controlers/roles_controler' );

const router_rol = Router();


router_rol.get( '/', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_roles );

//router_rol.get( '/modulos', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_modulos_x_rol );

router_rol.post( '/', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], crear_rol );

router_rol.delete( '/:id', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], borrar_rol );

router_rol.put( '/:id', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], actualizar_rol );



module.exports = router_rol;
