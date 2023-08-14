const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {

    const primer_rol = "ADMINISTRADOR"
    
    const primer_acceso = "ACCESO_TOTAL"

    //----------------------
    const nombre_admin = "ADMINISTRADOR_CLUB";
    const apellido_admin = "----------------";
    const cedula_admin = "12345678";
    const fecha_admin_nac = new Date();
    //----------------------
    const correo_electronico = "----------------"
    const numero_telefono = "----------------"
    const direccion = "----------------"
    const ruc = "----------------"
    //----------------------

    const primer_tipo_socio = "SOCIO_ADMIN";

    const rol_usuario = await prisma.$executeRaw`INSERT INTO public.roles_usuario(
                                                    descripcion_rol)
                                                VALUES ( ${ primer_rol } )`;

    const acceso_usuario = await prisma.$executeRaw`INSERT INTO public.accesos_usuario(
                                                        id_rol_usuario, descripcion_acceso)
                                                    VALUES ( 1, ${ primer_acceso } )`;


    const persona_admin = await prisma.$executeRaw`INSERT INTO public.persona(
                                                        nombre, apellido, cedula, fecha_nacimiento)
                                                    VALUES ( ${nombre_admin}, ${apellido_admin}, ${cedula_admin}, ${fecha_admin_nac} )`;

    const tipo_socio_admin = await prisma.$executeRaw`INSERT INTO public.tipo_socio(
                                                            desc_tipo_socio)
                                                        VALUES ( ${ primer_tipo_socio } )`;


    const socio_admin = await prisma.$executeRaw`INSERT INTO public.socio(
                                                        id_tipo_socio, id_persona, correo_electronico, numero_telefono, direccion, ruc)
                                                    VALUES ( 1, 1, ${ correo_electronico }, ${ numero_telefono }, ${ direccion }, ${ ruc } )`;

    const pass_admin = process.env.C0NTR4SEN1A_4DM1N;
    const usuario_admin = await prisma.$executeRaw`INSERT INTO public.usuario(
        id_socio, id_acceso, tipo_usuario, nombre_usuario, contrasea)
    VALUES ( 1, 1, 1, ${ primer_acceso }, ${ pass_admin } )`;

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