const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { generar_fecha } = require( '../helpers/generar_fecha' )


async function main() {
  
  //----------------------
  const nombre_admin = "ADMINISTRADOR_CLUB";
  const apellido_admin = "----------------";
  const cedula_admin = "12345678";
  const fecha_admin_nac = new Date();
  //----------------------
  const correo_electronico = "----------------";
  const numero_telefono = "----------------";
  const direccion = "----------------";
  const ruc = "----------------";
  //----------------------

  const tipos_de_socio = {
    socio_admin : "SOCIO_ADMIN",
    socio_normal : "SOCIO_COMUN",
    socio_familiar : "SOCIO_FAMILIAR",
    socio_menor_edad : "SOCIO_MENOR"

  }

  const eventos_club = { 

    torneo_interno : "TORNEO",
    liga_interna : "LIGA_INTERNA",
    aniversario_club : "ANIVERSARIO_CLUB",
    san_juan : "SAN_JUAN_CLUB",
    cena_fin_anio : "CENA_FIN_ANIO"
  }

  // PIRMER ROL CREADO
  //---------------------------------------------------------------------------------
  const rol_usuario = await prisma.roles_usuario.createMany( { data : [
                                                                        { descripcion_rol : 'ADMINISTRADOR' },
                                                                        { descripcion_rol :  'SOCIO' },
                                                                        { descripcion_rol :  'SOCIO_PROFESOR' }
                                                                      ] 
                                                          } );
  //---------------------------------------------------------------------------------

  // ACCESOS PARA ESE USUARIO
  //---------------------------------------------------------------------------------
  const acceso_usuario = await prisma.accesos_usuario.createMany( { data : [
                                                                              { descripcion_acceso : 'ACCESO_TOTAL', id_rol_usuario : 1 },
                                                                              { descripcion_acceso : 'ACCESO_NORMAL', id_rol_usuario : 2 },
                                                                              { descripcion_acceso : 'ACCESO_PROFESOR', id_rol_usuario : 3 },
                                                                            ] 
                                                                } );
  //---------------------------------------------------------------------------------

  // TIPO DE SOCIO QUE MANEJA EL USUARIO
  //---------------------------------------------------------------------------------
  const nuevos_tipos_de_socio = await prisma.tipo_socio.createMany( { data : [
                                                                              { desc_tipo_socio : tipos_de_socio.socio_normal },
                                                                              { desc_tipo_socio : tipos_de_socio.socio_familiar },
                                                                              { desc_tipo_socio : tipos_de_socio.socio_menor_edad },
                                                                              { desc_tipo_socio : tipos_de_socio.socio_admin }
                                                                            ] 
                                                                  } );
  //---------------------------------------------------------------------------------

  // TIPOS DE CUOTA Y TIPO DE DESCUENTO QUE MANEJA LA APLICACION
  //---------------------------------------------------------------------------------
  const tipo_descuento = await prisma.tipo_descuento.createMany( { data : [
                                                                            { desc_tipo_descuento : 'NINGUNO' },
                                                                            { desc_tipo_descuento : 'DESCUENTO_FAMILIAR' },
                                                                            { desc_tipo_descuento : 'DESCUENTO_MENOR' }
                                                                          ] 
                                                                } ); 

  const tipo_de_cuota = await prisma.tipo_cuota.createMany( { data : [
                                                                        { desc_tipo_cuota : 'CUOTA_NORMAL', monto_cuota : 150000 },
                                                                        { desc_tipo_cuota : 'CUOTA_SOCIO_MENOR', monto_cuota : 90000 },
                                                                        { desc_tipo_cuota : 'CUOTA_SOCIO_FAMILIAR', monto_cuota : 130000 }
                                                                      ] 
                                                          } );  
  //---------------------------------------------------------------------------------
  
  // TIPOS DE EVENTOS QUE SE PUEDEN MANEJAR EN EL CLUB
  //---------------------------------------------------------------------------------
  const nuevos_tipos_evento = await prisma.eventos.createMany( { data : [
                                                                            { desc_tipo_evento : eventos_club.aniversario_club },
                                                                            { desc_tipo_evento : eventos_club.cena_fin_anio },
                                                                            { desc_tipo_evento : eventos_club.liga_interna },
                                                                            { desc_tipo_evento : eventos_club.san_juan },
                                                                            { desc_tipo_evento : eventos_club.torneo_interno },
                                                                          ] 
                                                                  } );  
  
  //---------------------------------------------------------------------------------


  //AQUI VENDRIA EL TRIGGER QUE SE ENCARGA DE GENERAR LAS CUOTAS PARA LOS SOCIOS


  const funcion_trigger_cuotas = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION generar_cuotas_socio()
                                                            RETURNS TRIGGER AS $$
                                                            
                                                            DECLARE
                                                                fecha_inicio DATE;
                                                              fecha_loop DATE;
                                                              fecha_vencimiento_cuota DATE; -- SERIA EL 5 DE CADA MES
                                                              meses_a_sumar INT := 36;
                                                              contador INTEGER;
                                                              tipo_cuota BIGINT;
                                                            BEGIN
                                                            
                                                                -- Define el rango de fechas y el producto para el que deseas calcular el total de ventas
                                                                fecha_inicio := NOW();
                                                              fecha_vencimiento_cuota := DATE_TRUNC('month', fecha_inicio);
                                                            
                                                              contador := 1;
                                                              
                                                              IF NEW.ID_TIPO_SOCIO = 1 THEN
                                                                tipo_cuota := 1;				
                                                                ELSE
                                                                    IF NEW.ID_TIPO_SOCIO = 2 THEN --ES UN SOCIO MENOR DE EDAD
                                                                  tipo_cuota := 2;
                                                                  ELSE -- SERIA UN SOCIO FAMILIAR
                                                                  tipo_cuota := 3;			
                                                                  END IF;
                                                                END IF;	
                                                              
                                                              
                                                              fecha_loop := DATE_TRUNC('month', fecha_inicio);
                                                              LOOP
                                                                    -- Incrementa el contador
                                                                    contador := contador + 1;
                                                                    
                                                                fecha_loop := fecha_loop + INTERVAL '1 months';
                                                                fecha_vencimiento_cuota := DATE_TRUNC('month', fecha_loop) + INTERVAL '4 days';
                                                                
                                                                
                                                                INSERT INTO CUOTAS_SOCIO ( id_socio, id_tipo_cuota, id_tipo_descuento, 
                                                                              fecha_vencimiento, descripcion)
                                                                  VALUES ( NEW.ID_SOCIO, 1, tipo_cuota,
                                                                        fecha_vencimiento_cuota, CONCAT ( 'CUOTA : ', fecha_vencimiento_cuota ) );
                                                                          
                                                                
                                                                    -- Comprueba la condición de salida
                                                                    IF contador >36  THEN
                                                                        EXIT; -- Sale del bucle si el contador es mayor que 36
                                                                    END IF;
                                                                END LOOP;
                                                            
                                                              RETURN NEW;
                                                            
                                                            END;
                                                            $$ LANGUAGE plpgsql;`


  const trigger_cuotas = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_generar_cuotas_socio
                                                  AFTER INSERT ON SOCIO
                                                  FOR EACH ROW
                                                  EXECUTE FUNCTION generar_cuotas_socio();`


  // PERSONA QUE MANEJA EL USUARIO
  //---------------------------------------------------------------------------------

  const personas_demo = await prisma.persona.createMany( { data : [ 
                                                                    { 
                                                                      nombre : "Victor", apellido : "Garcete", 
                                                                      cedula : '4365710', fecha_nacimiento : generar_fecha( '29/05/2023' ) 
                                                                    },
                                                                    { 
                                                                      nombre : "ADMINISTRADOR_CLUB", apellido : "----------------", 
                                                                      cedula : '12345678', fecha_nacimiento : new Date() 
                                                                    },
                                                                    { 
                                                                      nombre : "Lucas", apellido : "Torres", 
                                                                      cedula : '1111111', fecha_nacimiento : generar_fecha( '13/05/2000' ) 
                                                                    }

                                                                  ] 
                                                        } );
  //---------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------
  const socios = await prisma.socio.createMany( { data : [  
                                                            { 
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "Victor Garcete", numero_telefono : "0985552004", id_persona : 1
                                                            },

                                                            { 
                                                              id_tipo_socio : 4, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "ADMINISTRADOR CLUB", numero_telefono : "----------", id_persona : 2
                                                            },

                                                            { 
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "Lucas Torres", numero_telefono : "------------", id_persona : 3
                                                            }
                                                          ] 
                                              } );
  //---------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------
  const pass_admin = process.env.C0NTR4SEN1A_4DM1N;

  const usuarios = await prisma.usuario.createMany( { data : [
                                                                {  
                                                                  id_socio : 2, 
                                                                  id_acceso : 1, 
                                                                  tipo_usuario : 'ACCESO_ADMIN', 
                                                                  nombre_usuario : nombre_admin, 
                                                                  contrasea : pass_admin,
                                                                  estado_usuario : 1,
                                                                  usuariocreadoen : new Date()
                                                                }, 
                                                                
                                                                {
                                                                  id_socio : 1, 
                                                                  id_acceso : 2, 
                                                                  tipo_usuario : 'ACCESO_SOCIO_NORMAL', 
                                                                  nombre_usuario : "vgarcete", 
                                                                  contrasea : pass_admin,
                                                                  estado_usuario : 1,
                                                                  usuariocreadoen : new Date() 
                                                                },

                                                                {
                                                                  id_socio : 3, 
                                                                  id_acceso : 3, 
                                                                  tipo_usuario : 'ACCESO_PROFE', 
                                                                  nombre_usuario : "lucas_torres", 
                                                                  contrasea : pass_admin,
                                                                  estado_usuario : 1,
                                                                  usuariocreadoen : new Date() 
                                                                }
                                                              ] 
                                                  } );
  //---------------------------------------------------------------------------------

  const profesores_creados = new Date();
  const profesores_activos = await prisma.profesores.createMany( { data : [
                                                                            { 
                                                                              nombre_profesor : 'ECHAGUE', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 70000,
                                                                              estado_profesor : 'ACTIVO',
                                                                              cedula : '3768266'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'AXEL GAVILAN', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 80000,
                                                                              estado_profesor : 'ACTIVO',
                                                                              cedula : '3768266'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'JUANMA MIERES', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 80000,
                                                                              estado_profesor : 'ACTIVO',
                                                                              cedula : '2126262'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'TERESA', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 60000,
                                                                              estado_profesor : 'ACTIVO',
                                                                              cedula : '1823226'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'PRUEBA', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 170000,
                                                                              estado_profesor : 'SUSPENDIDO',
                                                                              cedula : '7467289'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'PRUEBA 2', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 10000,
                                                                              estado_profesor : 'BORRADO',
                                                                              cedula : '1111111'
                                                                            },
                                                                          ] 
                                                                } );

  //--------------------------------------------------------------------------------------------------------------
  
  const tipos_pagos = await prisma.tipo_pagos.createMany( { data : [
                                                                        { desc_tipo_pago : 'PAGO_ALQUILER' },
                                                                        { desc_tipo_pago : 'PAGO_PERSONAL' },
                                                                        { desc_tipo_pago : 'COBRO_DE_CUOTAS' },
                                                                        { desc_tipo_pago : 'PAGO_DE_SERVICIOS' },
                                                                        { desc_tipo_pago : 'PAGO_MANTENIMIENTO' },
                                                                        { desc_tipo_pago : 'INGRESOS_X_ACTIVIDAD' }
                                                                    ] 
                                                        } );
  //--------------------------------------------------------------------------------------------------------------


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