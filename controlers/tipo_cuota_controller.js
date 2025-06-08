const { request, response } = require('express')

const { PrismaClient } = require('@prisma/client');
const { json } = require('body-parser');

const prisma = new PrismaClient();



const obtener_tipos_de_cuota = async ( req = request, res = response ) => {

    try {
        const tipos_cuota = await prisma.tipo_cuota.findMany(  );

        const tiposCuota = [];
        tipos_cuota.forEach( ( value )=>{

            const { creadoen, desc_tipo_cuota, editadoen, id_tipo_cuota, monto_cuota } = value;
            

            tiposCuota.push( {
                creadoEn : creadoen,
                descripcion : desc_tipo_cuota,
                editadoEn : editadoen,
                montoDeCuota : monto_cuota,
                idTipoCuota : id_tipo_cuota
            } );

        } )

        res.status( 200 ).json(
            {
                status : true,
                msg : 'Tipos de cuota en el club',
                tiposCuota
            }
        );        
    } catch (error) {
        console.log( error );
        res.status( 400 ).json(
            {
                status : false,
                msg : 'Ha ocurrido un error al consultar los tipos de cuota : ' + error
            }
        ); 
        
    }



}


const crear_tipo_de_cuota = async ( req = request, res = response ) => {

    try {
        const { descripcion, montoCuota } = req.body;

        const nuevo_tipo_cuota = await prisma.tipo_cuota.create( { data : {  
                                                                        monto_cuota : montoCuota,
                                                                        desc_tipo_cuota : descripcion,
                                                                        creadoen : new Date()
                                                                    } 
                                                                } );
        
        const { creadoen, desc_tipo_cuota, editadoen, id_tipo_cuota, monto_cuota } = nuevo_tipo_cuota;
        if ( nuevo_tipo_cuota > 0 ) {

            res.status( 200 ).json(

                {
                    status : true,
                    msg : 'Nuevo tipo de cuota Creado',
                    tipoCuota :{
                        creadoEn : creadoen,
                        descripcion : desc_tipo_cuota,
                        editadoEn : editadoen,
                        idTipoCuota : id_tipo_cuota,
                        montoDeCuota : monto_cuota
                    } 
                }
            );

        } else {
            res.status( 200 ).json(

                {
                    status : true,
                    msg : 'No se pudo crear el tipo de cuota',
                    status : false
                }
            );
        }        
    } catch (error) {
        console.log( error );
        res.status( 400 ).json(

            {
                status : true,
                msg : 'No se pudo crear el tipo de cuota',
                status : false
            }
        );
    }




}


const editar_tipo_de_cuota = async ( req = request, res = response ) => {

    try {
        const { descripcion, montoCuota } = req.body;
        const { id_tipo_cuota } = req.params;
        const idTipoCuota  = id_tipo_cuota;
        const editar_tipo_de_cuota = await prisma.tipo_cuota.update( { 
                                                                        data : { desc_tipo_cuota : descripcion, monto_cuota : montoCuota },
                                                                        where : { id_tipo_cuota : idTipoCuota } 
                                                                    } );


        const { creadoen, desc_tipo_cuota, editadoen,  monto_cuota } = editar_tipo_de_cuota;

        if ( editar_tipo_de_cuota > 0 ) { 

            res.status( 200 ).json(

                {
                    status : true,
                    msg : 'Monto actualizado de cuotas',
                    tipoCuota : {
                        creadoEn : creadoen, 
                        descTipoCuota : desc_tipo_cuota, 
                        editadoEn : editadoen, 
                        montoCuota : monto_cuota,
                        idTipoCuota
                    }
                }
            );


        } else {
            res.status( 400 ).json(
                {
                    status : false,
                    msg : 'No se encontro el registro para editar'
                }
            );
        }        
    } catch (error) {
        console.log( error );
        res.status( 400 ).json(
            {
                status : false,
                msg : `Ocurrio un error al editar el registro : ${ error }`
            }
        );
    }



}


const borrar_tipo_de_cuota = async ( req = request, res = response ) => {

    try {
        const { descripcion, montoCuota } = req.body;
        const { id_tipo_cuota } = req.params;
        const idTipoCuota  = id_tipo_cuota;
        const editar_tipo_de_cuota = await prisma.tipo_cuota.update( { 
                                                                        data : { desc_tipo_cuota : descripcion, monto_cuota : montoCuota },
                                                                        where : { id_tipo_cuota : idTipoCuota } 
                                                                    } );


        const { creadoen, desc_tipo_cuota, editadoen,  monto_cuota } = editar_tipo_de_cuota;

        if ( editar_tipo_de_cuota > 0 ) { 

            res.status( 200 ).json(

                {
                    status : true,
                    msg : 'Tipo de cuota borrado',
                    tipoCuota : {
                        creadoEn : creadoen, 
                        descTipoCuota : desc_tipo_cuota, 
                        editadoEn : editadoen, 
                        montoCuota : monto_cuota,
                        idTipoCuota : typeof idTipoCuota === 'bigint' ? Number(idTipoCuota) : idTipoCuota
                    }
                }
            );


        } else {
            res.status( 400 ).json(
                {
                    status : false,
                    msg : 'No se encontro el registro para eliminar'
                }
            );
        }        
    } catch (error) {
        console.log( error );
        res.status( 400 ).json(
            {
                status : false,
                msg : `Ocurrio un error al eliminar el registro : ${ error }`
            }
        );
    }


}

module.exports = {
    obtener_tipos_de_cuota,
    borrar_tipo_de_cuota,
    crear_tipo_de_cuota,
    editar_tipo_de_cuota
    
}