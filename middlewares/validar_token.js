const { request, response } = require('express');

const jwt = require('jsonwebtoken');

const validar_token = async ( req = request, res = response, next ) =>{

    if ( req.path = '/auth/login' ){

        next();

    }else{
        const token = req.header('x_token');
        //console.log( token )
        
        if( !token ) { 
            return res.status( 401 ).json({
                msg : 'No se mando token en la peticion'
            })
        }
    
        try {
            
            const payload = jwt.verify( token,process.env.SECRET0RPR1VAT3K3Y );
            //console.log ( payload );
            req.token_trad = payload;
            next();
        
        } catch (error) {
            res.status( 400 ).json({
                msg : "El token enviado no es valido"
            })
        }

    }


    
}



module.exports = validar_token;