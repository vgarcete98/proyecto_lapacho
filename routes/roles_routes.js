
const Router = require( 'express' )

const { actualizar_rol, 
        borrar_rol, 
        crear_rol, 
        obtener_roles} = require( '../controlers/roles_controler' );

const router_rol = Router();


router_rol.get( '/obtener_roles', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_roles );

//router_rol.get( '/modulos', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_modulos_x_rol );

router_rol.post( '/crear_rol', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], crear_rol );

router_rol.delete( '/borrar_rol', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], borrar_rol );

router_rol.put( '/editar_rol', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], actualizar_rol );



module.exports = router_rol;
