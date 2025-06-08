const Server = require( './models/server' );



const server = new Server();

server.cargar_accesos_rol();
//server.listar_rutas();
server.listen();



