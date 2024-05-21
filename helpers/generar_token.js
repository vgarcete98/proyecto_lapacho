const { sign } = require('jsonwebtoken');



const generar_token = ( id_usuario = '', tipo_usuario = '', rol = '' )=>{

    return new Promise( ( resolve, reject ) =>{

        const payload = { id_usuario, tipo_usuario, rol };
        sign( payload, process.env.SECRET0RPR1VAT3K3Y, 
            { expiresIn: '4h' }, 
            ( error, token )=>{

                if( error ){
                    console.log ( "Ha ocurrido un error " + error );
                    reject ( "No se pudo generar el token" );
                }else {
                    resolve( token );
                }


            }
    
        
        );


    }
    
    );

};


module.exports = {

    generar_token
};