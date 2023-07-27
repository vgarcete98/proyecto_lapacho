
const Router = require( 'express' )

const { actualizar_socio, 
        borrar_socio, 
        crear_socio, 
        obtener_socio, 
        obtener_socios } = require( '../controlers/socio_controler' )


const router_socio = Router();


router_socio.get( '/', obtener_socios );

router_socio.get( '/:id', obtener_socio );

router_socio.post( '/', crear_socio );

router_socio.delete( '/:id', borrar_socio );

router_socio.put( '/:id', actualizar_socio );



module.exports = router_socio;
