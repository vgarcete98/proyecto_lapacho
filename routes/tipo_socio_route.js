const Router = require( 'express' );


const { crear_tipo_socio, obtener_tipos_socios } = require( '../controlers/tipo_socio_controller' );
const tipo_socio_router = Router();


tipo_socio_router.get( '/', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], crear_tipo_socio );

tipo_socio_router.post( '/', [ /*validar_token,*/ /*/*validar_rol_usuario,*/ ], obtener_tipos_socios );




module.exports = tipo_socio_router;
