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

//-----------------------------------------------------------------------------------------------------------------
  const tipos_ruta_app = await prisma.tipos_ruta_app.createMany(
                                                                  {
                                                                    data : [
                                                                      { descripcion : 'SOCIOS' },
                                                                      { descripcion : 'PAGO_CUOTAS' },
                                                                      { descripcion : 'PASES_CLUBES_JUGADORES' },
                                                                      { descripcion : 'EVENTOS' },
                                                                      { descripcion : 'ACCESOS_SOCIO' },
                                                                      { descripcion : 'INSCRIPCIONES_EVENTOS' },
                                                                      { descripcion : 'LOGIN_CLUB' },
                                                                      { descripcion : 'PROFESORES' },    
                                                                      { descripcion : 'RESERVAS' },
                                                                      { descripcion : 'SEGURIDAD' },
                                                                      { descripcion : 'GASTOS_INGRESOS' },                                                                         
                                                                    ]
                                                                  }
                                                                );
//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
  const rutas_app = await prisma.rutas_app.createMany(
                                                            {
                                                              data : [
                                                                { path_ruta : '/socio', id_tipo_ruta_app : 1  },
                                                                { path_ruta : '/usuario', id_tipo_ruta_app : 1  },
                                                                { path_ruta : '/tipo_reserva', id_tipo_ruta_app : 9  },
                                                                { path_ruta : '/eventos', id_tipo_ruta_app : 4  },
                                                                { path_ruta : '/roles', id_tipo_ruta_app : 10  },
                                                                { path_ruta : '/tipo_socio', id_tipo_ruta_app : 1  },
                                                                { path_ruta : '/accesos', id_tipo_ruta_app : 10  },
                                                                { path_ruta : '/auth', id_tipo_ruta_app : 7  },
                                                                { path_ruta : '/reserva_en_club', id_tipo_ruta_app :  9 },
                                                                { path_ruta : '/pagos_socio', id_tipo_ruta_app : 2  },
                                                                { path_ruta : '/gastos_club', id_tipo_ruta_app : 11  },
                                                                { path_ruta : '/calendario_eventos', id_tipo_ruta_app :  4 },
                                                                { path_ruta : '/inscripciones', id_tipo_ruta_app :  6 },
                                                                { path_ruta : '/pases_jugadores', id_tipo_ruta_app : 3  },
                                                                { path_ruta : '/profesores', id_tipo_ruta_app : 8  },
                                                                { path_ruta : '/agendamiento_clases', id_tipo_ruta_app : 9 },
                                                              ]
                                                            }
                                                          );
//---------------------------------------------------------------------------------------------------------------------------------
 
  // PIRMER ROL CREADO
  //--------------------------------------------------------------------------------------------------------------
  const rol_usuario = await prisma.roles_usuario.createMany( { data : [
                                                                        { descripcion_rol : 'ADMINISTRADOR' },
                                                                        { descripcion_rol :  'SOCIO' },
                                                                        { descripcion_rol :  'SOCIO_PROFESOR' }
                                                                      ] 
                                                          } );
  //--------------------------------------------------------------------------------------------------------------

  //RUTAS ASIGNADAS A ROLES POR DEFECTO A ADMINISTRADOR
  //--------------------------------------------------------------------------------------------------------------
  const rutas_habilitadas = await prisma.rutas_habilitadas_rol.createMany(
                                                                            {
                                                                              data : [
                                                                                { id_rol_usuario : 1, id_ruta_app : 1 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 2 },                                                                                
                                                                                { id_rol_usuario : 1, id_ruta_app : 3 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 4 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 5 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 6 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 7 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 8 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 9 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 10 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 11 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 12 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 13 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 14 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 15 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 16 }
                                                                              ]
                                                                            }

                                                                          );

  //-------------------------------------------------------------------------------------------------------------------------------------


 //RUTAS ASIGNADAS A ROLES POR DEFECTO A SOCIOS
  //--------------------------------------------------------------------------------------------------------------
  const rutas_habilitadas_rol_socio = await prisma.rutas_habilitadas_rol.createMany(
                                                                                      {
                                                                                        data : [
                                                                                          { id_rol_usuario : 2, id_ruta_app : 3 },
                                                                                          { id_rol_usuario : 2, id_ruta_app : 4 },                                                                                
                                                                                          { id_rol_usuario : 2, id_ruta_app : 9 },
                                                                                          { id_rol_usuario : 2, id_ruta_app : 10 },
                                                                                          { id_rol_usuario : 2, id_ruta_app : 11 },
                                                                                          { id_rol_usuario : 2, id_ruta_app : 13 },
                                                                                          { id_rol_usuario : 2, id_ruta_app : 14 },
                                                                                          { id_rol_usuario : 2, id_ruta_app : 16 },
                                                                                        ]
                                                                                      }

                                                                                    );
  const tipos_ingresos = await prisma.tipos_ingreso.createMany( {
                                                              data : [
                                                                { descripcion : "CUOTAS"  },
                                                                { descripcion : "TORNEOS"  },
                                                                { descripcion : "CANTINA"  },
                                                                { descripcion : "DONACION"  },
                                                                { descripcion : "ACTIVIDADES"  },
                                                                { descripcion : "ALQUILER_CLUB_MESAS"  },
                                                              ]
                                                            });

  const tipos_egresos = await prisma.tipos_egreso.createMany( {
                                                              data : [
                                                                { descripcion : "LIMPIEZA"  },
                                                                { descripcion : "SERVICIO_DE_AGUA"  },
                                                                { descripcion : "SERVICIO_DE_LUZ"  },
                                                                { descripcion : "ALQUILER_LOCAL"  },
                                                                { descripcion : "MANTENIMIENTO_DEL_CLUB"  },
                                                                { descripcion : "SERVICIO_DE_INTERNET"  },
                                                              ]
                                                            });



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
                                                                            { desc_tipo_descuento : 'DESCUENTO_MENOR' },
                                                                            { desc_tipo_descuento : 'SOCIO_HONORARIO' },
                                                                            { desc_tipo_descuento : 'VITALICIO' }
                                                                          ] 
                                                                } ); 

  const tipo_de_cuota = await prisma.tipo_cuota.createMany( { data : [
                                                                        { desc_tipo_cuota : 'CUOTA_NORMAL', monto_cuota : 150000, creadoen : new Date()},
                                                                        { desc_tipo_cuota : 'CUOTA_SOCIO_MENOR', monto_cuota : 90000, creadoen : new Date() },
                                                                        { desc_tipo_cuota : 'CUOTA_SOCIO_FAMILIAR', monto_cuota : 130000, creadoen : new Date() },
                                                                        { desc_tipo_cuota : 'SOCIO_VITALICIO', monto_cuota : 0, creadoen : new Date() }
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


  const procedimiento_genera_cuotas = await prisma.$executeRaw`CREATE OR REPLACE PROCEDURE genera_cuotas_annio()
                                                                AS $$
                                                                DECLARE
                                                                    socio_fila RECORD;
                                                                  fecha_vencimiento_cuota DATE; -- SERIA EL 5 DE CADA MES
                                                                BEGIN
                                                                  -- SELECCIONO TODOS LOS SOCIOS ACTIVOS
                                                                  --DEBO RECORRER TODOS LOS DATOS DE MI CONSULTA E IR INSERTANDO EN LA TABLA DE CUOTAS
                                                                    FOR socio_fila IN (	SELECT DISTINCT (A.ID_SOCIO) AS SOCIO, C.ID_TIPO_DESCUENTO as TIPO_DESC, D.ID_TIPO_CUOTA AS TIPO_CUOTA
                                                                                FROM SOCIO A JOIN CUOTAS_SOCIO B ON A.id_socio = B.id_socio
                                                                                JOIN tipo_descuento C  ON C.id_tipo_descuento = B.id_tipo_descuento
                                                                                JOIN tipo_cuota D ON D.id_tipo_cuota = B.id_tipo_cuota
                                                                              WHERE ESTADO_SOCIO = 1) LOOP
                                                                    FOR i IN 1..12 LOOP
                                                                    
                                                                      fecha_vencimiento_cuota := DATE_TRUNC('MONTH', CURRENT_DATE + INTERVAL '1 month' * i) + INTERVAL '4 days';
                                                                      INSERT INTO public.cuotas_socio( id_socio, id_tipo_cuota, id_tipo_descuento, 
                                                                                        fecha_vencimiento, descripcion)
                                                                      VALUES (socio_fila.socio, socio_fila.tipo_cuota, socio_fila.tipo_desc, 
                                                                          fecha_vencimiento_cuota, CONCAT ( 'CUOTA : ', fecha_vencimiento_cuota ) );
                                                                    END LOOP;
                                                                
                                                                
                                                                    END LOOP;

                                                                END $$ LANGUAGE plpgsql;`

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
  
  //const tipos_pagos = await prisma.tipo_pagos.createMany( { data : [
  //                                                                      { desc_tipo_pago : 'PAGO_ALQUILER' },
  //                                                                      { desc_tipo_pago : 'PAGO_PERSONAL' },
  //                                                                      { desc_tipo_pago : 'COBRO_DE_CUOTAS' },
  //                                                                      { desc_tipo_pago : 'PAGO_DE_SERVICIOS' },
  //                                                                      { desc_tipo_pago : 'PAGO_MANTENIMIENTO' },
  //                                                                      { desc_tipo_pago : 'INGRESOS_X_ACTIVIDAD' }
  //                                                                  ] 
  //                                                      } );
  //--------------------------------------------------------------------------------------------------------------
  
  const clubes_para_pases = await prisma.clubes_habilitados.createMany( { 
                                                                          data : [  
                                                                            { nombre_club_habilitado : 'SPIN', esta_habilitado : true, creadoen : new Date() },
                                                                            { nombre_club_habilitado : 'SALESIANO', esta_habilitado : true, creadoen : new Date() },
                                                                            { nombre_club_habilitado : 'SAJONIA', esta_habilitado : true, creadoen : new Date() },
                                                                            { nombre_club_habilitado : 'ENCARNACION', esta_habilitado : true, creadoen : new Date() },
                                                                            { nombre_club_habilitado : 'VILLARRICA', esta_habilitado : true, creadoen : new Date() }
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