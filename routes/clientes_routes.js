const Router = require( 'express' );
const { request, response } = require('express')

const router_clientes = Router();


const { actualizar_cliente, borrar_cliente, crear_cliente, obtener_clientes } = require( '../controlers/clientes_controller' );


const { comprobar_existe_cliente_no_socio } = require( '../helpers/comprobar_existe_cliente' )







router_clientes.get( '/obtener_clientes',[ ], obtener_clientes );

router_clientes.post( '/crear_cliente',
                    [   async (req = request, res = response, next)=> { 

                        const { cedula } = req.body;
                            ( comprobar_existe_cliente_no_socio(cedula) === true)? 
                                res.status( 400 ).json( {
                                    status : false,
                                    msg : 'Ese cliente ya se encuentra registrado',
                                    descripcion : `El cliente con cedula : ${cedula} ya se encuentra creado`
                                } )
                            : next();
                        } 
                    ], 
                    crear_cliente );

router_clientes.put( '/actualizar_cliente',[ ], actualizar_cliente );

router_clientes.delete( '/eliminar_cliente',[], borrar_cliente);




module.exports = router_clientes;

