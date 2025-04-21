const Router = require( 'express' );


const {  
            generar_compras_club,
            obtener_compras_club,
            agregar_tipo_egreso
        } = require( '../controlers/compras_controller' );




const router_compras = Router();


router_compras.get( '/obtener_compras_club', [  ], obtener_compras_club );

router_compras.post( '/generar_compras_club', [  ], generar_compras_club );

router_compras.post( '/agregar_tipo_egreso', [  ], agregar_tipo_egreso )



module.exports = { router_compras }

