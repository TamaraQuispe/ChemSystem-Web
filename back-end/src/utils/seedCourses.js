require('dotenv').config();
const { sequelize, Course, Module, Lesson, Assessment, QuestionBank } = require('../models');

// ===== Helpers (for boilerplate only - core content is unique per module) =====
const L = (t, s, ...blocks) => ({ t, s, blocks });
const TX = (content) => ({ type: 'text', data: { content, format: 'markdown' } });
const HL = (text, variant = 'info') => ({ type: 'highlight', data: { text, variant } });

const genObjs = (title, count = 5) => {
  const m = [`Definir y explicar el concepto de ${title}`, `Identificar las propiedades fundamentales de ${title}`, `Analizar las aplicaciones de ${title} en contextos reales`, `Resolver problemas prácticos relacionados con ${title}`, `Evaluar la importancia de ${title} dentro de la química`];
  return m.slice(0, count);
};
const genKC = (title) => [title, `Propiedades de ${title}`, `Aplicaciones de ${title}`];
const genCM = (title) => [`Confundir ${title} con conceptos similares`, `Aplicar incorrectamente los principios de ${title}`];
const genGloss = (title) => [`**${title}:** Concepto central del módulo.`, '**Análisis:** Examen detallado de una muestra.', '**Laboratorio:** Espacio para experimentación.', '**Reactivo:** Sustancia para reacciones.', '**Protocolo:** Instrucciones estandarizadas.', '**Calibración:** Ajuste de instrumentos.', '**Control:** Referencia para comparación.', '**Variable:** Factor que puede cambiar.', '**Error:** Diferencia entre valor real y medido.', '**Precisión:** Cercanía entre mediciones.'];

const M = (title, slug, desc, mins, xp, lessons) => ({
  title, slug, desc, mins, xp,
  lessons: lessons || [
    L(`Introducción a ${title}`, `${slug}-intro`, TX(`# ${title}\n\n${desc}`)),
    L('Objetivos', `${slug}-obj`, TX(`## Objetivos\n\n${genObjs(title).map(o => `- ${o}`).join('\n')}`)),
  ],
  summary: { concepts: genKC(title), formulas: [], commonMistakes: genCM(title), applications: [desc] },
  curiosities: [{ title: 'Para saber más', content: `${title} es un tema fundamental en química con numerosas aplicaciones prácticas.`, type: 'data' }],
});

const C = (t, s, d, diff, hrs, objs, mods) => ({ title: t, slug: s, description: d, difficulty: diff, category: 'Química', duration_hours: hrs, order_index: 0, objectives: objs, competencies: [], modules: mods, finalExamQuestions: [] });

// ===== CURRICULUM — 5 courses, 10 modules each, strict pedagogical progression =====
const COURSES_DATA = [
  C('Fundamentos de Química', 'fundamentos-quimica',
    'Curso introductorio. Sienta las bases absolutas: materia, átomos, elementos, enlaces, reacciones y estequiometría. No requiere conocimientos previos.',
    'beginner', 12,
    ['Comprender la naturaleza de la materia', 'Identificar partículas subatómicas', 'Balancear ecuaciones químicas', 'Realizar cálculos estequiométricos'],
    [
      M('Introducción a la Química', 'intro-quimica', '¿Qué es la química? Ramas de la química. El método científico. Importancia en la vida cotidiana. Relación con otras ciencias.', 20, 80),
      M('Materia y sus Propiedades', 'materia-propiedades', 'Concepto de materia. Propiedades físicas y químicas. Cambios de estado. Clasificación de la materia: sustancias puras y mezclas. Métodos de separación.', 30, 100),
      M('Estructura Atómica', 'estructura-atomica', 'Partículas subatómicas: protón, neutrón, electrón. Número atómico y masa atómica. Isótopos. Modelos atómicos de Dalton, Thomson, Rutherford y Bohr.', 35, 110),
      M('Configuración Electrónica y Tabla Periódica', 'configuracion-tabla', 'Distribución electrónica por niveles. Principio de Aufbau. Tabla periódica: grupos, periodos, metales, no metales. Propiedades periódicas.', 40, 120),
      M('Enlaces Químicos', 'enlaces-quimicos', 'Regla del octeto. Enlace iónico: formación de sales. Enlace covalente: moléculas, polaridad. Enlace metálico. Estructuras de Lewis.', 40, 120),
      M('Nomenclatura Inorgánica', 'nomenclatura-inorganica', 'Sistemas Stock, sistemático y tradicional. Óxidos, hidróxidos, ácidos y sales. Compuestos binarios y ternarios.', 35, 110),
      M('Reacciones Químicas', 'reacciones-quimicas', 'Ecuaciones químicas. Balanceo por tanteo. Tipos de reacciones: síntesis, descomposición, desplazamiento, doble desplazamiento, combustión.', 40, 120),
      M('Estequiometría', 'estequiometria', 'Mol y número de Avogadro. Cálculos mol-masa. Reactivo limitante y rendimiento. Relaciones estequiométricas en ecuaciones.', 45, 130),
      M('Gases', 'gases', 'Leyes de Boyle, Charles, Gay-Lussac. Ecuación del gas ideal. Ley de Dalton de presiones parciales. Difusión y efusión.', 35, 110),
      M('Proyecto Integrador: Análisis de una Reacción', 'proyecto-integrador-1', 'Aplicación integrada de estequiometría, gases y balanceo. Resolución de un caso real paso a paso con informe final.', 50, 150),
    ]),
  C('Química General', 'quimica-general',
    'Construye sobre Fundamentos. Abarca termoquímica, cinética, equilibrio, ácido-base, electroquímica y química nuclear. Prepara para Química Orgánica.',
    'intermediate', 15,
    ['Aplicar leyes de los gases', 'Calcular entalpías y energías', 'Determinar velocidades de reacción', 'Analizar equilibrios químicos', 'Identificar procesos electroquímicos'],
    [
      M('Teoría Cinético-Molecular', 'teoria-cinetica-molecular', 'Postulados de la teoría cinética. Relación entre temperatura y energía cinética. Comportamiento de partículas en sólidos, líquidos y gases.', 25, 90),
      M('Termoquímica', 'termoquimica', 'Energía interna, calor y trabajo. Entalpía y cambios entálpicos. Ley de Hess. Calorimetría. Entalpía de formación, combustión y enlace.', 45, 140),
      M('Cinética Química', 'cinetica-quimica', 'Velocidad de reacción. Factores que afectan la velocidad. Ley de velocidad. Orden de reacción. Teoría de colisiones y energía de activación.', 40, 130),
      M('Equilibrio Químico', 'equilibrio-quimico', 'Equilibrio dinámico. Constante de equilibrio Kc y Kp. Principio de Le Chatelier. Factores que afectan el equilibrio. Cálculos de equilibrio.', 45, 140),
      M('Ácidos y Bases', 'acidos-bases', 'Teorías de Arrhenius, Brønsted-Lowry y Lewis. Escala de pH. Ácidos y bases fuertes y débiles. Indicadores. Neutralización y titulación.', 40, 130),
      M('Equilibrio Iónico y Solubilidad', 'equilibrio-ionico', 'Producto de solubilidad Kps. Efecto del ión común. Formación de precipitados. Equilibrios ácido-base en soluciones buffer.', 40, 130),
      M('Electroquímica', 'electroquimica', 'Celdas galvánicas y electrolíticas. Potencial estándar de electrodo. Ecuación de Nernst. Electrólisis. Leyes de Faraday. Corrosión.', 45, 140),
      M('Química Nuclear', 'quimica-nuclear', 'Radiactividad. Tipos de decaimiento. Fisión y fusión nuclear. Cinética de decaimiento radiactivo. Aplicaciones médicas e industriales.', 35, 120),
      M('Química Ambiental', 'quimica-ambiental', 'Contaminación atmosférica. Efecto invernadero. Lluvia ácida. Tratamiento de aguas. Química verde y sostenibilidad.', 30, 100),
      M('Seminario Integrador', 'seminario-integrador-2', 'Estudio de caso multitemático combinando termoquímica, cinética, equilibrio y electroquímica. Exposición y defensa de resultados.', 50, 150),
    ]),
  C('Química Orgánica', 'quimica-organica',
    'Requiere Química General. Desde el átomo de carbono hasta biomoléculas. Hidrocarburos, grupos funcionales, isomería, reacciones orgánicas y polímeros.',
    'advanced', 18,
    ['Comprender la hibridación del carbono', 'Nombrar compuestos según IUPAC', 'Identificar grupos funcionales', 'Predecir productos de reacciones orgánicas'],
    [
      M('El Carbono y los Hidrocarburos', 'carbono-hidrocarburos', 'Configuración electrónica del carbono. Hibridación sp³, sp², sp. Alcanos, alquenos y alquinos. Nomenclatura IUPAC. Propiedades físicas.', 40, 130),
      M('Reacciones de Hidrocarburos', 'reacciones-hidrocarburos', 'Reacciones de alcanos: combustión, halogenación. Reacciones de alquenos: adición electrofílica. Reacciones de alquinos. Mecanismos de reacción.', 40, 130),
      M('Hidrocarburos Aromáticos', 'aromaticos', 'Benceno y aromaticidad. Regla de Hückel. Sustitución electrofílica aromática. Derivados del benceno. Nomenclatura.', 35, 120),
      M('Grupos Funcionales Oxigenados', 'grupos-oxigenados', 'Alcoholes, éteres, aldehídos, cetonas, ácidos carboxílicos y ésteres. Propiedades, nomenclatura y reactividad comparada.', 45, 140),
      M('Grupos Funcionales Nitrogenados', 'grupos-nitrogenados', 'Aminas, amidas, nitrocompuestos. Basicidad de aminas. Reacciones de diazotación. Importancia biológica.', 35, 120),
      M('Isomería', 'isomeria', 'Isomería estructural: cadena, posición, función. Estereoisomería: geométrica (cis-trans) y óptica (quiralidad). Enantiómeros y actividad óptica.', 35, 120),
      M('Reacciones de Grupos Funcionales', 'reacciones-grupos-funcionales', 'Oxidación de alcoholes. Reducción de carbonilos. Esterificación. Saponificación. Reacciones de aminación. Mecanismos comparados.', 40, 130),
      M('Polímeros', 'polimeros-organica', 'Polimerización por adición y condensación. Polietileno, PVC, nailon, poliéster. Propiedades y aplicaciones. Biopolímeros y reciclaje.', 35, 120),
      M('Biomoléculas', 'biomoleculas', 'Carbohidratos: monosacáridos, disacáridos, polisacáridos. Lípidos: ácidos grasos, triglicéridos. Proteínas: aminoácidos, enlace peptídico. ADN.', 45, 140),
      M('Análisis y Síntesis Orgánica', 'sintesis-organica', 'Estrategias de síntesis. Análisis retrosintético. Identificación de compuestos por espectroscopía. Proyecto de síntesis de un compuesto orgánico.', 50, 150),
    ]),
  C('Química Analítica', 'quimica-analitica',
    'Requiere Química General. Enfoque en análisis cuantitativo y cualitativo, instrumentación, tratamiento de datos y validación de métodos.',
    'advanced', 20,
    ['Aplicar técnicas gravimétricas y volumétricas', 'Operar instrumentos espectroscópicos', 'Interpretar cromatogramas', 'Validar métodos analíticos'],
    [
      M('Introducción al Análisis Químico', 'intro-analitica', 'Análisis cualitativo vs cuantitativo. Etapas del proceso analítico. Muestreo y preparación de muestra. Expresión de resultados. Cifras significativas.', 25, 90),
      M('Estadística Aplicada al Análisis', 'estadistica-analitica', 'Medidas de tendencia central y dispersión. Distribución normal. Intervalos de confianza. Pruebas Q y t. Regresión lineal. Límites de detección.', 35, 120),
      M('Gravimetría', 'gravimetria', 'Precipitación y digestión. Filtración, lavado y calcinación. Cálculos gravimétricos. Aplicaciones en análisis de minerales y alimentos.', 40, 130),
      M('Volumetría Ácido-Base', 'volumetria-acido-base', 'Curvas de titulación. Indicadores. Punto de equivalencia. Valoraciones de ácidos fuertes/débiles. Aplicaciones en industria alimentaria.', 40, 130),
      M('Volumetría de Precipitación y Redox', 'volumetria-precipitacion-redox', 'Métodos de Mohr, Volhard y Fajans. Valoraciones redox. Permanganometría. Yodometría. Aplicaciones en control de calidad.', 40, 130),
      M('Espectroscopía Molecular', 'espectroscopia-molecular', 'Espectro electromagnético. Ley de Beer-Lambert. Espectrofotometría UV-Vis. Curvas de calibración. Análisis de mezclas. Aplicaciones farmacéuticas.', 45, 140),
      M('Espectroscopía Atómica', 'espectroscopia-atomica', 'Absorción atómica. Emisión atómica. Plasma ICP. Espectrometría de masas. Análisis de metales traza en medio ambiente.', 40, 130),
      M('Cromatografía', 'cromatografia', 'Fundamentos de separación. Cromatografía de capa fina. HPLC: instrumentación y aplicaciones. Cromatografía de gases. Análisis cualitativo y cuantitativo.', 45, 140),
      M('Técnicas Electroanalíticas', 'tecnicas-electroanaliticas', 'Potenciometría. Electrodos selectivos de iones. Valoraciones potenciométricas. Conductimetría. Amperometría. Aplicaciones clínicas.', 35, 120),
      M('Validación y Control de Calidad', 'validacion-control-calidad', 'Parámetros de validación: precisión, exactitud, LOD, LOQ, linealidad, robustez. Cartas de control. Acreditación de laboratorios. Normas ISO 17025.', 40, 130),
    ]),
  C('Química Industrial y Seguridad', 'quimica-industrial',
    'Curso de cierre. Integra todos los conocimientos previos en procesos industriales, gestión de calidad, seguridad laboral y normativa. Incluye proyecto final.',
    'advanced', 22,
    ['Comprender procesos de separación industrial', 'Gestionar riesgos en laboratorios', 'Aplicar normativas de seguridad', 'Desarrollar un proyecto industrial integrador'],
    [
      M('Introducción a la Ingeniería Química', 'intro-ingenieria-quimica', 'Balances de materia y energía. Diagramas de flujo. Escalado de procesos. Variables de proceso: flujo, temperatura, presión, composición.', 35, 120),
      M('Operaciones Unitarias de Separación', 'operaciones-unitarias', 'Destilación: tipos de columnas. Extracción líquido-líquido. Absorción. Adsorción. Secado. Cristalización. Filtración industrial.', 45, 140),
      M('Reactores Químicos', 'reactores-quimicos', 'Reactores batch, CSTR y de flujo pistón. Balance de masa y energía en reactores. Selectividad y conversión. Reactores catalíticos.', 45, 140),
      M('Petroquímica y Energía', 'petroquimica-energia', 'Refinación del petróleo. Craqueo catalítico. Reformado. Petroquímica básica: olefinas y aromáticos. Biocombustibles. Hidrógeno como combustible.', 40, 130),
      M('Industria Farmacéutica y Alimentaria', 'industria-farmaceutica-alimentaria', 'Buenas prácticas de manufactura (GMP). Síntesis de fármacos. Control de calidad farmacéutico. Aditivos alimentarios. Análisis de alimentos.', 40, 130),
      M('Gestión de Residuos y Economía Circular', 'gestion-residuos', 'Clasificación de residuos químicos. Tratamiento físico-químico y biológico. Reciclaje químico de polímeros. Economía circular. Minimización de residuos.', 35, 120),
      M('Seguridad en Laboratorios Químicos', 'seguridad-laboratorios', 'Normas NFPA 704. Hojas de datos de seguridad (SDS). Equipos de protección. Almacenamiento de reactivos. Gestión de emergencias. Primeros auxilios.', 40, 130),
      M('Normativa y Legislación Química', 'normativa-legislacion', 'REACH (Europa). OSHA (EE.UU.). NOM (México). Reglamento de productos químicos. Transporte de mercancías peligrosas. Normas ISO 14001 y 45001.', 30, 110),
      M('Control de Calidad Industrial', 'calidad-industrial', 'Sistemas de gestión de calidad. Normas ISO 9001. Control estadístico de procesos. Auditorías de calidad. Mejora continua. Seis Sigma.', 35, 120),
      M('Proyecto Final: Planta Química', 'proyecto-final-planta', 'Diseño conceptual de una planta química: selección de proceso, balance de materia, diagrama de flujo, selección de equipos, evaluación de impacto ambiental, plan de seguridad. Presentación final.', 60, 200),
    ]),
];

// ===== SEED EXECUTION =====
async function seedCourses() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado');

    for (const cd of COURSES_DATA) {
      const [course] = await Course.findOrCreate({ where: { slug: cd.slug }, defaults: cd });
      console.log(`✓ ${course.title}`);

      for (let mi = 0; mi < cd.modules.length; mi++) {
        const md = cd.modules[mi];
        const [mod] = await Module.findOrCreate({
          where: { slug: md.slug },
          defaults: {
            course_id: course.id, title: md.title, slug: md.slug, description: md.desc,
            difficulty: mi < 3 ? 'beginner' : mi < 7 ? 'intermediate' : 'advanced',
            category: 'Química', duration_minutes: md.mins, order_index: mi + 1, xp_reward: md.xp || 100,
            content: { objectives: genObjs(md.title), prerequisites: mi === 0 ? ['Ninguno'] : [cd.modules[mi - 1].title] },
            summary: md.summary || {}, curiosities: md.curiosities || [],
          },
        });

        const existing = await Lesson.count({ where: { module_id: mod.id } });
        if (existing > 0) continue;

        const lessonData = (md.lessons || []).map((l, li) => ({
          module_id: mod.id, title: l.t, slug: l.s, order_index: li + 1, content_blocks: l.blocks, is_published: true,
        }));
        if (lessonData.length > 0) await Lesson.bulkCreate(lessonData, { ignoreDuplicates: true });

        // Practice: 10 questions
        const [ass] = await Assessment.findOrCreate({
          where: { module_id: mod.id, type: 'graded_practice' },
          defaults: { module_id: mod.id, title: `Práctica: ${md.title}`, type: 'graded_practice', passing_score: 70, max_attempts: 3, question_count: 10, random_order: true },
        });
        const existingQ = await QuestionBank.count({ where: { assessment_id: ass.id } });
        if (existingQ === 0) {
          const qs = [];
          for (let qi = 0; qi < 10; qi++) {
            qs.push({
              assessment_id: ass.id,
              text: `Pregunta ${qi + 1} sobre ${md.title}: ¿Cuál de las siguientes afirmaciones es correcta?`,
              type: 'multiple_choice',
              options: [{ id: 'a', text: 'Opción correcta', is_correct: true }, { id: 'b', text: 'Opción incorrecta', is_correct: false }, { id: 'c', text: 'Opción incorrecta', is_correct: false }],
              explanation: `Explicación de la pregunta ${qi + 1} del módulo ${md.title}.`,
              difficulty: qi < 4 ? 'easy' : qi < 8 ? 'medium' : 'hard',
              tags: [md.slug], xp_reward: 10, order_index: qi,
            });
          }
          await QuestionBank.bulkCreate(qs);
        }
      }

      // Final exam
      const [fe] = await Assessment.findOrCreate({
        where: { course_id: course.id, type: 'final_exam' },
        defaults: { course_id: course.id, title: `Examen Final: ${cd.title}`, type: 'final_exam', passing_score: 70, max_attempts: 1, time_limit_minutes: 60, question_count: 10, random_order: true },
      });
      const feq = await QuestionBank.count({ where: { assessment_id: fe.id } });
      if (feq === 0) {
        const qs = [];
        for (let qi = 0; qi < 10; qi++) {
          qs.push({
            assessment_id: fe.id, text: `Pregunta ${qi + 1} del examen final de ${cd.title}: Selecciona la respuesta correcta.`,
            type: 'multiple_choice',
            options: [{ id: 'a', text: 'Correcta', is_correct: true }, { id: 'b', text: 'Incorrecta', is_correct: false }, { id: 'c', text: 'Incorrecta', is_correct: false }],
            explanation: `Explicación de la pregunta ${qi + 1}.`, difficulty: qi < 4 ? 'easy' : qi < 8 ? 'medium' : 'hard',
            tags: ['final', cd.slug], xp_reward: 15, order_index: qi,
          });
        }
        await QuestionBank.bulkCreate(qs);
      }
    }
    console.log('✓ Seed curricular completado');
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err);
    process.exit(1);
  }
}

seedCourses();
