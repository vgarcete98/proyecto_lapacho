const Router = require( 'express' )

const {
        borrar_tipo_de_cuota,
        crear_tipo_de_cuota,
        editar_tipo_de_cuota,
        obtener_tipos_de_cuota } = require( '../controlers/tipo_cuota_controller' );


const router_tipo_cuota = Router();


router_tipo_cuota.get( '/', [  ], obtener_tipos_de_cuota );

router_tipo_cuota.post( '/', [  ], crear_tipo_de_cuota );
router_tipo_cuota.put( '/', [  ], editar_tipo_de_cuota );
router_tipo_cuota.delete( '/', [  ], borrar_tipo_de_cuota );

module.exports = router_tipo_cuota;