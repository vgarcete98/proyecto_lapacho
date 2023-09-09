const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
  const persona_admin = await prisma.$executeRaw`INSERT INTO public.persona( nombre, apellido, cedula, fecha_nacimiento)
                                                        VALUES ( ${nombre_admin}, ${apellido_admin}, ${cedula_admin}, ${fecha_admin_nac} )`;
  //---------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------
  const socio_admin = await prisma.$executeRaw`INSERT INTO public.socio( id_tipo_socio, id_persona, correo_electronico, nombre_cmp,
                                                                          numero_telefono, direccion, ruc, creadoen, estado_socio)
                                                      VALUES ( 4, 1, ${ correo_electronico }, ${ nombre_admin + ' COMPLETO' },
                                                              ${ numero_telefono }, ${ direccion }, ${ ruc }, ${ new Date() }, 1 )`;
  //---------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------
  const pass_admin = process.env.C0NTR4SEN1A_4DM1N;

  const usuario_admin = await prisma.$executeRaw`INSERT INTO public.usuario( id_socio, id_acceso, tipo_usuario, nombre_usuario, contrasea)
                                                        VALUES ( 1, 1, 1, ${ nombre_admin }, ${ pass_admin } )`;
  //---------------------------------------------------------------------------------

  const profesores_creados = new Date();
  const profesores_activos = await prisma.profesores.createMany( { data : [
                                                                            { 
                                                                              nombre_profesor : 'ECHAGUE', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 70000,
                                                                              estado_profesor : 'ACTIVO'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'AXEL GAVILAN', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 80000,
                                                                              estado_profesor : 'ACTIVO'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'JUANMA MIERES', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 80000,
                                                                              estado_profesor : 'ACTIVO'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'TERESA', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 60000,
                                                                              estado_profesor : 'ACTIVO'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'PRUEBA', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 170000,
                                                                              estado_profesor : 'SUSPENDIDO'
                                                                            },

                                                                            { 
                                                                              nombre_profesor : 'PRUEBA 2', 
                                                                              creadoen : profesores_creados, 
                                                                              contacto_profesor : 'XXXX-XXXXXX',
                                                                              costo_x_hora : 10000,
                                                                              estado_profesor : 'BORRADO'
                                                                            },
                                                                          ] 
                                                                } );




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