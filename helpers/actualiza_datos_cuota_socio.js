const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();




const actualiza_datos_cuota_socio = async ( id_socio = 0, id_tipo_socio = 0, cuotas_viejas = [] ) => {


    try {
        const fecha_socio_actualizado = new Date();

        if (cuotas_viejas.length > 0 ) {
            console.log( `Obtenidas las cuotas que van a ser anuladas  ${cuotas_viejas.map( (element)=> element.id_cuota_socio )}` );
            //CON ESOS IDS QUE ESTAN EN LAS VENTAS TENGO QUE VER CUALES TIENEN FECHA DE VENCIMIENTO CUMPLIDAS
            let cuotas_anuladas;
            for (let index = 0; index < cuotas_viejas.length; index++ ) {
                let { id_cuota_socio } = cuotas_viejas[index];

                console.log( `Anulando la cuota ${id_cuota_socio}` );
                cuotas_anuladas = await prisma.cuotas_socio.update( {
                                                                        where : { 
                                                                            id_cuota_socio : id_cuota_socio,
                                                                        },
                                                                        data :{
                                                                            estado : 'ANULADO'
                                                                        }
                                                                    } );
                console.log( `Cuotas Anuladas  ${ cuotas_anuladas }` );
            }
                                                            
        }

        

    } catch (error) {
        console.log( error );
    }


}



module.exports = {
    actualiza_datos_cuota_socio
}

