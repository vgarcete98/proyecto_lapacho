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


router_profesores.post( '/', [  comprobar_profesor_existe ], crear_profesor );

router_profesores.get( '/', [ ], obtener_nomina_profesores );

router_profesores.get( '/:id_profesor_cons', [ ], obtener_profesor );

router_profesores.get( '/cedula/nombre', [ ], obtener_profesor_cedula_nombre );


router_profesores.put( '/:id_profesor_update', [], actualizar_profesor );


router_profesores.delete( '/:id_profesor_delete', [ ], eliminar_profesor );

module.exports = router_profesores;