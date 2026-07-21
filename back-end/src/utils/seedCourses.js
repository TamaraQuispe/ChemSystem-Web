require('dotenv').config();
const { sequelize, Course, Module, Lesson, Assessment, QuestionBank } = require('../models');
const { generateModuleContent } = require('./seedContentGenerator');

// ===== CURRICULUM — 5 courses, 10 modules each =====
const COURSES_DATA = [
  C('Fundamentos de Química', 'fundamentos-quimica',
    'Curso introductorio. Sienta las bases absolutas: materia, átomos, elementos, enlaces, reacciones y estequiometría. No requiere conocimientos previos.',
    'beginner', 12,
    ['Comprender la naturaleza de la materia', 'Identificar partículas subatómicas', 'Balancear ecuaciones químicas', 'Realizar cálculos estequiométricos'],
    [
      M('Introducción a la Química', 'intro-quimica', '¿Qué es la química? Ramas de la química. El método científico. Importancia en la vida cotidiana. Relación con otras ciencias.', 40, 120),
      M('Materia y sus Propiedades', 'materia-propiedades', 'Concepto de materia. Propiedades físicas y químicas. Cambios de estado. Clasificación de la materia: sustancias puras y mezclas. Métodos de separación.', 40, 130),
      M('Estructura Atómica', 'estructura-atomica', 'Partículas subatómicas: protón, neutrón, electrón. Número atómico y masa atómica. Isótopos. Modelos atómicos de Dalton, Thomson, Rutherford y Bohr.', 45, 140),
      M('Configuración Electrónica y Tabla Periódica', 'configuracion-tabla', 'Distribución electrónica por niveles. Principio de Aufbau. Tabla periódica: grupos, periodos, metales, no metales. Propiedades periódicas.', 45, 140),
      M('Enlaces Químicos', 'enlaces-quimicos', 'Regla del octeto. Enlace iónico: formación de sales. Enlace covalente: moléculas, polaridad. Enlace metálico. Estructuras de Lewis.', 45, 140),
      M('Nomenclatura Inorgánica', 'nomenclatura-inorganica', 'Sistemas Stock, sistemático y tradicional. Óxidos, hidróxidos, ácidos y sales. Compuestos binarios y ternarios.', 40, 130),
      M('Reacciones Químicas', 'reacciones-quimicas', 'Ecuaciones químicas. Balanceo por tanteo. Tipos de reacciones: síntesis, descomposición, desplazamiento, doble desplazamiento, combustión.', 45, 140),
      M('Estequiometría', 'estequiometria', 'Mol y número de Avogadro. Cálculos mol-masa. Reactivo limitante y rendimiento. Relaciones estequiométricas en ecuaciones.', 50, 150),
      M('Gases', 'gases', 'Leyes de Boyle, Charles, Gay-Lussac. Ecuación del gas ideal. Ley de Dalton de presiones parciales. Difusión y efusión.', 45, 140),
      M('Proyecto Integrador: Análisis de una Reacción', 'proyecto-integrador-1', 'Aplicación integrada de estequiometría, gases y balanceo. Resolución de un caso real paso a paso con informe final.', 60, 200),
    ]),
  C('Química General', 'quimica-general',
    'Construye sobre Fundamentos. Abarca termoquímica, cinética, equilibrio, ácido-base, electroquímica y química nuclear. Prepara para Química Orgánica.',
    'intermediate', 15,
    ['Aplicar leyes de los gases', 'Calcular entalpías y energías', 'Determinar velocidades de reacción', 'Analizar equilibrios químicos', 'Identificar procesos electroquímicos'],
    [
      M('Teoría Cinético-Molecular', 'teoria-cinetica-molecular', 'Postulados de la teoría cinética. Relación entre temperatura y energía cinética. Comportamiento de partículas en sólidos, líquidos y gases.', 40, 130),
      M('Termoquímica', 'termoquimica', 'Energía interna, calor y trabajo. Entalpía y cambios entálpicos. Ley de Hess. Calorimetría. Entalpía de formación, combustión y enlace.', 50, 150),
      M('Cinética Química', 'cinetica-quimica', 'Velocidad de reacción. Factores que afectan la velocidad. Ley de velocidad. Orden de reacción. Teoría de colisiones y energía de activación.', 45, 140),
      M('Equilibrio Químico', 'equilibrio-quimico', 'Equilibrio dinámico. Constante de equilibrio Kc y Kp. Principio de Le Chatelier. Factores que afectan el equilibrio. Cálculos.', 50, 150),
      M('Ácidos y Bases', 'acidos-bases', 'Teorías de Arrhenius, Brønsted-Lowry y Lewis. Escala de pH. Ácidos y bases fuertes y débiles. Indicadores. Neutralización y titulación.', 45, 140),
      M('Equilibrio Iónico y Solubilidad', 'equilibrio-ionico', 'Producto de solubilidad Kps. Efecto del ión común. Formación de precipitados. Equilibrios ácido-base en soluciones buffer.', 45, 140),
      M('Electroquímica', 'electroquimica', 'Celdas galvánicas y electrolíticas. Potencial estándar de electrodo. Ecuación de Nernst. Electrólisis. Leyes de Faraday. Corrosión.', 50, 150),
      M('Química Nuclear', 'quimica-nuclear', 'Radiactividad. Tipos de decaimiento. Fisión y fusión nuclear. Cinética de decaimiento radiactivo. Aplicaciones médicas e industriales.', 40, 130),
      M('Química Ambiental', 'quimica-ambiental', 'Contaminación atmosférica. Efecto invernadero. Lluvia ácida. Tratamiento de aguas. Química verde y sostenibilidad.', 40, 130),
      M('Seminario Integrador', 'seminario-integrador-2', 'Estudio de caso multitemático combinando termoquímica, cinética, equilibrio y electroquímica. Exposición y defensa de resultados.', 60, 200),
    ]),
  C('Química Orgánica', 'quimica-organica',
    'Requiere Química General. Desde el átomo de carbono hasta biomoléculas. Hidrocarburos, grupos funcionales, isomería, reacciones orgánicas y polímeros.',
    'advanced', 18,
    ['Comprender la hibridación del carbono', 'Nombrar compuestos según IUPAC', 'Identificar grupos funcionales', 'Predecir productos de reacciones orgánicas'],
    [
      M('El Carbono y los Hidrocarburos', 'carbono-hidrocarburos', 'Configuración electrónica del carbono. Hibridación sp³, sp², sp. Alcanos, alquenos y alquinos. Nomenclatura IUPAC. Propiedades.', 45, 140),
      M('Reacciones de Hidrocarburos', 'reacciones-hidrocarburos', 'Reacciones de alcanos: combustión, halogenación. Reacciones de alquenos: adición electrofílica. Reacciones de alquinos. Mecanismos.', 45, 140),
      M('Hidrocarburos Aromáticos', 'aromaticos', 'Benceno y aromaticidad. Regla de Hückel. Sustitución electrofílica aromática. Derivados del benceno. Nomenclatura.', 45, 140),
      M('Grupos Funcionales Oxigenados', 'grupos-oxigenados', 'Alcoholes, éteres, aldehídos, cetonas, ácidos carboxílicos y ésteres. Propiedades, nomenclatura y reactividad comparada.', 50, 150),
      M('Grupos Funcionales Nitrogenados', 'grupos-nitrogenados', 'Aminas, amidas, nitrocompuestos. Basicidad de aminas. Reacciones de diazotación. Importancia biológica.', 40, 130),
      M('Isomería', 'isomeria', 'Isomería estructural: cadena, posición, función. Estereoisomería: geométrica (cis-trans) y óptica (quiralidad). Enantiómeros.', 45, 140),
      M('Reacciones de Grupos Funcionales', 'reacciones-grupos-funcionales', 'Oxidación de alcoholes. Reducción de carbonilos. Esterificación. Saponificación. Reacciones de aminación. Mecanismos comparados.', 45, 140),
      M('Polímeros', 'polimeros-organica', 'Polimerización por adición y condensación. Polietileno, PVC, nailon, poliéster. Propiedades y aplicaciones. Biopolímeros.', 40, 130),
      M('Biomoléculas', 'biomoleculas', 'Carbohidratos, lípidos, proteínas y ADN. Estructura, función e importancia biológica. Relación estructura-función.', 50, 150),
      M('Análisis y Síntesis Orgánica', 'sintesis-organica', 'Estrategias de síntesis. Análisis retrosintético. Identificación por espectroscopía. Proyecto de síntesis orgánica.', 60, 200),
    ]),
  C('Química Analítica', 'quimica-analitica',
    'Requiere Química General. Enfoque en análisis cuantitativo y cualitativo, instrumentación, tratamiento de datos y validación de métodos.',
    'advanced', 20,
    ['Aplicar técnicas gravimétricas y volumétricas', 'Operar instrumentos espectroscópicos', 'Interpretar cromatogramas', 'Validar métodos analíticos'],
    [
      M('Introducción al Análisis Químico', 'intro-analitica', 'Análisis cualitativo vs cuantitativo. Etapas del proceso analítico. Muestreo y preparación. Expresión de resultados.', 40, 130),
      M('Estadística Aplicada al Análisis', 'estadistica-analitica', 'Medidas de tendencia central y dispersión. Distribución normal. Intervalos de confianza. Pruebas Q y t. Regresión lineal.', 45, 140),
      M('Gravimetría', 'gravimetria', 'Precipitación y digestión. Filtración, lavado y calcinación. Cálculos gravimétricos. Aplicaciones en minerales y alimentos.', 45, 140),
      M('Volumetría Ácido-Base', 'volumetria-acido-base', 'Curvas de titulación. Indicadores. Punto de equivalencia. Valoraciones de ácidos fuertes/débiles. Aplicaciones industriales.', 45, 140),
      M('Volumetría de Precipitación y Redox', 'volumetria-precipitacion-redox', 'Métodos de Mohr, Volhard y Fajans. Permanganometría. Yodometría. Aplicaciones en control de calidad.', 45, 140),
      M('Espectroscopía Molecular', 'espectroscopia-molecular', 'Espectro electromagnético. Ley de Beer-Lambert. Espectrofotometría UV-Vis. Curvas de calibración. Aplicaciones farmacéuticas.', 50, 150),
      M('Espectroscopía Atómica', 'espectroscopia-atomica', 'Absorción atómica. Emisión atómica. Plasma ICP. Espectrometría de masas. Metales traza en medio ambiente.', 45, 140),
      M('Cromatografía', 'cromatografia', 'Fundamentos de separación. TLC, HPLC y GC. Instrumentación y aplicaciones. Análisis cualitativo y cuantitativo.', 50, 150),
      M('Técnicas Electroanalíticas', 'tecnicas-electroanaliticas', 'Potenciometría, electrodos selectivos, conductimetría, amperometría. Aplicaciones clínicas e industriales.', 40, 130),
      M('Validación y Control de Calidad', 'validacion-control-calidad', 'Parámetros de validación. Cartas de control. Acreditación ISO 17025. Aseguramiento de la calidad analítica.', 50, 150),
    ]),
  C('Química Industrial y Seguridad', 'quimica-industrial',
    'Curso de cierre. Integra todos los conocimientos previos en procesos industriales, gestión de calidad, seguridad laboral y normativa.',
    'advanced', 22,
    ['Comprender procesos de separación industrial', 'Gestionar riesgos en laboratorios', 'Aplicar normativas de seguridad', 'Desarrollar un proyecto industrial integrador'],
    [
      M('Introducción a la Ingeniería Química', 'intro-ingenieria-quimica', 'Balances de materia y energía. Diagramas de flujo. Escalado de procesos. Variables de proceso.', 45, 140),
      M('Operaciones Unitarias de Separación', 'operaciones-unitarias', 'Destilación, extracción, absorción, adsorción, secado, cristalización, filtración industrial. Aplicaciones.', 50, 150),
      M('Reactores Químicos', 'reactores-quimicos', 'Reactores batch, CSTR y flujo pistón. Balance de masa y energía. Selectividad y conversión. Reactores catalíticos.', 50, 150),
      M('Petroquímica y Energía', 'petroquimica-energia', 'Refinación, craqueo, reformado. Petroquímica básica. Biocombustibles. Hidrógeno como combustible del futuro.', 45, 140),
      M('Industria Farmacéutica y Alimentaria', 'industria-farmaceutica-alimentaria', 'GMP, síntesis de fármacos, control de calidad, aditivos, análisis de alimentos. Regulaciones.', 45, 140),
      M('Gestión de Residuos y Economía Circular', 'gestion-residuos', 'Clasificación, tratamiento, reciclaje químico, economía circular, minimización. Sostenibilidad.', 40, 130),
      M('Seguridad en Laboratorios Químicos', 'seguridad-laboratorios', 'NFPA 704, SDS, EPP, almacenamiento, emergencias. Cultura de seguridad. Prevención de accidentes.', 40, 130),
      M('Normativa y Legislación Química', 'normativa-legislacion', 'REACH, OSHA, NOM. Transporte de peligrosos. ISO 14001 y 45001. Cumplimiento normativo.', 40, 130),
      M('Control de Calidad Industrial', 'calidad-industrial', 'ISO 9001, control estadístico, auditorías, mejora continua, Seis Sigma. Calidad total.', 40, 130),
      M('Proyecto Final: Planta Química', 'proyecto-final-planta', 'Diseño conceptual de planta química. Balance de materia, DFP, equipos, impacto ambiental, seguridad.', 80, 250),
    ]),
];

// === Helper factories (keep minimal for module metadata only) ===
function M(title, slug, desc, mins, xp) {
  return { title, slug, desc, mins, xp };
}

function C(t, s, d, diff, hrs, objs, mods) {
  return {
    title: t, slug: s, description: d, difficulty: diff,
    category: 'Química', duration_hours: hrs, order_index: 0,
    objectives: objs, competencies: [],
    modules: mods, finalExamQuestions: [],
  };
}

// ===== SEED EXECUTION =====
async function seedCourses() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado');

    for (let ci = 0; ci < COURSES_DATA.length; ci++) {
      const cd = COURSES_DATA[ci];
      const [course] = await Course.findOrCreate({ where: { slug: cd.slug }, defaults: cd });
      console.log(`✓ ${course.title} (${cd.modules.length} módulos, generator ${ci})`);

      for (let mi = 0; mi < cd.modules.length; mi++) {
        const md = cd.modules[mi];
        const prevTitle = mi > 0 ? cd.modules[mi - 1].title : null;
        const nextTitle = mi < cd.modules.length - 1 ? cd.modules[mi + 1].title : null;

        const { lessons, summary, curiosities } = generateModuleContent(md, mi, prevTitle, nextTitle, ci);

        const [mod] = await Module.findOrCreate({
          where: { slug: md.slug },
          defaults: {
            course_id: course.id, title: md.title, slug: md.slug,
            description: md.desc,
            difficulty: mi < 3 ? 'beginner' : mi < 7 ? 'intermediate' : 'advanced',
            category: 'Química', duration_minutes: md.mins, order_index: mi + 1,
            xp_reward: md.xp || 100,
            content: {
              objectives: [
                `Comprender los principios fundamentales de ${md.title}`,
                `Analizar las aplicaciones prácticas de ${md.title}`,
                `Resolver problemas relacionados con ${md.title}`,
                `Evaluar la importancia de ${md.title} en contextos reales`,
                `Desarrollar pensamiento crítico en el estudio de ${md.title}`,
              ],
              prerequisites: prevTitle ? [prevTitle] : ['Ninguno'],
            },
            summary, curiosities,
          },
        });

        const existing = await Lesson.findAll({ where: { module_id: mod.id } });
        if (existing.length > 0) {
          await Lesson.destroy({ where: { module_id: mod.id } });
          console.log(`  ↻ ${md.title} — ${existing.length} lecciones reemplazadas`);
        }

        const lessonData = lessons.map((l, li) => ({
          module_id: mod.id,
          title: l.t,
          slug: l.s,
          order_index: li + 1,
          content_blocks: l.blocks,
          is_published: true,
        }));

        await Lesson.bulkCreate(lessonData, { ignoreDuplicates: true });
        console.log(`  ✓ ${md.title} — ${lessons.length} lecciones creadas`);

        // Module assessment: 10 questions
        const [ass] = await Assessment.findOrCreate({
          where: { module_id: mod.id, type: 'graded_practice' },
          defaults: {
            module_id: mod.id, title: `Práctica: ${md.title}`,
            type: 'graded_practice', passing_score: 70,
            max_attempts: 3, question_count: 10, random_order: true,
          },
        });
        const existingQ = await QuestionBank.count({ where: { assessment_id: ass.id } });
        if (existingQ === 0) {
          const qs = [];
          for (let qi = 0; qi < 10; qi++) {
            qs.push({
              assessment_id: ass.id,
              text: `Pregunta ${qi + 1} sobre ${md.title}: ¿Cuál de las siguientes afirmaciones es correcta?`,
              type: 'multiple_choice',
              options: [
                { id: 'a', text: 'Opción correcta', is_correct: true },
                { id: 'b', text: 'Opción incorrecta', is_correct: false },
                { id: 'c', text: 'Opción incorrecta', is_correct: false },
              ],
              explanation: `Explicación de la pregunta ${qi + 1} del módulo ${md.title}.`,
              difficulty: qi < 4 ? 'easy' : qi < 8 ? 'medium' : 'hard',
              tags: [md.slug], xp_reward: 10, order_index: qi,
            });
          }
          await QuestionBank.bulkCreate(qs);
        }
      }

      // Course final exam
      const [fe] = await Assessment.findOrCreate({
        where: { course_id: course.id, type: 'final_exam' },
        defaults: {
          course_id: course.id, title: `Examen Final: ${cd.title}`,
          type: 'final_exam', passing_score: 70, max_attempts: 1,
          time_limit_minutes: 60, question_count: 10, random_order: true,
        },
      });
      const feq = await QuestionBank.count({ where: { assessment_id: fe.id } });
      if (feq === 0) {
        const qs = [];
        for (let qi = 0; qi < 10; qi++) {
          qs.push({
            assessment_id: fe.id,
            text: `Pregunta ${qi + 1} del examen final de ${cd.title}: Selecciona la respuesta correcta.`,
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Correcta', is_correct: true },
              { id: 'b', text: 'Incorrecta', is_correct: false },
              { id: 'c', text: 'Incorrecta', is_correct: false },
            ],
            explanation: `Explicación de la pregunta ${qi + 1}.`,
            difficulty: qi < 4 ? 'easy' : qi < 8 ? 'medium' : 'hard',
            tags: ['final', cd.slug], xp_reward: 15, order_index: qi,
          });
        }
        await QuestionBank.bulkCreate(qs);
      }
    }

    console.log('✓ Seed curricular completado: 5 cursos, 50 módulos, ~350 lecciones');
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err);
    process.exit(1);
  }
}

seedCourses();
