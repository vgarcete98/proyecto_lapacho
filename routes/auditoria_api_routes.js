const Router = require( 'express' );




const { obtener_solicitudes_a_api } = require('../controlers/auditoria_api_controller')


const router_audit_api = Router();



router_audit_api.get( '/', obtener_solicitudes_a_api );

module.exports = router_audit_api;