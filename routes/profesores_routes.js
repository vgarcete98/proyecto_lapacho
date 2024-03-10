const Router = require( 'express' )


const router_profesores = Router();


const {  
        actualizar_profesor,
        crear_profesor,
        eliminar_profesor,
        obtener_nomina_profesores,
        obtener_profesor,
        obtener_profesor_cedula_nombre } = require( '../controlers/profesores_controller' );
const comprobar_profesor_existe = require('../helpers/comprobar_profesor_existe');
const { multer_instance1, multer_instance2 } = require( '../models/multer_config' )
//const upload = multer_instance1;


router_profesores.post( '/', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ comprobar_profesor_existe ], crear_profesor );

router_profesores.get( '/', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], /*upload.single('archivo'),*/obtener_nomina_profesores );

router_profesores.get( '/:id_profesor_cons', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_profesor );

router_profesores.get( '/cedula/nombre', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_profesor_cedula_nombre );


router_profesores.put( '/:id_profesor_update', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], actualizar_profesor );


router_profesores.delete( '/:id_profesor_delete', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ /*comprobar_profesor_existe*/ ], eliminar_profesor );

module.exports = router_profesores;