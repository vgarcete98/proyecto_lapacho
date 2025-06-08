var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");


const encriptar_solicitud = ( body = {} )=>{




    // Encriptado
    var ciphertext = AES.encrypt(JSON.stringify(body),process.env.ENCRYPTS3CR3TEDK3Y).toString();
    
    // Desencriptado


    
     // 

    return ciphertext;


}





const encriptar_password = ( password = "" )=> {


    var encriptado = AES.encrypt(password,process.env.ENCRYPTS3CR3TEDK3Y).toString();

    return encriptado;
}




const desencriptar_password = ( password_encriptado = "" ) =>{
    // Desencriptado
    var bytes  = AES.decrypt(password_encriptado, process.env.ENCRYPTS3CR3TEDK3Y);
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    console.log(decryptedData); // 

    return decryptedData;
}


module.exports = {encriptar_solicitud, encriptar_password, desencriptar_password}