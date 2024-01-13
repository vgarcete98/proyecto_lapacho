const { request, response } = require('express');

const EXTENSIONES_VALIDAS = [
    'JPEG',
    'PNG',
    'GIF',
    'JPG',
    //'TEST'
];




const validar_extesion_archivo = async ( req = request, res = response, next ) =>{

    try {

        const { file } = req.body;
        next();
    } catch (error) {
        console.log( error );
        res.status( 500 ).json( {
            status : false,
            msg : 'No se pudo verificar que haya un socio repetido',
            //persona
        } );
    }


    
}