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
  const pass_admin = process.env.C0NTR4SEN1A_4DM1N; 

  const socios = await prisma.socio.createMany( { data : [  
                                                            { 
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "Victor Garcete", numero_telefono : "0985552004", id_persona : 1,
                                                              nombre_usuario : "v_garcete", contrasea : "12345678", estado_usuario : 1, 
                                                              creadoen : new Date(), id_acceso_socio : 1, tipo_usuario : "ACTIVO" 
                                                            },

                                                            { 
                                                              id_tipo_socio : 4, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "ADMINISTRADOR CLUB", numero_telefono : "----------", id_persona : 2,
                                                              nombre_usuario : "ADMINISTRADOR_CLUB", contrasea : pass_admin , estado_usuario : 1, 
                                                              creadoen : new Date(), id_acceso_socio : 1, tipo_usuario : "ACTIVO" 
                                                            },

                                                            { 
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "Lucas Torres", numero_telefono : "------------", id_persona : 2,
                                                              nombre_usuario : "lucas.torres", contrasea : "12345678", estado_usuario : 2, 
                                                              creadoen : new Date(), id_acceso_socio : 1, tipo_usuario : "SUSPENDIDO" 
                                                            }
                                                          ] 
                                              } );
  //---------------------------------------------------------------------------------

  
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
  
  const clubes_para_pases = await prisma.clubes_habilitados.createMany( { 
                                                                          data : [  
                                                                            { nombre_club_habilitado : 'SPIN', esta_habilitado : true, creadoen : new Date() },
                                                                            { nombre_club_habilitado : 'SALESIANO', esta_habilitado : true, creadoen : new Date() }
                                                                          ] 
                                                                      } );

  const modulos = await prisma.modulos.createMany( { 
                                                      data : [
                                                        { descripcion_modulo : 'ACCESOS' },
                                                        { descripcion_modulo : 'AGENDAR_CLASES' },
                                                        { descripcion_modulo : 'CALENDARIO_EVENTOS' },
                                                        { descripcion_modulo : 'GASTOS' },
                                                        { descripcion_modulo : 'INSCRIPCIONES' },
                                                        { descripcion_modulo : 'PAGO_CUOTAS' },
                                                        { descripcion_modulo : 'PASES_JUGADORES' },
                                                        { descripcion_modulo : 'PROFESORES' },
                                                        { descripcion_modulo : 'RESERVAS' },
                                                        { descripcion_modulo : 'ROLES' },
                                                        { descripcion_modulo : 'SOCIOS' }
                                                      ] 
                                                  } );

  const acciones = await prisma.acciones.createMany( { 
                                                        data : [
                                                          { id_modulo_accion : 1, descripcion_accion : 'CREAR' },
                                                          { id_modulo_accion : 1, descripcion_accion : 'LISTAR' },                                                          
                                                          { id_modulo_accion : 1, descripcion_accion : 'VER_ACCESOS_USR' },
                                                          
                                                          { id_modulo_accion : 2, descripcion_accion : 'OBTENER_CLASES' },
                                                          { id_modulo_accion : 2, descripcion_accion : 'AGENDAR_CLASES' },
                                                          { id_modulo_accion : 2, descripcion_accion : 'ELIMINAR_CLASES' },
                                                          { id_modulo_accion : 2, descripcion_accion : 'ABONAR_CLASE' },
                                                          { id_modulo_accion : 2, descripcion_accion : 'EDITAR_CLASE' },
                                                          
                                                          { id_modulo_accion : 3, descripcion_accion : 'OBTENER_EVENTOS' },
                                                          { id_modulo_accion : 3, descripcion_accion : 'ASIGNAR_EVENTOS' },
                                                          { id_modulo_accion : 3, descripcion_accion : 'BORRAR_EVENTOS' },
                                                          { id_modulo_accion : 3, descripcion_accion : 'EDITAR_EVENTOS' },

                                                          { id_modulo_accion : 4, descripcion_accion : 'OBTENER_GASTOS' },
                                                          { id_modulo_accion : 4, descripcion_accion : 'EDITAR_GASTOS' },
                                                          { id_modulo_accion : 4, descripcion_accion : 'CARGAR_GASTOS' },
                                                          { id_modulo_accion : 4, descripcion_accion : 'BORRAR_GASTOS' },
                                                          { id_modulo_accion : 4, descripcion_accion : 'OBTENER_COMPROBANTES' },

                                                          { id_modulo_accion : 5, descripcion_accion : 'VER_INSCRIPCIONES' },
                                                          { id_modulo_accion : 5, descripcion_accion : 'EDITAR_INSCRIPCIONES' },
                                                          { id_modulo_accion : 5, descripcion_accion : 'ABONAR_INSCRIPCION' },
                                                          { id_modulo_accion : 5, descripcion_accion : 'INSCRIBIRSE' },
                                                          { id_modulo_accion : 5, descripcion_accion : 'INSCRIBIR_NO_SOCIO' },

                                                          { id_modulo_accion : 6, descripcion_accion : 'VER_CUOTAS' },
                                                          { id_modulo_accion : 6, descripcion_accion : 'VER_COMPROBANTE' },
                                                          { id_modulo_accion : 6, descripcion_accion : 'HACER_PAGO' },

                                                          { id_modulo_accion : 7, descripcion_accion : 'VER_PASES_JUGADORES' },
                                                          { id_modulo_accion : 7, descripcion_accion : 'CREAR_PASES_JUGADORES' },
                                                          { id_modulo_accion : 7, descripcion_accion : 'EDITAR_PASES_JUGADORES' },
                                                          { id_modulo_accion : 7, descripcion_accion : 'BORRAR_PASES_JUGADORES' },

                                                          { id_modulo_accion : 8, descripcion_accion : 'CREAR_PROFESORES' },
                                                          { id_modulo_accion : 8, descripcion_accion : 'VER_PROFESORES' },
                                                          { id_modulo_accion : 8, descripcion_accion : 'EDITAR_PROFESORES' },
                                                          { id_modulo_accion : 8, descripcion_accion : 'BORRAR_PROFESORES' },

                                                          { id_modulo_accion : 9, descripcion_accion : 'CREAR_RESERVAS' },
                                                          { id_modulo_accion : 9, descripcion_accion : 'BORRAR_RESERVAS' },
                                                          { id_modulo_accion : 9, descripcion_accion : 'EDITAR_RESERVAS' },
                                                          { id_modulo_accion : 9, descripcion_accion : 'VER_RESERVAS' },

                                                          { id_modulo_accion : 10, descripcion_accion : 'CREAR_ROLES' },
                                                          { id_modulo_accion : 10, descripcion_accion : 'EDITAR_ROLES' },
                                                          { id_modulo_accion : 10, descripcion_accion : 'VER_ROLES' },
                                                          
                                                          { id_modulo_accion : 11, descripcion_accion : 'CREAR_SOCIO' },
                                                          { id_modulo_accion : 11, descripcion_accion : 'EDITAR_SOCIOS' },
                                                          { id_modulo_accion : 11, descripcion_accion : 'VER_SOCIO' },
                                                          { id_modulo_accion : 11, descripcion_accion : 'BORRAR_SOCIO' },
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