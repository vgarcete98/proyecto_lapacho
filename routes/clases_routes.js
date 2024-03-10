const Router = require( 'express' )


const router_clases = Router();


// VALIDADORES 
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//CONTROLADORES
//----------------------------------------------------------------------------
const { abonar_una_clase,
        agendar_una_clase,
        editar_una_clase,
        obtener_clases_del_dia } = require( '../controlers/agendamiento_clases_controller' );
//----------------------------------------------------------------------------


router_clases.get( '/', obtener_clases_del_dia );

router_clases.post( '/', agendar_una_clase );

router_clases.put( '/abonar_clase', abonar_una_clase );

router_clases.put( '/', editar_una_clase );


module.exports = router_clases;

