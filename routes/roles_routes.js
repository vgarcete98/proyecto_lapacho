
const Router = require( 'express' )

const { actualizar_rol, 
        borrar_rol, 
        crear_rol, 
        obtener_roles,
        crear_rol_con_accesos,
        actualizar_accesos_rol,
        quitar_accesos_rol} = require( '../controlers/roles_controler' );
const { obtener_accesos_rol } = require('../controlers/accesos_controller');

const router_rol = Router();


router_rol.get( '/obtener_roles', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_roles );

//router_rol.get( '/modulos', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_modulos_x_rol );

router_rol.post( '/crear_rol', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], crear_rol );

//CREAR EL ROL CON TODOS SUS ACCESOS 

router_rol.post( '/crear_rol_con_accesos', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], crear_rol_con_accesos );

router_rol.delete( '/borrar_rol', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], borrar_rol );

router_rol.put( '/editar_rol', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], actualizar_rol );


router_rol.get( '/obtener_accesos_rol', [  ], obtener_accesos_rol )

router_rol.put( '/actualizar_accesos_rol', [  ], actualizar_accesos_rol );

router_rol.delete( '/quitar_accesos_rol', [  ], quitar_accesos_rol )


module.exports = router_rol;
