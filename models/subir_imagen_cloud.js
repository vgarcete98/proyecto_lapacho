const cloudinary = require('cloudinary').v2

cloudinary.config( "cloudinary://269793283481393:PJUGKKFE41EtagkayHmwRy1PhSM@dz0rmq6ol" );

// Upload an image
const subir_imagen =  async ( archivo ) =>{
    
    console.log( archivo )
    try {
        const { tempFilePath  } = archivo;
        let resultado = await cloudinary.uploader.upload( tempFilePath );          
        console.log(resultado, '---> test Subida');
    
        return resultado;
        
    } catch (error) {
        console.log( error )
        return '';
    }
    
 }

// Optimize delivery by resizing and applying auto-format and auto-quality


//    cloudinary.config()

//        fetch_format: 'auto',
//        quality: 'auto',
//        width: 500,
//        height: 500,
//        secure : true,
//        crop : 'fill'
//    });
//    console.log( url_imagen );
//
//    url_imagen = cloudinary.url( `${id_imagen}`, { transformation : [
//        {width: 500, height: 500, secure : true, crop : 'fill'}
//    ]});
//    return url_imagen;
//}



module.exports = {
    subir_imagen,
    //obtener_imagen
}