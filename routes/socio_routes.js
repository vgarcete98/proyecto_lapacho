
const Router = require( 'express' )

const { actualizar_socio, 
        borrar_socio, 
        crear_socio, 
        obtener_socio, 
        obtener_socios,
        obtener_socios_detallados,
        //obtener_socio_cedula, 
        obtener_socio_cedula_nombre,
        crear_socio_dependientes,
        obtener_socio_usuario,
        crear_socio_usuario,
        actualizar_socio_usuario} = require( '../controlers/socio_controler' );
const { crear_tipo_socio, obtener_tipos_socios } = require( '../controlers/tipo_socio_controller' );


const { validar_existe_socio, comprobar_existe_socio, validar_existe_socio_y_dependientes, validar_existe_socio_usuario }= require('../middlewares/validar_existe_socio');
const router_socio = Router();


router_socio.get( '/obtener_socios',[  ], obtener_socios );

router_socio.get( '/socios_detalle',[ ], obtener_socios_detallados );

router_socio.get( '/socio_cedula/nombre',[], obtener_socio_cedula_nombre );

router_socio.get( '/crear_tipo_socio', [], crear_tipo_socio );

router_socio.get( '/obtener_tipo_socios', [ ], obtener_tipos_socios );

router_socio.get( '/obtener_socio',[  comprobar_existe_socio ], obtener_socio );

router_socio.post( '/crear_socio',[  validar_existe_socio ], crear_socio );

router_socio.get( '/obtener_socio_usuario',[  comprobar_existe_socio ], obtener_socio_usuario );

router_socio.post( '/crear_socio_usuario',[  validar_existe_socio_usuario ], crear_socio_usuario );

router_socio.put( '/editar_socio_usuario',[ comprobar_existe_socio ], actualizar_socio_usuario );

router_socio.post( '/crear_socio_dependientes',[ validar_existe_socio_y_dependientes ], crear_socio_dependientes );

router_socio.put( '/borrar_socio',[  comprobar_existe_socio ], borrar_socio );

router_socio.put( '/editar_socio',[ comprobar_existe_socio ], actualizar_socio );



module.exports = router_socio;
