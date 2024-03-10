const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

//PARA ENCRIPTADO Y DESENCRIPTADO 
//----------------------------------------------------
var AES = require("crypto-js/aes");
//var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
//----------------------------------------------------


const desencriptar_body_login = async ( req = request, res = response, next )=>{

    try {
                
        //HAY QUE DESENCRYPTAR EL BODY DE LA REQUEST QUE ESTA VINIENDO
        
        const {data} = req.body;
        const { path } = req;
        if (data === undefined && path !== '/auth/login'){
            //SOLO PARA EL LOGIN SOLICITO EL ENCRIPTADO 
            //console.log( `Es la ruta ${path}` );
            next()
        }else {
            // CASO CONTRARIO PARA OPERACIONES DE INSERT, DELETE, UPDATE 
            var bytes  = AES.decrypt(data, process.env.ENCRYPTS3CR3TEDK3Y);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            req.body = decryptedData
            next()                    
        }

    } catch (error) {
        res.status(500).json( 
            {
                status : false,
                msj : `Ha ocurrido un error al desencriptar  ${ error }` ,
                //nuevo_tipo_socio
            }
        );                
    }

}


module.exports = { desencriptar_body_login }