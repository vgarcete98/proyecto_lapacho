const Router = require( 'express' );


const {  
            generar_compras_club,
            obtener_compras_club
        } = require( '../controlers/compras_controller' );




const router_compras = Router();


router_compras.get( '/obtener_compras_club', [  ], obtener_compras_club );

router_compras.post( '/generar_compras_club', [  ], generar_compras_club )





module.exports = { router_compras }

