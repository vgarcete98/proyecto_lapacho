const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { generar_fecha } = require( '../helpers/generar_fecha' );
const { encriptar_password } = require('../helpers/generar_encriptado');


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
                                                                      { descripcion_rol : 'ADMINISTRADOR', estado_rol_usuario : 'ACTIVO', id_usuario_crea_rol : 1, rol__creado_en : new Date() },
                                                                      { descripcion_rol : 'SOCIO', estado_rol_usuario : 'ACTIVO', id_usuario_crea_rol : 1, rol__creado_en : new Date() },
                                                                      { descripcion_rol : 'SOCIO_PROFESOR', estado_rol_usuario : 'ACTIVO', id_usuario_crea_rol : 1, rol__creado_en : new Date() },
                                                                      { descripcion_rol : 'PROFESOR', estado_rol_usuario : 'ACTIVO', id_usuario_crea_rol : 1, rol__creado_en : new Date() }
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

  const tipos_de_pago = await prisma.tipo_pago.createMany ( { data :  [
                                                                        { dec_tipo_pago : 'EFECTIVO' },
                                                                        { dec_tipo_pago : 'TRANSFERENCIA' }
                                                                      ]
                                                                      } );



  const precio_reservas_defecto = await prisma.precio_reservas.createMany ( { data :  [
                                                                                        { monto_reserva : 30000, creado_en : new Date(), desc_tipo_descuento : "SIN DESCUENTO", porc_descuento : 0, valido : true }
                                                                                    ]
                                                                            } );
                                                                         

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
                                                                { descripcion : "CUOTAS", creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "CLASES PARTICULARES", creado_en : new Date(), creado_por : 1 },
                                                                { descripcion : "TORNEOS", creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "CANTINA", creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "DONACION", creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "ACTIVIDADES", creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "ALQUILER CLUB MESAS", creado_en : new Date(), creado_por : 1  },
                                                                { descripcion: "INGRESO_X_CLASES_PROFESORES", creado_en : new Date(), creado_por : 1 }
                                                              ]
                                                            });

  const tipos_egresos = await prisma.tipos_egreso.createMany( {
                                                              data : [
                                                                { descripcion : "LIMPIEZA", creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "SERVICIO DE AGUA", gasto_fijo : true, creado_en : new Date(), creado_por : 1 },
                                                                { descripcion : "SERVICIO DE LUZ", gasto_fijo : true, creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "ALQUILER LOCAL", gasto_fijo : true, creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "MANTENIMIENTO DEL CLUB", creado_en : new Date(), creado_por : 1  },
                                                                { descripcion : "SERVICIO DE INTERNET", gasto_fijo : true, creado_en : new Date(), creado_por : 1  },
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
  const precios_de_cuotas = await prisma.precio_cuota.createMany( { data : [
                                                                      { monto_cuota : 150000, id_tipo_socio : 1, desc_precio_cuota : "PRECIO DE CUOTA SOCIO NORMAL", porc_descuento : 0 },
                                                                      { monto_cuota : 90000, id_tipo_socio : 2, desc_precio_cuota : "PRECIO DE CUOTA SOCIO FAMILIAR", porc_descuento : 0 },
                                                                      { monto_cuota : 80000, id_tipo_socio : 3, desc_precio_cuota : "PRECIO DE CUOTA SOCIO MENOR", porc_descuento : 0 },
                                                                      { monto_cuota : 0, id_tipo_socio : 4, desc_precio_cuota : "PRECIO DE CUOTA SOCIO ADMINISTRADOR", porc_descuento : 0 }
                                                                    ] 
                                                                  } );

  const vecimiento = await prisma.vencimiento_cuotas.create( { data : { valido : true, dia_vencimiento : 5, creado_en : new Date() } } );
  //---------------------------------------------------------------------------------

  // TIPOS DE EVENTOS QUE SE PUEDEN MANEJAR EN EL CLUB
  //---------------------------------------------------------------------------------
  const nuevos_tipos_evento = await prisma.tipos_evento.createMany( { data : [
                                                                            { desc_tipo_evento : eventos_club.aniversario_club, color_evento : "#FF0000" },
                                                                            { desc_tipo_evento : eventos_club.cena_fin_anio, color_evento : "#FFA500" },
                                                                            { desc_tipo_evento : eventos_club.liga_interna, color_evento : "#87CEEB" },
                                                                            { desc_tipo_evento : eventos_club.san_juan, color_evento : "#008f39" },
                                                                            { desc_tipo_evento : eventos_club.torneo_interno, color_evento : "#FFC94D" },
                                                                          ] 
                                                                  } );  
  
  //---------------------------------------------------------------------------------

  const f_genera_mes_espanol = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION mes_en_espanol(mes_ingles TEXT)
                                                        RETURNS TEXT AS $$
                                                        BEGIN
                                                            RETURN CASE LOWER(trim(mes_ingles))
                                                                WHEN 'january' THEN 'enero'
                                                                WHEN 'february' THEN 'febrero'
                                                                WHEN 'march' THEN 'marzo'
                                                                WHEN 'april' THEN 'abril'
                                                                WHEN 'may' THEN 'mayo'
                                                                WHEN 'june' THEN 'junio'
                                                                WHEN 'july' THEN 'julio'
                                                                WHEN 'august' THEN 'agosto'
                                                                WHEN 'september' THEN 'septiembre'
                                                                WHEN 'october' THEN 'octubre'
                                                                WHEN 'november' THEN 'noviembre'
                                                                WHEN 'december' THEN 'diciembre'
                                                                ELSE 'Mes inválido'
                                                            END;
                                                        END;
                                                        $$ LANGUAGE plpgsql;`

  //AQUI VENDRIA EL TRIGGER QUE SE ENCARGA DE GENERAR LAS CUOTAS PARA LOS SOCIOS

  const genera_cuotas_socio = await prisma.$executeRaw`CREATE OR REPLACE FUNCTION public.generar_cuotas_socio()
                                                            RETURNS trigger
                                                            LANGUAGE 'plpgsql'
                                                            COST 100
                                                            VOLATILE NOT LEAKPROOF
                                                        AS $BODY$
                                                        DECLARE
                                                            fecha_inicio DATE;
                                                            fecha_loop DATE;
                                                            fecha_vencimiento_cuota DATE; -- SERIA EL 5 DE CADA MES
                                                            id_precio_cuota INTEGER;
                                                            monto_cuota_socio INTEGER;
                                                            meses_restantes INTEGER;
                                                          descuento FLOAT;
                                                        BEGIN
                                                            -- Define la fecha de inicio y ajusta al inicio del mes
                                                            fecha_inicio := DATE_TRUNC('month', NOW());
                                                            fecha_loop := fecha_inicio;
                                                            fecha_vencimiento_cuota := fecha_loop + INTERVAL '4 days';  -- Ajustamos para que sea el 5 de cada mes
                                                            
                                                            -- Determina el tipo de cuota según el tipo de socio
                                                          
                                                          SELECT A.ID_PRECIO_CUOTA, 
                                                              A.MONTO_CUOTA,
                                                              A.PORC_DESCUENTO INTO id_precio_cuota, monto_cuota_socio, descuento
                                                            FROM PRECIO_CUOTA A JOIN TIPO_SOCIO B ON A.ID_TIPO_SOCIO = B.ID_TIPO_SOCIO
                                                          WHERE B.ID_TIPO_SOCIO = NEW.ID_TIPO_SOCIO
                                                            AND A.VALIDO = TRUE
                                                            LIMIT 1;

                                                            IF NEW.es_socio = TRUE THEN
                                                                -- Calcula los meses restantes hasta diciembre
                                                                meses_restantes := 12 - EXTRACT(MONTH FROM fecha_inicio) + 1;

                                                                -- Genera las cuotas mensuales desde la creación hasta diciembre
                                                                FOR i IN 1..meses_restantes LOOP
                                                                    -- Inserta la cuota del socio
                                                              INSERT INTO public.cuotas_socio(
                                                                id_cliente, 
                                                                id_vencimiento, 
                                                                id_precio_cuota, 
                                                                fecha_vencimiento, 
                                                                descripcion, 
                                                                descuento, 
                                                                pago_realizado, 
                                                                fecha_pago_realizado, 
                                                                monto_cuota, 
                                                                estado)
                                                                VALUES (
                                                                  NEW.id_cliente, 
                                                                  (SELECT ID_VENCIMIENTO FROM VENCIMIENTO_CUOTAS WHERE VALIDO = TRUE LIMIT 1), 
                                                                  id_precio_cuota,
                                                                  fecha_vencimiento_cuota, 
                                                                  CONCAT('CUOTA : ', TO_CHAR(fecha_vencimiento_cuota, 'YYYY-MM-DD')), 
                                                                  descuento,
                                                                  FALSE,
                                                                  NULL,
                                                                  monto_cuota_socio,
                                                                  'PENDIENTE'
                                                                );

                                                                    -- Incrementa el bucle en un mes
                                                                    fecha_loop := fecha_loop + INTERVAL '1 month';
                                                                    fecha_vencimiento_cuota := fecha_loop + INTERVAL '4 days'; -- Ajustamos para que sea el 5 de cada mes
                                                                END LOOP;                                                         
                                                            END IF;                                                        
                                                            
                                                            RETURN NEW;
                                                        END;
                                                        $BODY$;`;

  const procedimiento_genera_cuotas = await prisma.$executeRaw`CREATE OR REPLACE PROCEDURE genera_cuotas_annio()
                                                                AS $$
                                                                DECLARE
                                                                    socio_fila RECORD;
                                                                  fecha_vencimiento_cuota DATE; -- SERIA EL 5 DE CADA MES
                                                                BEGIN
                                                                  -- SELECCIONO TODOS LOS SOCIOS ACTIVOS
                                                                  --DEBO RECORRER TODOS LOS DATOS DE MI CONSULTA E IR INSERTANDO EN LA TABLA DE CUOTAS
                                                                    FOR socio_fila IN (	SELECT DISTINCT (A.ID_CLIENTE) AS SOCIO,
																					   			A.NOMBRE_CMP AS NOMBRE_CMP,
																					   			A.NOMBRE AS NOMBRE,
																					   			A.APELLIDO AS APELLIDO,
																								C.ID_TIPO_SOCIO AS TIPO_SOCIO,
																					   			C.DESC_TIPO_SOCIO AS DESC_SOCIO,
																					   			D.ID_PRECIO_CUOTA AS ID_PRECIO,
																					   			D.MONTO_CUOTA AS MONTO,
																					   			D.DESC_TIPO_DESCUENTO AS TIPO_DESCUENTO,
																					   			D.DESC_PRECIO_CUOTA AS DESCUENTO,
																					   			D.PORC_DESCUENTO AS PORC_DESCUENTO
     																						FROM CLIENTE A JOIN tipo_socio C  ON A.id_tipo_socio = C.id_tipo_socio
                                                                                			JOIN precio_cuota D ON D.id_tipo_socio = C.id_tipo_socio
                                                                              WHERE ESTADO_USUARIO = 'ACTIVO') LOOP
                                                                    FOR i IN 1..12 LOOP
                                                                    
                                                                      fecha_vencimiento_cuota := (SELECT (DATE_TRUNC('MONTH', CURRENT_DATE + INTERVAL '1 month' * i))::DATE + dia_vencimiento FROM VENCIMIENTO_CUOTAS WHERE VALIDO = TRUE LIMIT 1);
                                                                      INSERT INTO public.cuotas_socio(id_cliente, 
																									  id_vencimiento, 
																									  id_precio_cuota, 
																									  fecha_vencimiento, 
																									  descripcion, 
																									  descuento, 
																									  pago_realizado, 
																									  fecha_pago_realizado, 
																									  monto_cuota, 
																									  estado)
																			 				VALUES (socio_fila.socio, 
																									(SELECT ID_VENCIMIENTO FROM VENCIMIENTO_CUOTAS WHERE VALIDO = TRUE LIMIT 1),
																									socio_fila.id_precio,
																									fecha_vencimiento_cuota,
																									CONCAT ( 'CUOTA : ', MES_EN_ESPANOL( TO_CHAR( fecha_vencimiento_cuota, 'Month' ) ), ' ,SOCIO :', socio_fila.nombre_cmp ),
																									socio_fila.porc_descuento, 
																									FALSE, 
																				  					NULL,
																									socio_fila.monto,
																									'PENDIENTE');
                                                                    END LOOP;
                                                                
                                                                
                                                                    END LOOP;

                                                                END $$ LANGUAGE plpgsql;`;

  const asigna_trigger_generacion_cuotas = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_generar_cuotas_socio
                                                                    AFTER INSERT OR UPDATE ON CLIENTE
                                                                    FOR EACH ROW
                                                                    EXECUTE FUNCTION generar_cuotas_socio();`;                                                             

  //---------------------------------------------------------------------------------
  const pass_admin = process.env.C0NTR4SEN1A_4DM1N; 

  const socios = await prisma.cliente.createMany( { data : [  
                                                            { 
                                                              nombre : "Victor", apellido : "Garcete", 
                                                              cedula : '4365710123123', fecha_nacimiento : generar_fecha( '29/05/2023' ) ,
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_usuario : 'ACTIVO',
                                                              nombre_cmp : "Victor Garcete", numero_telefono : "0985552004",
                                                              nombre_usuario : "v_garcete", password : encriptar_password("12345678"), 
                                                              creadoen : new Date(), id_rol_usuario : 2,
                                                              es_socio : true
                                                            },

                                                            { 
                                                              nombre : "ADMINISTRADOR_CLUB", apellido : "----------------", 
                                                              cedula : '12345678', fecha_nacimiento : new Date(),
                                                              id_tipo_socio : 4, creadoen : new Date(), estado_usuario : 'ACTIVO',
                                                              nombre_cmp : "ADMINISTRADOR CLUB", numero_telefono : "----------",
                                                              nombre_usuario : "ADMINISTRADOR_CLUB", password : encriptar_password(pass_admin) , 
                                                              creadoen : new Date(), id_rol_usuario : 1,
                                                              es_socio : true
                                                            },

                                                            {
                                                              nombre : "Lucas", apellido : "Torres", 
                                                              cedula : '1111111', fecha_nacimiento : generar_fecha( '13/05/2000' ),  
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_usuario : "SUSPENDIDO",
                                                              nombre_cmp : "Lucas Torres", numero_telefono : "------------",
                                                              nombre_usuario : "lucas.torres", password : encriptar_password("12345678"),
                                                              creadoen : new Date(), id_rol_usuario : 1 ,
                                                              es_socio : true
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
                                                                              cedula : '37682669'
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

  const precio_x_clase_profesores = await prisma.precio_clase.createMany( {
                                                                            data : [
                                                                              { id_profesor : 1, precio : 70000, creado_en : new Date(), porc_descuento : 0, valido : true },
                                                                              { id_profesor : 2, precio : 80000, creado_en : new Date(), porc_descuento : 0, valido : true },
                                                                              { id_profesor : 3, precio : 80000, creado_en : new Date(), porc_descuento : 0, valido : true }
                                                                            ]
                                                                        } );
  const clientes_profesores = await prisma.cliente.createMany( { 
                                                                    data : [
                                                                      { apellido : '', nombre : 'ECHAGUE', cedula : '3768266', creadoen : new Date(), es_socio : false },
                                                                      { apellido : '', nombre : 'AXEL', cedula : '37682669', creadoen : new Date(), es_socio : false },
                                                                      { apellido : '', nombre : 'JUANMA', cedula : '2126262', creadoen : new Date(), es_socio : false }
                                                                    ]
                                                               } )
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


  const precio_reserva = await prisma.precio_reservas.create( { data : { monto_reserva : 30000, creado_en : new Date(), valido : true,  } } )
  const precio_clases = await prisma.precio_clase.create( { data : { precio : 60000, id_profesor : 1, porc_descuento : 0, valido : true, creado_en : new Date () } } )
  //VOY A CREAR UNAS CUANTAS RESERVAS PARA LAS PRUEBAS QUE HAY QUE HACER
  //const reservas = await prisma.reservas.createMany( { data : 
  //                                                        [
  //                                                          { creado_en : new Date(), creado_por : 1, hora_desde : new Date('2024-06-17T17:00:00.000Z'), hora_hasta : new Date('2024-06-17T18:00:00.000Z'), id_cliente : 2, id_mesa : 1, monto : 30000, id_precio_reserva : 1, fecha_reserva : new Date(), fecha_creacion : new Date()  },
  //                                                          { creado_en : new Date(), creado_por : 1, hora_desde : new Date('2024-09-16T17:00:00.000Z'), hora_hasta : new Date('2024-06-17T18:00:00.000Z'), id_cliente : 1, id_mesa : 2, monto : 30000, id_precio_reserva : 1, fecha_reserva : new Date(), fecha_creacion : new Date()  },
  //                                                          { creado_en : new Date(), creado_por : 1, hora_desde : new Date('2024-09-17T17:00:00.000Z'), hora_hasta : new Date('2024-09-17T19:00:00.000Z'), id_cliente : 2, id_mesa : 3, monto : 30000, id_precio_reserva : 1, fecha_reserva : new Date(), fecha_creacion : new Date()  },
  //                                                        ]
  //
  //                                                    } );                                                                      
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  const crea_gastos_fijos = await prisma.gastos_fijos.createMany( { 
                                                                    data : [
                                                                      { creado_en : new Date(), creado_por : 1, fecha_vencimiento : new Date( (new Date()).getFullYear(), (new Date()).getMonth(), 5 ), id_tipo_egreso : 4, monto : 4500000, descripcion_gasto_fijo : 'ALQUILER' },
                                                                      { creado_en : new Date(), creado_por : 1, fecha_vencimiento : new Date( (new Date()).getFullYear(), (new Date()).getMonth(), 5 ), id_tipo_egreso : 1, monto : 480000, descripcion_gasto_fijo : 'LIMPIEZA GENERAL' },
                                                                      { creado_en : new Date(), creado_por : 1, fecha_vencimiento : new Date( (new Date()).getFullYear(), (new Date()).getMonth(), 5 ), id_tipo_egreso : 3, monto : 350000, descripcion_gasto_fijo : 'ANDE, LUZ' },
                                                                      { creado_en : new Date(), creado_por : 1, fecha_vencimiento : new Date( (new Date()).getFullYear(), (new Date()).getMonth(), 5 ), id_tipo_egreso : 2, monto : 40000, descripcion_gasto_fijo : 'ESSAP AGUA' },
                                                                      { creado_en : new Date(), creado_por : 1, fecha_vencimiento : new Date( (new Date()).getFullYear(), (new Date()).getMonth(), 5 ), id_tipo_egreso : 6, monto : 140000, descripcion_gasto_fijo : 'INTERNET' },
                                                                      { creado_en : new Date(), creado_por : 1, fecha_vencimiento : new Date( (new Date()).getFullYear(), (new Date()).getMonth(), 5 ), id_tipo_egreso : 1, monto : 70000, descripcion_gasto_fijo : 'ARTICULOS DE LIMPIEZA' },
                                                                      //{ creado_en : new Date(), creado_por : 1, fecha_vencimiento : new Date( (new Date()).getFullYear(), (new Date()).getMonth(), 5 ), id_tipo : 1, monto : 40000, descripcion_gasto_fijo : '' }
                                                                    ] 

                                                                } );
  
  const crea_procedimiento_gastos_fijos = await prisma.$executeRaw`CREATE OR REPLACE PROCEDURE genera_gastos_fijos()
                                                                AS $$
                                                                DECLARE
                                                                    gastos_fijos RECORD;
                                                                BEGIN
                                                                  --DEBO RECORRER TODOS LOS DATOS DE MI CONSULTA E IR INSERTANDO EN LA TABLA DE COMPRAS
                                                                    FOR gastos_fijos IN ( SELECT ID_GASTO_FIJO,
                                                                    ID_TIPO_EGRESO,
                                                                    MONTO,
                                                                    DESCRIPCION_GASTO_FIJO,
                                                                    FECHA_VENCIMIENTO
                                                                  FROM GASTOS_FIJOS ) LOOP
                                                        
                                                                                        INSERT INTO public.compras(id_cliente, 
                                                                        id_insumo, 
                                                                      id_gasto_fijo, 
                                                                      descripcion, 
                                                                      estado, 
                                                                      creado_en, 
                                                                      creado_por,
                                                                      fecha_operacion, 
                                                                      monto, 
                                                                      cedula, 
                                                                      proveedor)
                                                                VALUES (
                                                                      1,
                                                                      NULL,
                                                                      gastos_fijos.id_gasto_fijo,
                                                                      gastos_fijos.descripcion_gasto_fijo,
                                                                      'PENDIENTE DE PAGO',
                                                                      CURRENT_TIMESTAMP,
                                                                      1,
                                                                      gastos_fijos.fecha_vencimiento,
                                                                      gastos_fijos.monto,
                                                                      '',
                                                                      NULL
                                                                    );
                                                                                    
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