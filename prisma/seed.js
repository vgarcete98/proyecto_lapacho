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


// PRIMER ROL CREADO
//--------------------------------------------------------------------------------------------------------------
const rol_usuario = await prisma.roles_usuario.createMany( { data : [
                                                                      { descripcion_rol : 'ADMINISTRADOR' },
                                                                      { descripcion_rol :  'SOCIO' },
                                                                      { descripcion_rol :  'SOCIO_PROFESOR' }
                                                                    ] 
                                                        } );
//--------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
  const rutas_app = await prisma.rutas_app.createMany(
                                                            {
                                                              data : [
                                                                {path_ruta : '/socio',},
                                                                {path_ruta : '/socio/socios_detalle',},
                                                                {path_ruta : '/socio/socio_cedula/nombre',},
                                                                {path_ruta : '/socio/borrar_socio',},
                                                                {path_ruta : '/socio/editar_socio',},
                                                                {path_ruta : '/socio/crear_socio',},
                                                                {path_ruta : '/socio/obtener_socios',},
                                                                {path_ruta : '/socio/obtener_socio',},
                                                                {path_ruta : '/socio/obtener_tipo_socios',},
                                                          
                                                                {path_ruta : '/tipo_socio',},
                                                                
                                                                {path_ruta : '/eventos',},
                                                                
                                                                {path_ruta : '/inscripciones',},
                                                         
                                                                {path_ruta : '/reserva_en_club/obtener_mesas_disponibles',},
                                                                {path_ruta : '/reserva_en_club/obtener_reservas_club',},
                                                                {path_ruta : '/reserva_en_club/crear_reserva_club',},
                                                                {path_ruta : '/reserva_en_club/borrar_reserva_club',},
                                                                {path_ruta : '/reserva_en_club/editar_reserva_club',},
                                                                {path_ruta : '/reserva_en_club/obtener_mesas_disponibles_x_horario',},
                                                          
                                                                {path_ruta : '/pagos_socio',},
                                                                {path_ruta : '/pagos_socio/socio/pagar_cuota',},
                                                                {path_ruta : '/pagos_socio/socio/anular_pago/',},
                                                                {path_ruta : '/pagos_socio/socio/pagar_cuota_varias',},
                                                                {path_ruta : '/tipo_cuotas',},
                                                              
                                                                {path_ruta : '/calendario_eventos',},
                                                                {path_ruta : '/calendario_eventos/eventos_mes',},
                                                                {path_ruta : '/calendario_eventos/eventos_annio',},
                                                                {path_ruta : '/calendario_eventos/inscripciones_evento',},
                                                                {path_ruta : '/calendario_eventos/crear_nuevo_evento',},
                                                                {path_ruta : '/calendario_eventos/actualizar_evento',},
                                                                {path_ruta : '/calendario_eventos/eliminar_evento',},
                                                                {path_ruta : '/calendario_eventos/obtener_tipos_evento',},
                                                                {path_ruta : '/calendario_eventos/eventos_mes_todos',},
                                                                
                                                                {path_ruta : '/pases_jugadores',},
                                                               
                                                                {path_ruta : '/profesores',},
                                                              
                                                                {path_ruta : '/agendamiento_clases',},
                                                                {path_ruta : '/agendamiento_clases/agendar_clase',},
                                                                {path_ruta : '/agendamiento_clases/editar_clase',},
                                                                {path_ruta : '/agendamiento_clases/cancelar_clase',},
                                                                {path_ruta : '/agendamiento_clases/pagar_x_clase',},
                                                                {path_ruta : '/agendamiento_clases/obtener_clases_x_fecha',},
                                                                {path_ruta : '/agendamiento_clases/obtener_clases_x_fecha_socio',},
                                                                {path_ruta : '/agendamiento_clases/obtener_clases_x_fecha_profesor',},
                                                                {path_ruta : '/agendamiento_clases/obtener_mesas_disponibles_x_horario',},
                                                         
                                                                {path_ruta : '/ingresos',},
                                                                {path_ruta : '/ingresos/obtener_grafico_ingresos',},
                                                                {path_ruta : '/ingresos/obtener_grafico_ingresos_torta',},
                                                                {path_ruta : '/ingresos/reportes_ingresos_excel',},
                                                                {path_ruta : '/ingresos/tipos_ingreso',},
                                                                {path_ruta : '/ingresos/agregar_ingreso',},
                                                                {path_ruta : '/ingresos/borrar_ingreso',},
                                                                {path_ruta : '/ingresos/actualizar_ingreso',},

                                                                {path_ruta : '/egresos',},
                                                                {path_ruta : '/egresos/obtener_datos_grafico',},
                                                                {path_ruta : '/egresos/obtener_datos_grafico_torta',    },
                                                                {path_ruta : '/egresos/reportes_egresos_excel',},
                                                                {path_ruta : '/egresos/tipos_egreso',},
                                                                {path_ruta : '/egresos/agregar_gasto',},
                                                                {path_ruta : '/egresos/eliminar_egreso',},
                                                                {path_ruta : '/egresos/actualizar_egreso',},

                                                                {path_ruta : '/cuotas_club',},
                                                                {path_ruta : '/cuotas_club/cuota_socio',},
                                                                {path_ruta : '/cuotas_club/cuotas_reporte',},
                                                                {path_ruta : '/cuotas_club/cuotas_pendientes_mes', },
                                                              ]
                                                            }
                                                          );
//---------------------------------------------------------------------------------------------------------------------------------
 

  //RUTAS ASIGNADAS A ROLES POR DEFECTO A ADMINISTRADOR
  //--------------------------------------------------------------------------------------------------------------
  const rutas_habilitadas = await prisma.accesos_usuario.createMany(
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
                                                                                { id_rol_usuario : 1, id_ruta_app : 16 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 17 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 18 },                                                                                
                                                                                { id_rol_usuario : 1, id_ruta_app : 19 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 20 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 21 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 22 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 23 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 24 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 25 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 26 },                                                                                
                                                                                { id_rol_usuario : 1, id_ruta_app : 27 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 28 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 29 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 30 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 31 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 32 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 33 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 34 },                                                                                
                                                                                { id_rol_usuario : 1, id_ruta_app : 35 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 36 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 37 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 38 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 39 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 40 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 41 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 42 },                                                                                
                                                                                { id_rol_usuario : 1, id_ruta_app : 43 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 44 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 45 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 46 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 47 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 48 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 49 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 50 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 51 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 52 },                                                                                
                                                                                { id_rol_usuario : 1, id_ruta_app : 53 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 54 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 55 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 56 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 57 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 58 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 59 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 60 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 61 },
                                                                                { id_rol_usuario : 1, id_ruta_app : 62 },                                                                                
                                                                                { id_rol_usuario : 1, id_ruta_app : 63 },

                                                                              ]
                                                                            }

                                                                          );

  //-------------------------------------------------------------------------------------------------------------------------------------


 //RUTAS ASIGNADAS A ROLES POR DEFECTO A SOCIOS
  //--------------------------------------------------------------------------------------------------------------
  //const rutas_habilitadas_rol_socio = await prisma.rutas_habilitadas_rol.createMany(
  //                                                                                    {
  //                                                                                      data : [
  //                                                                                        { id_rol_usuario : 2, id_ruta_app : 3 },
  //                                                                                        { id_rol_usuario : 2, id_ruta_app : 4 },                                                                                
  //                                                                                        { id_rol_usuario : 2, id_ruta_app : 9 },
  //                                                                                        { id_rol_usuario : 2, id_ruta_app : 10 },
  //                                                                                        { id_rol_usuario : 2, id_ruta_app : 11 },
  //                                                                                        { id_rol_usuario : 2, id_ruta_app : 13 },
  //                                                                                        { id_rol_usuario : 2, id_ruta_app : 14 },
  //                                                                                        { id_rol_usuario : 2, id_ruta_app : 16 },
  //                                                                                      ]
  //                                                                                    }
//
  //                                                                                  );
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
                                                                { descripcion : "SERVICIO_DE_AGUA", gasto_fijo : true },
                                                                { descripcion : "SERVICIO_DE_LUZ", gasto_fijo : true  },
                                                                { descripcion : "ALQUILER_LOCAL", gasto_fijo : true  },
                                                                { descripcion : "MANTENIMIENTO_DEL_CLUB"  },
                                                                { descripcion : "SERVICIO_DE_INTERNET", gasto_fijo : true  },
                                                              ]
                                                            });


  // TIPO DE SOCIO QUE MANEJA EL USUARIO
  //---------------------------------------------------------------------------------
  const nuevos_tipos_de_socio = await prisma.tipo_socio.createMany( { data : [
                                                                              { desc_tipo_socio : tipos_de_socio.socio_normal, tipo_socio_creado_en : new Date() },
                                                                              { desc_tipo_socio : tipos_de_socio.socio_familiar, tipo_socio_creado_en : new Date() },
                                                                              { desc_tipo_socio : tipos_de_socio.socio_menor_edad, tipo_socio_creado_en : new Date() },
                                                                              { desc_tipo_socio : tipos_de_socio.socio_admin, tipo_socio_creado_en : new Date() }
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
                                                                            { desc_tipo_evento : eventos_club.aniversario_club, color_evento : "#FF0000" },
                                                                            { desc_tipo_evento : eventos_club.cena_fin_anio, color_evento : "#FFA500" },
                                                                            { desc_tipo_evento : eventos_club.liga_interna, color_evento : "#87CEEB" },
                                                                            { desc_tipo_evento : eventos_club.san_juan, color_evento : "#008f39" },
                                                                            { desc_tipo_evento : eventos_club.torneo_interno, color_evento : "#FFC94D" },
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
                                                              tipo_cuota BIGINT;
                                                              monto_cuota_socio INTEGER;
                                                          BEGIN
                                                              -- Define el rango de fechas y el producto para el que deseas calcular el total de cuotas
                                                              fecha_inicio := NOW();
                                                              fecha_loop := DATE_TRUNC('month', fecha_inicio);
                                                              fecha_vencimiento_cuota := fecha_loop + INTERVAL '4 days';  -- Ajustamos para que sea el 5 de cada mes
                                                                                                                          
                                                              IF NEW.ID_TIPO_SOCIO = 1 THEN
                                                                  tipo_cuota := 1;				
                                                              ELSIF NEW.ID_TIPO_SOCIO = 2 THEN -- ES UN SOCIO MENOR DE EDAD
                                                                  tipo_cuota := 2;
                                                              ELSE -- SERIA UN SOCIO FAMILIAR
                                                                  tipo_cuota := 3;			
                                                              END IF;
                                                                                                                          
                                                              SELECT MONTO_CUOTA INTO monto_cuota_socio FROM TIPO_CUOTA A WHERE A.ID_TIPO_CUOTA = tipo_cuota LIMIT 1;
                                                            IF (NEW.es_socio = True ) THEN
                                                            
                                                                LOOP
                                                                    -- Inserta la cuota del socio
                                                                    INSERT INTO CUOTAS_SOCIO (
                                                                        id_cliente, id_tipo_cuota, id_tipo_descuento, 
                                                                        fecha_vencimiento, descripcion, pago_realizado, monto_cuota
                                                                    )
                                                                    VALUES (
                                                                        NEW.id_cliente, tipo_cuota, 1,
                                                                        fecha_vencimiento_cuota, CONCAT('CUOTA : ', fecha_vencimiento_cuota), false, monto_cuota_socio
                                                                    );
                                                                
                                                                    -- Incrementa el bucle en un mes
                                                                    fecha_loop := fecha_loop + INTERVAL '1 month';
                                                                    fecha_vencimiento_cuota := fecha_loop + INTERVAL '4 days'; -- Ajustamos para que sea el 5 de cada mes
                                                                
                                                                    -- Comprueba la condición de salida
                                                                    IF (EXTRACT(MONTH FROM fecha_loop) = 12) THEN
                                                                        EXIT; -- Sale del bucle después de diciembre del mismo año
                                                                    END IF;
                                                                END LOOP;                                                            
                                                            
                                                            END IF;                                                        

                                                                
                                                              RETURN NEW;
                                                          END;
                                                          $$ LANGUAGE plpgsql;`;


  const procedimiento_genera_cuotas = await prisma.$executeRaw`CREATE OR REPLACE PROCEDURE genera_cuotas_annio()
                                                                AS $$
                                                                DECLARE
                                                                    socio_fila RECORD;
                                                                  fecha_vencimiento_cuota DATE; -- SERIA EL 5 DE CADA MES
                                                                BEGIN
                                                                  -- SELECCIONO TODOS LOS SOCIOS ACTIVOS
                                                                  --DEBO RECORRER TODOS LOS DATOS DE MI CONSULTA E IR INSERTANDO EN LA TABLA DE CUOTAS
                                                                    FOR socio_fila IN (	SELECT DISTINCT (A.ID_CLIENTE) AS SOCIO, C.ID_TIPO_DESCUENTO as TIPO_DESC, D.ID_TIPO_CUOTA AS TIPO_CUOTA
                                                                                FROM CLIENTE A JOIN CUOTAS_SOCIO B ON A.ID_CLIENTE = B.ID_CLIENTE
                                                                                JOIN tipo_descuento C  ON C.id_tipo_descuento = B.id_tipo_descuento
                                                                                JOIN tipo_cuota D ON D.id_tipo_cuota = B.id_tipo_cuota
                                                                              WHERE ESTADO_SOCIO = 1) LOOP
                                                                    FOR i IN 1..12 LOOP
                                                                    
                                                                      fecha_vencimiento_cuota := DATE_TRUNC('MONTH', CURRENT_DATE + INTERVAL '1 month' * i) + INTERVAL '4 days';
                                                                      INSERT INTO public.cuotas_socio( ID_CLIENTE, id_tipo_cuota, id_tipo_descuento, 
                                                                                        fecha_vencimiento, descripcion)
                                                                      VALUES (socio_fila.socio, socio_fila.tipo_cuota, socio_fila.tipo_desc, 
                                                                          fecha_vencimiento_cuota, CONCAT ( 'CUOTA : ', fecha_vencimiento_cuota ) );
                                                                    END LOOP;
                                                                
                                                                
                                                                    END LOOP;

                                                                END $$ LANGUAGE plpgsql;`

  const trigger_cuotas = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_generar_cuotas_socio
                                                  AFTER INSERT ON CLIENTE
                                                  FOR EACH ROW
                                                  EXECUTE FUNCTION generar_cuotas_socio();`


const actualiza_monto_cuotas = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION cambia_monto_cuotas()
                                                          RETURNS TRIGGER AS $$
                                                          DECLARE
                                                          BEGIN
                                                          	UPDATE CUOTAS_SOCIO
                                                          		SET MONTO_CUOTA = NEW.monto_cuota
                                                          	WHERE FECHA_PAGO_REALIZADO IS NOT NULL 
                                                          			AND ID_SOCIO NOT IN ( SELECT ID_SOCIO FROM SOCIO 
                                                          									WHERE tipo_usuario = 'SUSPENDIDO' OR tipo_usuario = 'ELIMINADO' OR id_tipo_socio = 5 )
                                                          			AND ID_TIPO_CUOTA = OLD.ID_TIPO_CUOTA;
                                                                
                                                                
                                                            RETURN NEW;
                                                                
                                                          END;
                                                        $$ LANGUAGE plpgsql;`;


  const trigger_actualiza_monto_cuotas = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_cambia_monto_cuotas
                                                                  AFTER UPDATE ON TIPO_CUOTA
                                                                  FOR EACH ROW
                                                                  EXECUTE FUNCTION cambia_monto_cuotas();`  


  //---------------------------------------------------------------------------------
  const pass_admin = process.env.C0NTR4SEN1A_4DM1N; 

  const socios = await prisma.cliente.createMany( { data : [  
                                                            { 
                                                              nombre : "Victor", apellido : "Garcete", 
                                                              cedula : '4365710', fecha_nacimiento : generar_fecha( '29/05/2023' ) ,
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "Victor Garcete", numero_telefono : "0985552004",
                                                              nombre_usuario : "v_garcete", password : "12345678", estado_usuario : 1, 
                                                              creadoen : new Date(), tipo_usuario : "ACTIVO", id_rol_usuario : 2
                                                            },

                                                            { 
                                                              nombre : "ADMINISTRADOR_CLUB", apellido : "----------------", 
                                                              cedula : '12345678', fecha_nacimiento : new Date(),
                                                              id_tipo_socio : 4, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "ADMINISTRADOR CLUB", numero_telefono : "----------",
                                                              nombre_usuario : "ADMINISTRADOR_CLUB", password : pass_admin , estado_usuario : 1, 
                                                              creadoen : new Date(), tipo_usuario : "ACTIVO", id_rol_usuario : 1
                                                            },

                                                            {
                                                              nombre : "Lucas", apellido : "Torres", 
                                                              cedula : '1111111', fecha_nacimiento : generar_fecha( '13/05/2000' ),  
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "Lucas Torres", numero_telefono : "------------",
                                                              nombre_usuario : "lucas.torres", password : "12345678", estado_usuario : 2, 
                                                              creadoen : new Date(), tipo_usuario : "SUSPENDIDO" , id_rol_usuario : 1 
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
  const mesas_disponibles = await prisma.mesas.createMany( { 
                                                              data : [
                                                                { desc_mesa : 'MESA 1' },
                                                                { desc_mesa : 'MESA 2' },
                                                                { desc_mesa : 'MESA 3' },
                                                                { desc_mesa : 'MESA 4' },
                                                                { desc_mesa : 'MESA 5' },
                                                                { desc_mesa : 'MESA 6' }
                                                              ] 

                                                          } );


  const tipos_reserva = await prisma.tipo_reserva.createMany( {
                                                                data : [
                                                                  { desc_tipo_reserva : "RESERVA DE MESA" }
                                                                ]
                                                            } );

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


  const func_verifica_id_acceso_roles = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION verifica_acceso_rol(RUTA_APP INTEGER, rol VARCHAR)
                                                                RETURNS INTEGER AS $$
                                                                DECLARE
                                                                    ID_ACCESO INTEGER;
                                                                BEGIN
                                                                  SELECT B.ID_ACCESO INTO ID_ACCESO 
                                                                    FROM roles_usuario A JOIN accesos_usuario B on A.id_rol_usuario = B.id_rol_usuario
                                                                  WHERE A.descripcion_rol = rol AND B.id_ruta_app = RUTA_APP;
                                                                                                                                  
                                                                  RETURN ID_ACCESO;
                                                                END;
                                                                $$ LANGUAGE plpgsql;` ;

  const func_verifica_eventos_u_reservas = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION verifica_eventos_u_reservas()
                                                                    RETURNS TRIGGER AS $$
                                                                    BEGIN
                                                                      
														  	                                      IF ( EXISTS  (SELECT ID_EVENTO_CALENDARIO 
																                                      		          	FROM CALENDARIO_EVENTOS 
																                                      		          WHERE NEW.FECHA_AGENDAMIENTO BETWEEN FECHA_DESDE_EVENTO AND FECHA_HASTA_EVENTO)) THEN 
                                                                        
																                                      	RAISE EXCEPTION 'No se puede agendar esa clase, hay un evento que lo impide';
																                                      	RETURN NULL; -- Impide la operación
                                                                        
																                                     ELSIF ( EXISTS (SELECT ID_SOCIO_RESERVA 
																                                      				FROM RESERVAS 
																                                      			WHERE  (NEW.FECHA_AGENDAMIENTO = FECHA_RESERVA) 
																                                      		   			AND (NEW.HORARIO_INICIO, NEW.HORARIO_HASTA) OVERLAPS (HORA_DESDE, HORA_HASTA) 
																                                      		  			AND (ID_MESA = NEW.ID_MESA) )) THEN 
																                                      	RAISE EXCEPTION 'No se puede agendar esa clase, hay una reserva que lo impide';
    														                                      		RETURN NULL; -- Impide la operación
																                                      ELSIF ( EXISTS (SELECT ID_AGENDAMIENTO 
																                                              				  FROM AGENDAMIENTO_CLASE 
																                                              			  WHERE  (NEW.FECHA_AGENDAMIENTO = FECHA_AGENDAMIENTO) 
																                                              		   			AND (NEW.HORARIO_INICIO, NEW.HORARIO_HASTA) OVERLAPS (HORARIO_INICIO, HORARIO_HASTA) 
																                                              		  			AND (ID_MESA = NEW.ID_MESA) )) THEN 
                                                                            IF ( NEW.MONTO_ABONADO IS NOT NULL ) THEN 
                                                                              RETURN NEW;
                                                                            ELSE
																                                              RAISE EXCEPTION 'No se puede agendar esa Clase, hay otra clase que lo impide';
    														                                          		RETURN NULL; -- Impide la operación		
                                                                            END IF ;																								
																                                      ELSE 
																                                      	RETURN NEW;
																                                      END IF;
                                                                          
                                                                    END;
                                                                    $$ LANGUAGE plpgsql;`

  const trigger_func_verifica_eventos_u_reservas = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_verifica_eventos_u_reservas
                                                                                BEFORE INSERT OR UPDATE ON AGENDAMIENTO_CLASE
                                                                                FOR EACH ROW
                                                                                EXECUTE FUNCTION verifica_eventos_u_reservas()`;




  const func_verifica_eventos_o_clases = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION verifica_eventos_o_clases()
                                                                            RETURNS TRIGGER AS $$
                                                                            BEGIN


														  	                                              IF ( EXISTS  (SELECT ID_EVENTO_CALENDARIO 
																                                              			FROM CALENDARIO_EVENTOS 
																                                              		WHERE NEW.FECHA_RESERVA BETWEEN FECHA_DESDE_EVENTO AND FECHA_HASTA_EVENTO)) THEN 
                                                                                
																                                              	RAISE EXCEPTION 'No se puede agendar esa reserva, hay un evento que lo impide';
																                                              	RETURN NULL; -- Impide la operación
                                                                                
																                                              ELSIF ( EXISTS (SELECT ID_AGENDAMIENTO 
																                                              				FROM AGENDAMIENTO_CLASE 
																                                              			WHERE  (NEW.FECHA_RESERVA = FECHA_AGENDAMIENTO) 
																                                              		   			AND (NEW.HORA_DESDE, NEW.HORA_HASTA) OVERLAPS (HORARIO_INICIO, HORARIO_HASTA) 
																                                              		  			AND (ID_MESA = NEW.ID_MESA) )) THEN 
																                                              	RAISE EXCEPTION 'No se puede agendar esa Reserva, hay una clase que lo impide';
    														                                              		RETURN NULL; -- Impide la operación
																											                        ELSIF ( EXISTS (SELECT ID_SOCIO_RESERVA 
																                                              					FROM RESERVAS A
																                                              			WHERE  (NEW.FECHA_RESERVA = A.FECHA_RESERVA) 
																                                              		   			AND (NEW.HORA_DESDE, NEW.HORA_HASTA) OVERLAPS (A.HORA_DESDE, A.HORA_HASTA) 
																                                              		  			AND (A.ID_MESA = NEW.ID_MESA) )) THEN 
																                                              	RAISE EXCEPTION 'No se puede agendar esa Reserva, hay una reserva en ese mismo horario';
    														                                              		RETURN NULL; -- Impide la operación
																												
																												
																                                              ELSE 
																                                              	RETURN NEW;
																                                              END IF;

                                                                            END;
                                                                          $$ LANGUAGE plpgsql;`;

  const trigger_func_verifica_eventos_o_clases = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_verifica_eventos_o_clases
                                                                            BEFORE INSERT OR UPDATE ON RESERVAS
                                                                            FOR EACH ROW
                                                                            EXECUTE FUNCTION verifica_eventos_o_clases();`;


  const func_verifica_reservas_o_clases = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION verifica_reservas_o_clases()
                                                                          RETURNS TRIGGER AS $$
                                                                          BEGIN                                                

                                                                            IF ( EXISTS  (SELECT ID_EVENTO_CALENDARIO 
                                                                              FROM CALENDARIO_EVENTOS 
                                                                            WHERE (NEW.FECHA_DESDE_EVENTO, NEW.FECHA_HASTA_EVENTO) OVERLAPS (FECHA_DESDE_EVENTO, FECHA_HASTA_EVENTO))) THEN 
                                                                            
                                                                              RAISE EXCEPTION 'No se puede agendar ese evento, hay otro evento que lo impide';
                                                                              RETURN NULL; -- Impide la operación
                                                                            ELSE 
                                                                              DELETE FROM reservas B
                                                                                WHERE B.fecha_reserva BETWEEN NEW.FECHA_DESDE_EVENTO AND NEW.FECHA_HASTA_EVENTO;

                                                                                DELETE FROM agendamiento_clase A
                                                                                WHERE A.fecha_agendamiento BETWEEN NEW.FECHA_DESDE_EVENTO AND NEW.FECHA_HASTA_EVENTO;
                                                                              RETURN NEW;
                                                                            END IF ;
                                                                          END;
                                                                        $$ LANGUAGE plpgsql;`;
                                                                        
  const trigger_func_verifica_reservas_o_clases = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_verifica_reservas_o_clases
                                                                              BEFORE INSERT OR UPDATE ON CALENDARIO_EVENTOS
                                                                              FOR EACH ROW
                                                                              EXECUTE FUNCTION verifica_reservas_o_clases();`; 
                                                                              
                                                                              
  const func_inserta_pagos_cuotas_socio = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION inserta_pagos_cuotas_socio()
                                                                                              RETURNS TRIGGER AS $$
                                                                                              BEGIN                                                
																				                                                        insert into pagos_socio 
																				                                                        						( ID_CUOTA_SOCIO, 
																				                                                        							NRO_FACTURA, 
																				                                                        							MONTO_ABONADO, 
																				                                                        							FECHA_PAGO, 
																				                                                        							COMPROBANTE_PAGO )
																				                                                        						--values
																				                                                        						select new.ID_CUOTA_SOCIO, 
																				                                                        								'', 
																				                                                        								0, 
																				                                                        								NULL, 
																				                                                        								'' 
																				                                                        							from cuotas_socio;
                                                                                                RETURN NEW;
                                                                                              END;
                                                                                            $$ LANGUAGE plpgsql;	`

  const trigger_func_inserta_pagos_cuotas_socio = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_inserta_pagos_cuotas_socio
                                                                              AFTER INSERT ON CUOTAS_SOCIO
                                                                              FOR EACH ROW
                                                                              EXECUTE FUNCTION inserta_pagos_cuotas_socio();`; 


  const func_trigger_inserta_ingreso_pago_cuota = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION inserta_ingreso_pago_cuota()
                                                                          RETURNS TRIGGER AS $$
                                                                          BEGIN  
																		  
                                                                            
                                                                            IF (NEW.PAGO_REALIZADO = false OR NEW.FECHA_PAGO_REALIZADO IS NULL) THEN 
                                                                            
                                                                              UPDATE INGRESOS 
                                                                                SET BORRADO = true
                                                                              WHERE Column_d_operacion_ingreso = ( SELECT A.Column_d_operacion_ingreso FROM TRANSACCIONES_INGRESOS A 
                                                                                                WHERE NEW.ID_CUOTA_SOCIO = A.ID_CUOTA_SOCIO );
                                                                            ELSE 
                                                                              INSERT INTO ingresos (id_socio, 
                                                                                                                            id_tipo, 
                                                                                                                            nro_factura, 
                                                                                                                            cargado_en, 
                                                                                                                            descripcion, 
                                                                                                                            monto, 
                                                                                                                            borrado, 
                                                                                                                            fecha_ingreso)
                                                                                  VALUES(new.ID_SOCIO, 
                                                                                    ( select TI.id_tipo  from tipos_ingreso ti where ti.id_tipo = 1 ), 
                                                                                    ( select ps.nro_factura  from pagos_socio ps where id_cuota_socio = new.ID_CUOTA_SOCIO ), 
                                                                                    new.FECHA_PAGO_REALIZADO,  
                                                                                    new.DESCRIPCION, 
                                                                                    ( select ps.monto_abonado  from pagos_socio ps where id_cuota_socio = new.ID_CUOTA_SOCIO ), 
                                                                                    false, 
                                                                                    current_date);
                                                                                                          
                                                                              INSERT INTO TRANSACCIONES_INGRESOS ( 
                                                                                                  Column_d_operacion_ingreso,
                                                                                                  id_cuota_socio,
                                                                                                  descripcion
                                                                                                )

                                                                                            VALUES (
                                                                                                  (SELECT MAX( Column_d_operacion_ingreso ) FROM INGRESOS),
                                                                                                  new.id_cuota,
                                                                                                  new.descripcion
                                                                                                );
                                                                            END IF ;
                                                                          RETURN NEW;
                                                                        END;
                                                                        $$ LANGUAGE plpgsql;`

  const trigger_func_trigger_inserta_ingreso_pago_cuota = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_inserta_ingreso_pago_cuota
                                                                                      AFTER UPDATE ON CUOTAS_SOCIO
                                                                                      FOR EACH ROW
                                                                                      EXECUTE FUNCTION inserta_ingreso_pago_cuota();`; 

  const procedimiento_crea_egresos_fijos = await prisma.$executeRaw`CREATE OR REPLACE PROCEDURE genera_gastos_fijos()
                                                                      AS $$
																                                      DECLARE 
																                                      	MES VARCHAR( 50 );
																                                      	tipo_egreso RECORD;
                                                                      BEGIN

																                                      	MES := CASE 
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 1 THEN 'ENERO'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 2 THEN 'FEBRERO'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 3 THEN 'MARZO'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 4 THEN 'ABRIL'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 5 THEN 'MAYO'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 6 THEN 'JUNIO'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 7 THEN 'JULIO'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 8 THEN 'AGOSTO'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 9 THEN 'SETIEMBRE'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 10 THEN 'OCTUBRE'
																                                      						WHEN EXTRACT( MONTH FROM CURRENT_DATE ) = 11 THEN  'NOVIEMBRE'
																                                      						ELSE 
																                                      							'DICIEMBRE'
																                                      						END ;

																                                      	FOR tipo_egreso IN (select id_tipo, descripcion,
																                                      					   			CASE 
																                                      					   				WHEN descripcion = 'SERVICIO_DE_AGUA' THEN 'PAGO DEL SERVICIO DE AGUA'
																                                      					   				WHEN descripcion = 'SERVICIO_DE_LUZ' THEN 'PAGO DEL SERVICIO DE LUZ'
																                                      					   				WHEN descripcion = 'ALQUILER_LOCAL' THEN 'PAGO DEL ALQUILER'
																                                      					   			ELSE 
																                                      					   				'PAGO DEL SERVICIO DE INTERNET'
																                                      					   			END AS descripcion_egreso
																                                      					   		from tipos_egreso where gasto_fijo = true) LOOP
                                                                                                          	INSERT INTO egresos
																                                      				(id_socio, 
																                                      				 id_tipo, 
																                                      				 nro_factura, 
																                                      				 cargado_en, 
																                                      				 descripcion, 
																                                      				 monto, 
																                                      				 borrado, 
																                                      				 comprobante,
																                                      				 fecha_pago, 
																                                      				 fecha_egreso)
																                                      			VALUES(1,  
																                                      				   tipo_egreso.id_tipo, 
																                                      				   '', 
																                                      				   CURRENT_DATE, 
																                                      				   CONCAT ( tipo_egreso.descripcion_egreso, ' ', MES ) , 
																                                      				   0, 
																                                      				   false,
																                                      				   '',
																                                      				   CURRENT_DATE, 
																                                      				   CURRENT_DATE);
																                                      	END LOOP;
                                                                      END $$ LANGUAGE plpgsql;`;                                                                                  

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