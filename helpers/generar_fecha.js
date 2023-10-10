const generar_fecha = ( fecha = '' )=>{

    const [ dia, mes, anio ] = fecha.split( '/' );

    return new Date( anio, Number(mes) - 1, dia );

};


module.exports = {
    generar_fecha
};