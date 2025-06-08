const { request, response } = require('express');

const jwt = require('jsonwebtoken');

const validar_token = async ( req = request, res = response, next ) =>{

    if ( req.path === '/auth/login' ){

        next();

    }else{

        
        try {
            const { x_token } = req.headers;
            
            
            if( !x_token ) { 
                return res.status( 401 ).json({
                    msg : 'No se mando token en la peticion'
                })
            }
            const payload = jwt.verify( x_token,process.env.SECRET0RPR1VAT3K3Y );
            ;
            req.token_trad = payload;
            next();
        
        } catch (error) {
            res.status( 400 ).json({
                msg : `El token enviado no es valido : ${ error }`
            })
        }

    }


    
}



module.exports = validar_token;