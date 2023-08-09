const generar_fecha = ( fecha = '' )=>{

    const [ dia, mes, anio ] = fecha.split( '/' );

    return new Date( anio, mes, dia );

};


module.exports = {
    generar_fecha
};