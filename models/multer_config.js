const multer  = require('multer');
const { request, response } = require('express')

const { v4: uuidv4 } = require('uuid'); 


//REQUIERO UNO PARA EL TEMA DE LAS CUOTAS Y OTRO PARA EL TEMA DE LOS GASTOS
//QUE SE VAN A IR CARGANDO 


const multer_storage1 = multer.diskStorage(
    {
        destination : './cuotas',
        filename: ( req = request ,file, cb )=>{
            //req.headers['content-type'] = 'multipart/form-data';
            const { filename, originalname } = file ;
            const [ nombre, ext ] = originalname.split( '.' );
            const { nroFactura } = req.body;
            const nombre_imagen = uuidv4() + `.${ ext }`
            //file.filename = nombre_imagen;
            cb( null, nombre_imagen );
            //cb( null, nombre + `.${ ext }` );
        }
    }
);

const multer_instance1 = multer(
    {
        storage : multer_storage1
    }
);

const multer_storage2 = multer.diskStorage(
    {
        destination : './gastos_ingresos',
        filename: ( req = request , file, cb )=>{
            //req.headers['content-type'] = 'multipart/form-data';
            const { filename, originalname } = file ;
            const { nroFactura } = req.body;
            //console.log ( filename, originalname )
            const [ nombre, ext ] = originalname.split( '.' );
            const nombre_imagen = uuidv4() + `.${ ext }`
            //file.filename = nombre_imagen;
            cb( null, nombre_imagen );
        }
    }
);
const multer_instance2 = multer(
    {
        storage : multer_storage2
    }
);


module.exports  = { multer_instance1, multer_instance2 }  ;
