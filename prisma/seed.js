const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {


    const rol_usuario = await prisma.roles_usuario.upsert({

        where : { descripcion_rol : "ADMINISTRADOR" }, //El rol que deberia buscar si existe
        update : {}, // Si existe no hacer nada
        create : {
            descripcion_rol : "ADMINISTRADOR"
        }
    });

    const acceso_usuario = await prisma.accesos_usuario.upsert({

        where : { descripcion_acceso : "ACCESO_TOTAL" }, //El rol que deberia buscar si existe
        update : {}, // Si existe no hacer nada
        create : {
            id_rol_usuario : 1,
            descripcion_acceso : "ACCESO_TOTAL"
        }
    });

    const persona_admin = await prisma.persona.upsert( {
        where : { nombre : "ADMINISTRADOR_CLUB" }, //El rol que deberia buscar si existe
        update : {}, // Si existe no hacer nada
        create : {
            tipo_socio : 1,
            nombre : "ADMINISTRADOR_CLUB",
            apellido : "----------------",
            fecha_nacimiento : new Date(),
            cedula : 12345678
        }

    } );

    const tipo_socio_admin = await prisma.tipo_socio.upsert( {  } );

    const socio_admin = await prisma.socio.upsert( {
        where : { nombre : "SOCIO_ADMIN" }, //El rol que deberia buscar si existe
        update : {}, // Si existe no hacer nada
        create : {
            nombre : "SOCIO_ADMIN"
        }
    });



}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })