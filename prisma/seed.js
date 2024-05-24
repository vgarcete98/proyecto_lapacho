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
  const modulos = await prisma.modulos.createMany(
                                                                  {
                                                                    data : [
                                                                      { nombre_modulo : 'SOCIOS' },
                                                                      { nombre_modulo : 'PAGO_CUOTAS' },
                                                                      { nombre_modulo : 'PASES_CLUBES_JUGADORES' },
                                                                      { nombre_modulo : 'EVENTOS' },
                                                                      { nombre_modulo : 'SEGURIDAD' },
                                                                      { nombre_modulo : 'INSCRIPCIONES_EVENTOS' },
                                                                      { nombre_modulo : 'PROFESORES' },    
                                                                      { nombre_modulo : 'RESERVAS' },
                                                                      { nombre_modulo : 'INGRESOS_CLUB' },   
                                                                      { nombre_modulo : 'EGRESOS_CLUB' }, 
                                                                      { nombre_modulo : 'CLASES' },                                                                      
                                                                    ]
                                                                  }
                                                                );
//-----------------------------------------------------------------------------------------------------------------------------

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
                                                                //----------------------------------------
                                                                { path_ruta : '/socio', id_modulo : 1, accion : 'CREAR SOCIO'  },
                                                                { path_ruta : '/socio', id_modulo : 1, accion : 'VER SOCIO'  },
                                                                { path_ruta : '/socio', id_modulo : 1, accion : 'ACTUALIZAR SOCIO'  },
                                                                { path_ruta : '/socio', id_modulo : 1, accion : 'BORRAR SOCIO'  },
                                                                //----------------------------------------
                                                                //----------------------------------------
                                                                { path_ruta : '/cuotas_club/cuota_socio', id_modulo : 2, accion : 'VER CUOTAS DE SOCIO'  },
                                                                { path_ruta : '/pagos_socio/socio/pagar_cuota', id_modulo : 2, accion : 'PAGAR CUOTA'  },
                                                                { path_ruta : '/pagos_socio/socio/anular_pago', id_modulo : 2, accion : 'ANULAR PAGO CUOTA'  },
                                                                { path_ruta : '/cuotas_club/cuotas_reporte', id_modulo : 2, accion : 'REPORTE DE CUOTAS'  },
                                                                //----------------------------------------

                                                                //----------------------------------------
                                                                { path_ruta : '/roles/obtener_roles' , id_modulo :  5, accion : 'VER ROLES'  },
                                                                { path_ruta : '/roles/crear_rol' ,  id_modulo : 5, accion : 'CREAR ROLES'  },
                                                                { path_ruta : '/roles/borrar_rol' ,  id_modulo : 5, accion : 'BORRAR ROLES'  },
                                                                { path_ruta : '/roles/editar_rol' ,  id_modulo : 5, accion : 'EDITAR ROLES'  },

                                                                //----------------------------------------
                                                                { path_ruta : '/accesos/crear_accesos' ,  id_modulo : 5, accion : 'CREAR ACCESO PARA ROLES'  },
                                                                { path_ruta : '/accesos/editar_accesos' ,  id_modulo : 5, accion : 'EDITAR ACCESO PARA ROLES'  },
                                                                { path_ruta : '/accesos/borrar_accesos' ,  id_modulo : 5, accion : 'BORRAR ACCESO PARA ROLES'  },
                                                                { path_ruta : '/accesos/obtener_accesos' ,  id_modulo : 5, accion : 'VER ACCESO PARA ROLES'  },
                                                                { path_ruta : '/accesos/asignar_accesos' ,  id_modulo : 5, accion : 'ASIGNAR ACCESO A ROL'  },
                                                                { path_ruta : '/accesos/quitar_accesos' ,  id_modulo : 5, accion : 'REPORTE DE CUOTAS'  },
                                                                //----------------------------------------

                                                                //----------------------------------------
                                                                { path_ruta : '/accesos/crear_modulos' ,  id_modulo : 5, accion : 'VER CUOTAS DE SOCIO'  },
                                                                { path_ruta : '/accesos/editar_modulos' ,  id_modulo : 5, accion : 'PAGAR CUOTA'  },
                                                                { path_ruta : '/accesos/obtener_modulos' ,  id_modulo : 5, accion : 'ANULAR PAGO CUOTA'  },
                                                                { path_ruta : '/accesos/eliminar_modulos' ,  id_modulo : 5, accion : 'REPORTE DE CUOTAS'  },
                                                                //----------------------------------------

                                                                { path_ruta : '/profesores', id_modulo : 7, accion : 'BORRAR SOCIO'  },
                                                                
                                                        


                                                                //----------------------------------------
                                                                //{ path_ruta : '/socio', id_modulo : 1  },
                                                                //----------------------------------------

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
                                                                { descripcion : "SERVICIO_DE_AGUA"  },
                                                                { descripcion : "SERVICIO_DE_LUZ"  },
                                                                { descripcion : "ALQUILER_LOCAL"  },
                                                                { descripcion : "MANTENIMIENTO_DEL_CLUB"  },
                                                                { descripcion : "SERVICIO_DE_INTERNET"  },
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
                                                                                                                          
                                                              LOOP
                                                                  -- Inserta la cuota del socio
                                                                  INSERT INTO CUOTAS_SOCIO (
                                                                      id_socio, id_tipo_cuota, id_tipo_descuento, 
                                                                      fecha_vencimiento, descripcion, pago_realizado, monto_cuota
                                                                  )
                                                                  VALUES (
                                                                      NEW.ID_SOCIO, tipo_cuota, 1,
                                                                      fecha_vencimiento_cuota, CONCAT('CUOTA : ', fecha_vencimiento_cuota), false, monto_cuota_socio
                                                                  );
                                                                
                                                                  -- Incrementa el bucle en un mes
                                                                  fecha_loop := fecha_loop + INTERVAL '1 month';
                                                                  fecha_vencimiento_cuota := fecha_loop + INTERVAL '4 days'; -- Ajustamos para que sea el 5 de cada mes
                                                                
                                                                  -- Comprueba la condición de salida
                                                                  IF EXTRACT(MONTH FROM fecha_loop) = 12) THEN
                                                                  EXIT; -- Sale del bucle después de diciembre del mismo año
                                                              END IF;
                                                              END LOOP;
                                                                
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
                                                              creadoen : new Date(), tipo_usuario : "ACTIVO", id_rol_usuario : 2
                                                            },

                                                            { 
                                                              id_tipo_socio : 4, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "ADMINISTRADOR CLUB", numero_telefono : "----------", id_persona : 2,
                                                              nombre_usuario : "ADMINISTRADOR_CLUB", contrasea : pass_admin , estado_usuario : 1, 
                                                              creadoen : new Date(), tipo_usuario : "ACTIVO", id_rol_usuario : 1
                                                            },

                                                            { 
                                                              id_tipo_socio : 1, creadoen : new Date(), estado_socio : 1,
                                                              nombre_cmp : "Lucas Torres", numero_telefono : "------------", id_persona : 2,
                                                              nombre_usuario : "lucas.torres", contrasea : "12345678", estado_usuario : 2, 
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


  const socios_prueba = [  
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Tenace Puentes'      , 'Antonio José Emilio' ,'416483', TO_DATE('27/7/1959'  , 'DD/MM/YYYY')   ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Fu', 'Alisan' ,'4276911', TO_DATE('23/07/1990', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Cuyer Aguilera', 'Axel Augusto Andrés' ,'4645373', TO_DATE('25/3/1997', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Gavilán Villalba', 'Axel Rafael' ,'3844124', TO_DATE('22/10/1994', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Oviedo Osorio', 'Carlos Fernando' ,'2572658', TO_DATE('12/8/1988', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Duarte Romero', 'Diego Enrique' ,'5030385', TO_DATE('28/08/1997', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Hermosilla Benítez', 'Diego Luis Alberto' ,'5771846', TO_DATE('18/12/2003', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Pastore Acosta', 'Diego Manuel' ,'4293184', TO_DATE('8/4/1997', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Gauto Ojeda', 'Diego Osmar' ,'3258546', TO_DATE('15/02/1981', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Florentin Cuenca', 'Dora Esther' ,'5025922', TO_DATE('4/9/2001', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Chenú Vargas', 'Eduardo' ,'897242', TO_DATE('4/11/1971', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Pastore Acosta', 'Ivan Santino' ,'6779965', TO_DATE('23/8/2008', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Harasic Muñoz', 'Jerko Nicolás' ,'2963942', TO_DATE('21/6/1990', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Duré Barrios', 'Jorge' ,'2966570', TO_DATE('21/04/78', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Echagüe Ramirez', 'Jorge Guillermo' ,'4318501', TO_DATE('25/6/1990', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Pastore Acosta', 'José Gabriel' ,'4332930', TO_DATE('27/2/1992', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Acosta González', 'José Milciades' ,'1043896', TO_DATE('5/7/1968', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Arce Quevedo', 'Juan Andrés' ,'1201906', TO_DATE('4/12/1978', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Ovelar Jara', 'Lucero Arami' ,'3603156', TO_DATE('31/7/1992', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Gomez Olmedo', 'Luis Antonio' ,'4414358', TO_DATE('22/7/1997', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Rotela Samaniego', 'Luis Armando' ,'786592', TO_DATE('5/6/1967', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Britez Chamorro', 'Manuel Gaspar' ,'839735', TO_DATE('6/1/1966', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Barboza Alvarez', 'Marcelo Hernán' ,'1723774', TO_DATE('19/11/1971', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Martínez López', 'María de Fátima' ,'4658254', TO_DATE('2/4/1997', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Rolón', 'Mauro Javier' ,'3805309', TO_DATE('2/1/1991', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Hermosilla Benítez', 'Melina Beatriz' ,'4651673', TO_DATE('30/03/1998', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Gavilán Cabrera', 'Oscar Moisés' ,'794426', TO_DATE('12/12/1965', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Morales Reichert', 'Oscar' ,'601593', TO_DATE('10/5/1959', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Ferreira Barrios', 'Roberto' ,'1193374', TO_DATE('18/12/1970', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Gavilán Villalba', 'Sandy Soledad' ,'3465225', TO_DATE('20/11/1992', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Teresa Insfrán', 'Teresa' ,'4669899', TO_DATE('17/09/1988', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Zelada Ramírez', 'Valeria Thaiz' ,'6322913', TO_DATE('9/1/2003', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Garcete Domecq', 'Vanesa Monserrat' ,'4923094', TO_DATE('10/12/2001', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Garcete Domecq', 'Victor Andrés' ,'4365710', TO_DATE('29/5/1998', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Aguirre Antonelli', 'Victor César' ,'870704', TO_DATE('20/07/1966', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Garcete Tribucio', 'Victor Edgar' ,'1479268', TO_DATE('2/1/1972', 'DD/MM/YYYY') ) ; `,
    `INSERT INTO public.persona ( apellido, nombre, cedula, fecha_nacimiento) VALUES ( 'Monges Lopez', 'Victor Rubén' ,'4302281', TO_DATE('6/9/1997', 'DD/MM/YYYY') ) ; `
  ];     
  
  socios_prueba.map( async ( element ) =>{
    await prisma.$executeRawUnsafe( element );
  } );

  await prisma.$executeRaw`INSERT INTO public.socio (id_tipo_socio, id_persona, id_rol_usuario, tipo_usuario, nombre_usuario, contrasea, estado_usuario, nombre_cmp, estado_socio, creadoen) 
                                                          select 2, A.id_persona, 2, 'ACTIVO', (lower( left  (a.nombre, 1) || split_part(A.apellido,' ', 1))) as nombre_usuario, 'Test123Lapacho', 1, A.nombre || ',' || A.apellido as nombre_cmp, 1, current_date  
                                                        from PERSONA A 
                                                      where  A.id_persona not in ( 1, 2, 3 );`;

  const actualiza_socios_prueba = [
    `UPDATE public.socio SET numero_telefono='0991-700500', direccion='Tte. 2do Eladio Escobar N 3073 c/ Evasio Perinciolo Merlo casa 2 / Condomio Barrio San Jorge / Asunción.', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '416483');`,
    `UPDATE public.socio SET numero_telefono='0981-783278', direccion='Austria 1975 / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4276911');`,
    `UPDATE public.socio SET numero_telefono='0981-704101', direccion='Epifanio Mendez Fleitas (264) / Ñemby', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4645373');`,
    `UPDATE public.socio SET numero_telefono='0982-859829', direccion='Cnel.Cabrera 554 e/ Bertoni y 4 de Julio', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '3844124');`,
    `UPDATE public.socio SET numero_telefono='0981-545498', direccion='Mompox 1628 / Fernando de la Mora', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '2572658');`,
    `UPDATE public.socio SET numero_telefono='0971-766788', direccion='Dr Caballero 1218 c/ Lillo /Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '5030385');`,
    `UPDATE public.socio SET numero_telefono='0976-141152', direccion='R.I. 18 Pitiantuta c/ Boggiani 564 / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '5771846');`,
    `UPDATE public.socio SET numero_telefono='0983-843968', direccion='San Miguel casi Tte Bareiro / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4293184');`,
    `UPDATE public.socio SET numero_telefono='0985-175451', direccion='Tte. Benigno Cáceres  456 c/ José Pappalardo - Bo. Itay / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '3258546');`,
    `UPDATE public.socio SET numero_telefono='0983-970034', direccion='Bolivar casi San Martin 304 / Capiata', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '5025922');`,
    `UPDATE public.socio SET numero_telefono='0981-436370', direccion='Mayor Emilio Pastore 1280 casi Juan Rivarola', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '897242');`,
    `UPDATE public.socio SET numero_telefono='0982-666430', direccion='San Miguel casi Tte Bareiro / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '6779965');`,
    `UPDATE public.socio SET numero_telefono='0981-100550', direccion='Cnel.Cabrera 554 e/ Bertoni y 4 de Julio', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '2963942');`,
    `UPDATE public.socio SET numero_telefono='0981-466394', direccion='Ibañez Rojas casi Lapachos / Luque', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '2966570');`,
    `UPDATE public.socio SET numero_telefono='0961-930640', direccion='Lapacho N° 2335 c/ San Andrés', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4318501');`,
    `UPDATE public.socio SET numero_telefono='0991-214694', direccion='San Miguel casi Tte Bareiro / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4332930');`,
    `UPDATE public.socio SET numero_telefono='0985-355626', direccion='Oasis y Teniente Pino / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '1043896');`,
    `UPDATE public.socio SET numero_telefono='0983-144376', direccion='Araucanos casi Adela Speratti / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '1201906');`,
    `UPDATE public.socio SET numero_telefono='0971-329080', direccion='Hermínio Giménez 205 c/ Iturbe / Fernando de la Mora', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '3603156');`,
    `UPDATE public.socio SET numero_telefono='0971-512257', direccion='Teniente Ettiene  1644 c/ Storm / Fernando de la Mora / Zona Norte', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4414358');`,
    `UPDATE public.socio SET numero_telefono='0981-418575', direccion='Cañada Del Carmen 2450 /Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '786592');`,
    `UPDATE public.socio SET numero_telefono='0981-870362', direccion='Estero Bellaco 2239 c / Acosta Ñu / Lambar', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '839735');`,
    `UPDATE public.socio SET numero_telefono='0981-812540', direccion='ITURBE 771 / ASUNCION', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '1723774');`,
    `UPDATE public.socio SET numero_telefono='0981-167550', direccion='Manuel Ortiz Guerrero Número 42 / Mariano Roque Alonso', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4658254');`,
    `UPDATE public.socio SET numero_telefono='0981-966114', direccion='Ingavi esq. Atyra 2717 / Fernando de la Mora', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '3805309');`,
    `UPDATE public.socio SET numero_telefono='0976-144406', direccion='R.I. 18 Pitiantuta c/ Boggiani 564 / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4651673');`,
    `UPDATE public.socio SET numero_telefono='0981-701592 ', direccion='Cnel.Cabrera 554 e/ Bertoni y 4 de Julio', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '794426');`,
    `UPDATE public.socio SET numero_telefono='0981-378373', direccion='Mayor Lamas Carissimo 716 / Villa Aurelia / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '601593');`,
    `UPDATE public.socio SET numero_telefono='0981-324214', direccion='Mompox 446 casi Florencio Villamayor / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '1193374');`,
    `UPDATE public.socio SET numero_telefono='0981-560513', direccion='Cnel.Cabrera 554 e/ Bertoni y 4 de Julio', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '3465225');`,
    `UPDATE public.socio SET numero_telefono='0986-378454', direccion='Madame Lynch c/Alejo Silva / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4669899');`,
    `UPDATE public.socio SET numero_telefono='0984-971073', direccion='Dr. Brizuela casi Overava', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '6322913');`,
    `UPDATE public.socio SET numero_telefono='0985-474456', direccion='Americo merlo 812 Asunción ', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4923094');`,
    `UPDATE public.socio SET numero_telefono='0981-211756', direccion='Tte. Mauricio Escobar 495 esquina Zurbaran. No Jara. ASUNCIÓN', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '870704');`,
    `UPDATE public.socio SET numero_telefono=' 0981-933563', direccion='Americo merlo 812 Asunción ', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '1479268');`,
    `UPDATE public.socio SET numero_telefono='0976-349050', direccion='Aztecas 4595/ Jon Von Sastrow / Asunción', editadoen= CURRENT_DATE WHERE id_persona= (SELECT id_persona FROM persona WHERE cedula = '4302281');`
  ];
  actualiza_socios_prueba.map( async ( element ) =>{
    await prisma.$executeRawUnsafe( element );
  } );




  
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
																                                      		   			AND (NEW.HORARIO_INICIO = HORA_DESDE AND NEW.HORARIO_HASTA = HORA_HASTA) 
																                                      		  			AND (ID_MESA = NEW.ID_MESA) )) THEN 
																                                      	RAISE EXCEPTION 'No se puede agendar esa clase, hay una reserva que lo impide';
    														                                      		RETURN NULL; -- Impide la operación
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
																                                              				FROM RESERVAS 
																                                              			WHERE  (NEW.FECHA_RESERVA = FECHA_AGENDAMIENTO) 
																                                              		   			AND (NEW.HORA_DESDE = HORARIO_INICIO AND NEW.HORA_HASTA = HORARIO_HASTA) 
																                                              		  			AND (ID_MESA = NEW.ID_MESA) )) THEN 
																                                              	RAISE EXCEPTION 'No se puede agendar esa Reserva, hay una clase que lo impide';
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

															                                              DELETE FROM public.reservas
															                                              	WHERE fecha_reserva BETWEEN NEW.FECHA_DESDE_EVENTO AND FECHA_HASTA_EVENTO;

															                                              DELETE FROM public.agendamiento_clase
															                                              	WHERE fecha_hasta_evento BETWEEN NEW.FECHA_DESDE_EVENTO AND FECHA_HASTA_EVENTO;
															                                              RETURN NEW;

                                                                          END;
                                                                        $$ LANGUAGE plpgsql;`
  const trigger_func_verifica_reservas_o_clases = await prisma.$executeRaw`CREATE OR REPLACE TRIGGER trigger_verifica_reservas_o_clases
                                                                              BEFORE INSERT OR UPDATE ON CALENDARIO_EVENTOS
                                                                              FOR EACH ROW
                                                                              EXECUTE FUNCTION verifica_reservas_o_clases();`;                                                                                        
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