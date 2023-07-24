
const Router = require( 'express' )

const { actualizar_socio, 
        borrar_socio, 
        crear_socio, 
        obtener_socio, 
        obtener_socios } = require( '../controlers/socio_controler' )


const router_socio = Router();


router_socio.get( '/', obtener_socios );

router_socio.post( '/', crear_socio );

router_socio.delete( '/', borrar_socio );

router_socio.put( '/', actualizar_socio );



module.exports = router_socio;
