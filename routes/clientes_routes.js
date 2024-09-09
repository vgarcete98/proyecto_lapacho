const Router = require( 'express' );


const router_clientes = Router();


const { actualizar_cliente, borrar_cliente, crear_cliente, obtener_clientes } = require( '../controlers/clientes_controller' );




router_clientes.get( '/obtener_clientes',[ ], obtener_clientes );

router_clientes.post( '/crear_cliente',[ ], crear_cliente );

router_clientes.put( '/actualizar_cliente',[ ], actualizar_cliente );

router_clientes.delete( '/eliminar_cliente',[], borrar_cliente);




module.exports = router_clientes;

