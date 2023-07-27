
const Router = require( 'express' )

const { actualizar_rol, 
        borrar_rol, 
        crear_rol, 
        obtener_roles } = require( '../controlers/roles_controler' );


const router_rol = Router();


router_rol.get( '/', obtener_roles );

router_rol.post( '/', crear_rol );

router_rol.delete( '/:id', borrar_rol );

router_rol.put( '/:id', actualizar_rol );



module.exports = router_rol;
