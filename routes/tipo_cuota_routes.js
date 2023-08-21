const Router = require( 'express' )

const {
        borrar_tipo_de_cuota,
        crear_tipo_de_cuota,
        editar_tipo_de_cuota,
        obtener_tipos_de_cuota } = require( '../controlers/tipo_cuota_controller' );

const validar_token = require( '../middlewares/validar_token' );

const router_tipo_cuota = Router();


router_tipo_cuota.get( '/', [ validar_token ], obtener_tipos_de_cuota );

router_tipo_cuota.post( '/', [ validar_token ], crear_tipo_de_cuota );
router_tipo_cuota.put( '/', [ validar_token ], editar_tipo_de_cuota );
router_tipo_cuota.delete( '/', [ validar_token ], borrar_tipo_de_cuota );

module.exports = router_tipo_cuota;