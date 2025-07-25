const Router = require( 'express' )

const {
        generar_documentos_factura,
        obtener_ultimo_nro_factura,
        registrar_datos_factura,
        anular_documento_factura
    } = require( '../controlers/facturacion_controller' )
const router_facturacion = Router();


const {
    verificar_existe_talonario_vigente,
    verificar_numeracion_talonario
} = require( '../middlewares/verificar_datos_facturas' );
const { obtener_ultima_caja_abierta } = require('../helpers/obtener_ultima_caja_abierta');



router_facturacion.post( '/generar_documentos_factura', [ verificar_existe_talonario_vigente, verificar_numeracion_talonario ], generar_documentos_factura );


router_facturacion.post( '/anular_factura', [ obtener_ultima_caja_abierta ], anular_documento_factura )

router_facturacion.get( '/obtener_ultimo_nro_factura', [], obtener_ultimo_nro_factura );


router_facturacion.post( '/registrar_datos_factura', [ verificar_existe_talonario_vigente, verificar_numeracion_talonario ], registrar_datos_factura );

module.exports = {
    router_facturacion
}