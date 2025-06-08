const { PrismaClient } = require('@prisma/client');

var expressWinston = require('express-winston');
var winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(), // Para ver los logs en consola
    ],
    format: winston.format.json(),
});

const prisma = new PrismaClient();



const middleware_request = async () => {


    /*const fecha = new Date();

    const tipo = req.method;
    const ruta = req.url;
    const cuerpo_solicitud = req.body;
    const codigo_status = req.statusCode
    
    const nuevo_log = await prisma.api_logs.create( {

        //PROXIMAMENTE AÑADIR LA FECHA DE SOLICITUD
        data : {

            fecha_solicitud : fecha,
            request_body : JSON.stringify(cuerpo_solicitud ),
            type_request : tipo,
            ruta_solicitud : ruta,
            status_code : 200//codigo_status
        }
    } );

    /*console.log( 'middleware de solicitudes' );*/
    //next();

    return expressWinston.logger({
        winstonInstance: logger,
        msg: "{{req.method}} {{req.url}}",
        requestWhitelist: ["body"],
        responseWhitelist: ["body"],
        dynamicMeta: async (req, res) => {
            return {
                method: req.method,
                url: req.url,
                status: res.statusCode,
                request: req.body,
                response: res.body,
            };
        },
        metaField: null, // Evita anidamiento innecesario
        ignoreRoute: () => false, // Loggea todas las rutas
        level: "info",
        statusLevels: true,
        async dynamicMeta(req, res) {
            await prisma.api_logs.create({
                data: {
                    ruta_solicitud: req.url,
                    fecha_solicitud: new Date(),
                    type_request: req.method,
                    status_code: res.statusCode,
                    request_body: req.body,
                    response_body: res.body,
                },
            });
        }
    });

}


const middleware_captura_errores = async () => {


    return expressWinston.errorLogger({
        winstonInstance: logger,
        async dynamicMeta(req, res, err) {
            await prisma.log.create({
                data: {

                    ruta_solicitud: req.url,
                    fecha_solicitud: new Date(),
                    type_request: req.method,
                    status_code: res.statusCode,
                    request_body: req.body,
                    response_body: { error: err.message }
                },
            });
        }
    })
}







module.exports = { middleware_request, middleware_captura_errores };