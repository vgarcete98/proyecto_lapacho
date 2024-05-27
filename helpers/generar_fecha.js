const generar_fecha = ( fecha = '' )=>{

    if ( fecha.indexOf( '/' ) !== -1) {

        const [ dia, mes, anio ] = fecha.split( '/' );
    
        return new Date( anio, Number(mes) - 1, dia );
    }else {
        return new Date( fecha );
    }


};


module.exports = {
    generar_fecha
};