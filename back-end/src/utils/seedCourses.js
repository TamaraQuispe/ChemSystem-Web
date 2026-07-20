require('dotenv').config();
const { sequelize, Course, Module, Lesson, Assessment, QuestionBank } = require('../models');

// ===== HELPERS =====
const L = (t, s, ...blocks) => ({ t, s, blocks });
const TX = (content) => ({ type: 'text', data: { content, format: 'markdown' } });
const HL = (text, variant = 'info') => ({ type: 'highlight', data: { text, variant } });

const generateQuestions = (topic, count = 10) => {
  const templates = [
    { q: `¿Cuál es el concepto principal de "${topic}"?`, o: [`Definición de ${topic}`, 'Un concepto no relacionado', 'Una idea opuesta'], c: 0, e: `${topic} es el concepto central de este módulo.` },
    { q: `¿Qué caracteriza a ${topic}?`, o: ['Sus propiedades específicas', 'Su inexistencia', 'Su irrelevancia'], c: 0, e: `${topic} se caracteriza por sus propiedades particulares.` },
    { q: `¿Dónde se aplica ${topic}?`, o: ['En la industria y laboratorio', 'Solo en teoría', 'En ninguna parte'], c: 0, e: `${topic} tiene aplicaciones prácticas en diversos campos.` },
    { q: `¿Qué relación tiene ${topic} con la química?`, o: ['Es fundamental para entender procesos', 'No tiene relación', 'Es irrelevante'], c: 0, e: `${topic} es parte fundamental del estudio de la química.` },
    { q: `¿Cuál es un error común sobre ${topic}?`, o: ['Confundir sus propiedades', 'No tiene errores comunes', 'Es demasiado simple'], c: 0, e: 'Es común confundir las propiedades específicas de cada concepto.' },
    { q: `¿Cómo se diferencia ${topic} de conceptos similares?`, o: ['Por sus características únicas', 'No se diferencia', 'Son idénticos'], c: 0, e: `${topic} se distingue por sus características particulares.` },
    { q: `¿Por qué es importante estudiar ${topic}?`, o: ['Porque explica fenómenos reales', 'No es importante', 'Solo por aprobar exámenes'], c: 0, e: 'Comprender este concepto permite explicar fenómenos químicos cotidianos.' },
    { q: `¿Qué precauciones se deben tomar al trabajar con ${topic}?`, o: ['Seguir protocolos de seguridad', 'Ninguna', 'Trabajar sin supervisión'], c: 0, e: 'Siempre se deben seguir los protocolos de seguridad establecidos.' },
    { q: `¿Cómo contribuye ${topic} al avance científico?`, o: ['Permite nuevos descubrimientos', 'No contribuye', 'Es irrelevante'], c: 0, e: `${topic} sienta las bases para nuevos descubrimientos en química.` },
    { q: `¿Qué habilidad desarrolla el estudio de ${topic}?`, o: ['Pensamiento analítico', 'Memorización', 'Ninguna'], c: 0, e: 'El estudio de este tema desarrolla el pensamiento analítico y crítico.' },
  ];
  return templates.slice(0, count).map((t, i) => ({
    text: t.q, options: t.o.map((o, j) => ({ id: String.fromCharCode(97 + j), text: o, is_correct: j === t.c })),
    explanation: t.e, difficulty: i < 4 ? 'easy' : i < 8 ? 'medium' : 'hard',
    feedbackCorrect: `¡Correcto! ${t.e}`, feedbackIncorrect: `Incorrecto. ${t.e}`,
  }));
};

const genObjectives = (title) => [
  `Comprender el concepto de ${title.toLowerCase()}`,
  `Identificar las propiedades y características de ${title.toLowerCase()}`,
  `Analizar las aplicaciones prácticas de ${title.toLowerCase()}`,
  `Resolver problemas relacionados con ${title.toLowerCase()}`,
  `Evaluar la importancia de ${title.toLowerCase()} en contextos reales`,
];

const genKeyConcepts = (title) => [
  title, `Propiedades de ${title}`, `Aplicaciones de ${title}`,
  `Relación de ${title} con otras áreas`, `Importancia de ${title}`,
];

const genExamples = (title) => [
  `**Ejemplo 1:** Aplicación de ${title} en el laboratorio. Se realiza un experimento controlado para observar las propiedades características, registrando los resultados obtenidos y comparándolos con valores teóricos.`,
  `**Ejemplo 2:** ${title} en la industria. En un proceso industrial, se aplican los principios de ${title} para optimizar la producción y garantizar la calidad del producto final.`,
  `**Ejemplo 3:** ${title} en la vida cotidiana. Se identifican ejemplos de ${title} en situaciones diarias, analizando cómo los principios químicos explican fenómenos familiares.`,
];

const genCaseStudy = (title) => `**Caso práctico: Aplicación de ${title}**\n\n**Situación:** Un laboratorio requiere implementar un proceso basado en ${title} para resolver un problema específico.\n\n**Procedimiento:**\n1. Identificar los principios de ${title} aplicables al caso.\n2. Diseñar un experimento que permita probar la hipótesis.\n3. Realizar las mediciones necesarias y registrar los datos.\n4. Analizar los resultados y extraer conclusiones.\n5. Elaborar un informe con las recomendaciones.\n\n**Resultados esperados:** Comprensión profunda de cómo ${title} se aplica en contextos reales.`;

const genLab = (title) => `**Laboratorio: Experimentando con ${title}**\n\n**Objetivo:** Observar y analizar las propiedades de ${title} mediante un experimento práctico.\n\n**Materiales:**\n- Material de laboratorio básico (vasos de precipitados, probetas, pipetas)\n- Reactivos necesarios según el tema\n- Equipo de protección (guantes, gafas, bata)\n- Cuaderno de notas\n\n**Procedimiento:**\n1. Reunir todos los materiales y equipos necesarios.\n2. Preparar las muestras según las indicaciones del instructor.\n3. Realizar las mediciones correspondientes.\n4. Registrar todas las observaciones en el cuaderno de notas.\n5. Repetir el experimento para confirmar los resultados.\n6. Limpiar y ordenar el área de trabajo.\n\n**Resultados esperados:** Los estudiantes podrán identificar y medir las propiedades características de ${title}.`;

const genGlossary = (title) => [
  `**${title}:** Concepto central del módulo que define las propiedades y características del tema estudiado.`,
  `**Propiedad:** Característica observable o medible de una sustancia o material.`,
  `**Análisis:** Proceso de examinar detalladamente una muestra o situación para comprender su composición.`,
  `**Medición:** Proceso de determinar la magnitud de una propiedad mediante instrumentos especializados.`,
  `**Laboratorio:** Espacio equipado para realizar experimentos y análisis científicos.`,
  `**Reactivo:** Sustancia utilizada en un experimento para producir una reacción química.`,
  `**Resultado:** Dato u observación obtenido al finalizar un experimento o análisis.`,
  `**Protocolo:** Conjunto de instrucciones estandarizadas para realizar un procedimiento.`,
  `**Calibración:** Ajuste de instrumentos para garantizar mediciones precisas.`,
  `**Control:** Muestra o experimento utilizado como referencia en un análisis comparativo.`,
];

const genCommonMistakes = (title) => [
  `Confundir las propiedades específicas de ${title.toLowerCase()} con conceptos similares.`,
  'No seguir correctamente los protocolos de laboratorio establecidos.',
  'Interpretar erróneamente los resultados obtenidos durante los experimentos.',
  'Omitir los pasos de calibración necesarios para mediciones precisas.',
];

const genSummary = (title) => `En este módulo hemos estudiado ${title}, un concepto fundamental en química. Comenzamos con una introducción a sus propiedades y características principales. Aprendimos a identificar sus aplicaciones en el laboratorio, la industria y la vida cotidiana. Reforzamos el aprendizaje con ejemplos resueltos, un caso práctico y un laboratorio experimental. Finalmente, revisamos los errores más comunes y un glosario de términos clave.`;

const M = (title, slug, desc, mins, xp, extraLessons = [], customQuestions = null, customSummary = null, customCuriosities = null) => {
  const baseLessons = [
    L(`Introducción a ${title}`, `${slug}-intro`, TX(`# ${title}\n\n${desc}\n\nEn este módulo exploraremos los conceptos fundamentales, sus propiedades y aplicaciones prácticas.\n\n**Tiempo estimado:** ${mins} minutos\n**Nivel:** ${xp > 120 ? 'Avanzado' : xp > 110 ? 'Intermedio' : 'Básico'}`)),
    L('Objetivos de Aprendizaje', `${slug}-objetivos`, TX(`## Objetivos\n\nAl finalizar este módulo el estudiante será capaz de:\n\n${genObjectives(title).map(o => `- ${o}`).join('\n')}`)),
    L('Conceptos Clave', `${slug}-conceptos`, TX(`## Conceptos Clave\n\n${genKeyConcepts(title).map(k => `- **${k}**`).join('\n')}\n\nEstos conceptos son fundamentales para comprender el desarrollo del módulo.`)),
  ];

  const contentLessons = extraLessons.length > 0 ? extraLessons : [
    L(`Propiedades de ${title}`, `${slug}-propiedades`, TX(`## Propiedades\n\n${title} se caracteriza por propiedades específicas que lo distinguen de otros conceptos. Estas propiedades pueden ser físicas (observables sin cambiar la composición) o químicas (que implican un cambio en la composición).\n\n**Propiedades físicas:** color, olor, densidad, punto de fusión, punto de ebullición.\n**Propiedades químicas:** reactividad, combustibilidad, estabilidad.`)),
    L(`Aplicaciones de ${title}`, `${slug}-aplicaciones`, TX(`## Aplicaciones\n\n${title} tiene numerosas aplicaciones en diversos campos:\n\n- **Laboratorio:** se utiliza en experimentos y análisis cotidianos.\n- **Industria:** forma parte de procesos productivos y de control de calidad.\n- **Vida cotidiana:** está presente en fenómenos y productos de uso diario.\n- **Medio ambiente:** contribuye a la comprensión de procesos naturales.`)),
  ];

  const examplesLesson = L('Ejemplos Resueltos', `${slug}-ejemplos`, TX(`## Ejemplos Resueltos\n\n${genExamples(title).join('\n\n')}`));
  const caseLesson = L('Caso Práctico', `${slug}-caso`, TX(`## Caso Práctico\n\n${genCaseStudy(title)}`));
  const labLesson = L('Laboratorio', `${slug}-laboratorio`, TX(`## Laboratorio Virtual\n\n${genLab(title)}`));
  const errorsLesson = L('Errores Comunes', `${slug}-errores`, TX(`## Errores Comunes\n\n${genCommonMistakes(title).map(e => `- ${e}`).join('\n')}`));
  const curiositiesLesson = L('Curiosidades', `${slug}-curiosidades`, TX(`## Curiosidades\n\n${(customCuriosities || [{ title: 'Dato interesante', content: `${title} tiene aplicaciones sorprendentes en la vida cotidiana.`, type: 'data' }]).map(c => `- **${c.title}:** ${c.content}`).join('\n')}`));
  const glossaryLesson = L('Glosario', `${slug}-glosario`, TX(`## Glosario\n\n${genGlossary(title).join('\n\n')}`));
  const summaryLesson = L('Resumen del Módulo', `${slug}-resumen`, TX(`## Resumen\n\n${customSummary || genSummary(title)}`));

  const allLessons = [...baseLessons, ...contentLessons, examplesLesson, caseLesson, labLesson, errorsLesson, curiositiesLesson, glossaryLesson, summaryLesson];

  return {
    title, slug, desc, mins, xp,
    lessons: allLessons,
    questions: customQuestions || generateQuestions(title, 10),
    summary: { concepts: genKeyConcepts(title), formulas: [], commonMistakes: genCommonMistakes(title), applications: [desc] },
    curiosities: customCuriosities || [
      { title: 'Sabías que...', content: `${title} es fundamental para entender muchos procesos químicos cotidianos.`, type: 'data' },
      { title: 'Aplicación industrial', content: `${title} se utiliza en procesos industriales para mejorar la eficiencia y calidad.`, type: 'industry' },
    ],
  };
};

const C = (t, s, d, diff, hours, objectives, comps, modules, finalExams) => ({
  title: t, slug: s, description: d, difficulty: diff, category: 'Química', duration_hours: hours, order_index: 0,
  objectives, competencies: comps, modules, finalExamQuestions: finalExams,
});

// ===== COURSE DATA =====
const COURSES_DATA = [
  C('Fundamentos de Química', 'fundamentos-quimica', 'Curso introductorio que cubre los conceptos fundamentales de la química: materia, átomos, elementos y reacciones.', 'beginner', 12,
    ['Comprender la naturaleza de la materia', 'Identificar los estados de agregación', 'Diferenciar entre elementos, compuestos y mezclas'],
    ['Pensamiento analítico', 'Observación científica'],
    [
      M('La Materia y sus Propiedades', 'materia-propiedades', 'Concepto de materia, masa, volumen y densidad, propiedades físicas y químicas.', 25, 100),
      M('Estados de Agregación', 'estados-agregacion', 'Sólido, líquido, gas y plasma. Cambios de estado y diagramas de fase.', 30, 100),
      M('Mezclas y Sustancias Puras', 'mezclas-sustancias', 'Clasificación de la materia. Métodos de separación de mezclas homogéneas y heterogéneas.', 30, 100),
      M('Átomos y Moléculas', 'atomos-moleculas', 'Estructura atómica, moléculas, iones y la teoría atómica de Dalton.', 35, 120),
      M('Elementos y Tabla Periódica', 'elementos-tabla', 'Organización de los elementos, grupos, periodos y propiedades periódicas.', 35, 120),
      M('Enlaces Químicos', 'enlaces-quimicos', 'Enlace iónico, covalente y metálico. Regla del octeto y estructuras de Lewis.', 40, 130),
      M('Reacciones Químicas', 'reacciones-quimicas', 'Tipos de reacciones, ecuaciones químicas y balanceo por tanteo.', 40, 130),
      M('Estequiometría Básica', 'estequiometria-basica', 'Cálculos molares, reactivo limitante, rendimiento teórico y porcentual.', 45, 140),
      M('Estados de Oxidación', 'estados-oxidacion', 'Números de oxidación, reglas para asignarlos y su aplicación en reacciones.', 30, 110),
      M('Nomenclatura Química', 'nomenclatura-quimica', 'Sistemas de nomenclatura: Stock, sistemática y tradicional para compuestos inorgánicos.', 35, 120),
    ]),
  C('Química General', 'quimica-general', 'Curso completo de química general: estructura atómica avanzada, tabla periódica, enlaces, gases, soluciones y equilibrio.', 'beginner', 15,
    ['Comprender la estructura atómica avanzada', 'Analizar propiedades periódicas', 'Identificar tipos de enlaces y fuerzas intermoleculares'],
    ['Razonamiento lógico', 'Análisis de datos', 'Resolución de problemas'],
    [
      M('Estructura Atómica Avanzada', 'estructura-atomica-avanzada', 'Partículas subatómicas, número atómico, masa atómica, isótopos y modelos atómicos.', 30, 110),
      M('Configuración Electrónica', 'configuracion-electronica', 'Distribución de electrones en niveles, subniveles y orbitales. Principio de Aufbau.', 35, 120),
      M('Tabla Periódica y Propiedades', 'tabla-periodica-propiedades', 'Organización periódica, radio atómico, energía de ionización y electronegatividad.', 35, 120),
      M('Enlace Iónico', 'enlace-ionico', 'Formación de compuestos iónicos, redes cristalinas y propiedades de sales.', 40, 120),
      M('Enlace Covalente', 'enlace-covalente', 'Enlace covalente simple, doble y triple. Polaridad de enlace y moléculas.', 40, 130),
      M('Fuerzas Intermoleculares', 'fuerzas-intermoleculares', 'Puentes de hidrógeno, fuerzas de Van der Waals y su efecto en propiedades.', 35, 120),
      M('Gases Ideales', 'gases-ideales', 'Leyes de los gases: Boyle, Charles, Gay-Lussac. Ecuación de estado PV=nRT.', 40, 130),
      M('Soluciones y Concentraciones', 'soluciones-concentraciones', 'Unidades de concentración: molaridad, molalidad, porcentaje y diluciones.', 40, 130),
      M('Equilibrio Químico', 'equilibrio-quimico', 'Principio de Le Chatelier, constante de equilibrio Kc y Kp.', 45, 140),
      M('pH y Ácido-Base', 'ph-acido-base', 'Escala de pH, ácidos y bases fuertes y débiles, indicadores y neutralización.', 40, 130),
    ]),
  C('Química Orgánica', 'quimica-organica', 'Estudio de los compuestos del carbono: hidrocarburos, grupos funcionales, isomería y polímeros.', 'intermediate', 18,
    ['Comprender la versatilidad del carbono', 'Identificar grupos funcionales', 'Nombrar compuestos según IUPAC', 'Analizar reacciones orgánicas'],
    ['Pensamiento sistémico', 'Clasificación molecular', 'Razonamiento espacial'],
    [
      M('Introducción a la Orgánica', 'intro-organica', 'El carbono, hibridación, tipos de carbono y representación de moléculas.', 30, 110),
      M('Alcanos y Cicloalcanos', 'alcanos-cicloalcanos', 'Hidrocarburos saturados, nomenclatura IUPAC, isómeros y propiedades.', 35, 120),
      M('Alquenos y Alquinos', 'alquenos-alquinos', 'Hidrocarburos insaturados, isomería geométrica, reacciones de adición.', 35, 120),
      M('Hidrocarburos Aromáticos', 'hidrocarburos-aromaticos', 'Benceno, aromaticidad, sustitución electrofílica y derivados.', 40, 130),
      M('Grupos Funcionales', 'grupos-funcionales', 'Clasificación, propiedades y reactividad de los principales grupos funcionales.', 40, 130),
      M('Alcoholes y Éteres', 'alcoholes-eteres', 'Propiedades, síntesis y reacciones de alcoholes y éteres.', 35, 120),
      M('Aldehídos y Cetonas', 'aldehidos-cetonas', 'Carbonilos, reacciones de adición nucleofílica y oxidación.', 35, 120),
      M('Ácidos Carboxílicos', 'acidos-carboxilicos', 'Propiedades, derivados de ácido y reacciones de esterificación.', 40, 130),
      M('Aminas y Amidas', 'aminas-amidas', 'Compuestos nitrogenados, basicidad, síntesis y aplicaciones.', 35, 120),
      M('Polímeros', 'polimeros', 'Polimerización por adición y condensación. Propiedades y aplicaciones industriales.', 45, 140),
    ]),
  C('Química Analítica', 'quimica-analitica', 'Técnicas de análisis químico: gravimetría, volumetría, espectroscopía, cromatografía y validación.', 'advanced', 20,
    ['Aplicar técnicas de análisis cuantitativo', 'Interpretar resultados analíticos', 'Validar métodos de laboratorio'],
    ['Precisión', 'Análisis crítico', 'Gestión de calidad', 'Atención al detalle'],
    [
      M('Introducción al Análisis', 'intro-analitica', 'Análisis cualitativo vs cuantitativo. Etapas del proceso analítico y términos fundamentales.', 30, 110),
      M('Técnicas Gravimétricas', 'tecnicas-gravimetricas', 'Análisis por precipitación, volatilización y electrogravimetría. Cálculos.', 40, 130),
      M('Volumetría Ácido-Base', 'volumetria-acido-base', 'Valoraciones, curvas de pH, indicadores y punto de equivalencia.', 40, 130),
      M('Volumetría de Precipitación', 'volumetria-precipitacion', 'Métodos de Mohr, Volhard y Fajans. Aplicaciones en análisis de haluros.', 35, 120),
      M('Potenciometría', 'potenciometria', 'Electrodos, medición de pH, titulaciones potenciométricas y electroquímica.', 35, 120),
      M('Espectroscopía UV-Vis', 'espectroscopia-uv-vis', 'Fundamentos, ley de Beer-Lambert, instrumentación y aplicaciones cuantitativas.', 40, 130),
      M('Cromatografía', 'cromatografia', 'Principios de separación, HPLC, cromatografía de gases y de capa fina.', 40, 130),
      M('Electroforesis', 'electroforesis', 'Separación de especies cargadas, electroforesis capilar y en gel.', 35, 120),
      M('Análisis Térmico', 'analisis-termico', 'Termogravimetría (TGA), calorimetría diferencial (DSC) e interpretación de termogramas.', 35, 120),
      M('Validación de Métodos', 'validacion-metodos', 'Parámetros de validación: precisión, exactitud, LOD, LOQ, linealidad y robustez.', 40, 130),
    ]),
  C('Química Industrial y Seguridad', 'quimica-industrial', 'Procesos industriales, reactores, gestión de residuos, seguridad en laboratorios y normativa.', 'advanced', 22,
    ['Comprender procesos industriales químicos', 'Aplicar normas de seguridad', 'Gestionar residuos químicos', 'Conocer normativa vigente'],
    ['Gestión de riesgos', 'Responsabilidad ambiental', 'Liderazgo en seguridad'],
    [
      M('Introducción a la Industria Química', 'intro-industrial', 'Sectores, indicadores de producción, escalado de procesos e impacto ambiental.', 30, 110),
      M('Procesos de Separación', 'procesos-separacion', 'Destilación, extracción, absorción, adsorción y membranas a escala industrial.', 40, 130),
      M('Reactores Químicos', 'reactores-quimicos', 'Reactores batch, CSTR, de flujo pistón. Balance de materia y energía.', 45, 140),
      M('Industria Petroquímica', 'industria-petroquimica', 'Refinación del petróleo, cracking, reformado y obtención de combustibles.', 40, 130),
      M('Industria de Polímeros', 'industria-polimeros', 'Producción de plásticos, fibras sintéticas, elastómeros y reciclaje.', 35, 120),
      M('Industria Farmacéutica', 'industria-farmaceutica', 'Síntesis de fármacos, GMP, validación de procesos y control de calidad.', 40, 130),
      M('Industria Alimentaria', 'industria-alimentaria', 'Aditivos, conservación, análisis de alimentos y normativa alimentaria.', 35, 120),
      M('Gestión de Residuos', 'gestion-residuos', 'Clasificación, tratamiento, reciclaje químico y economía circular.', 35, 120),
      M('Seguridad en Laboratorios', 'seguridad-laboratorios', 'NORMAS NFPA, Hojas de seguridad (SDS), equipos de protección y respuesta a emergencias.', 40, 130),
      M('Normativa y Regulación', 'normativa-regulacion', 'REACH, OSHA, normas ISO 14001, 45001 y gestión ambiental.', 30, 110),
    ]),
];

// ===== SEED EXECUTION =====
async function seedCourses() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión establecida');
    const LessonModel = Lesson;

    for (const courseData of COURSES_DATA) {
      const { modules: modulesData, ...courseFields } = courseData;

      const [course] = await Course.findOrCreate({ where: { slug: courseData.slug }, defaults: courseFields });
      console.log(`✓ Curso: ${course.title}`);

      for (let mi = 0; mi < modulesData.length; mi++) {
        const md = modulesData[mi];
        const [mod] = await Module.findOrCreate({
          where: { slug: md.slug },
          defaults: {
            course_id: course.id, title: md.title, slug: md.slug, description: md.desc,
            difficulty: md.xp > 120 ? 'intermediate' : 'beginner', category: courseData.category,
            duration_minutes: md.mins || 30, order_index: mi + 1, xp_reward: md.xp || 100,
            content: { objectives: genObjectives(md.title), prerequisites: mi === 0 ? ['Ninguno'] : ['Haber completado el módulo anterior'] },
            summary: md.summary || {}, curiosities: md.curiosities || [],
          },
        });

        // Skip if this module already has lessons (already seeded)
        const existingLessons = await LessonModel.count({ where: { module_id: mod.id } });
        if (existingLessons > 0) {
          process.stdout.write('.');
          continue;
        }
        process.stdout.write(`M${mi + 1}`);

        // Bulk insert lessons
        const lessonData = (md.lessons || []).map((l, li) => ({
          module_id: mod.id, title: l.t, slug: l.s, order_index: li + 1, content_blocks: l.blocks, is_published: true,
        }));
        if (lessonData.length > 0) await LessonModel.bulkCreate(lessonData, { ignoreDuplicates: true });

        // Create graded practice
        const [ass] = await Assessment.findOrCreate({
          where: { module_id: mod.id, type: 'graded_practice' },
          defaults: {
            module_id: mod.id, title: `Práctica: ${md.title}`,
            type: 'graded_practice', passing_score: 70, max_attempts: 3,
            question_count: 10, random_order: true, is_published: true,
          },
        });

        const questions = md.questions && md.questions.length >= 10 ? md.questions : generateQuestions(md.title, 10);
        const qData = [];
        for (let qi = 0; qi < 10 && qi < questions.length; qi++) {
          const q = questions[qi];
          const existingQ = await QuestionBank.findOne({ where: { assessment_id: ass.id, order_index: qi } }).catch(() => null);
          if (!existingQ) {
            qData.push({
              assessment_id: ass.id, text: q.text, type: 'multiple_choice',
              options: q.options || [], explanation: q.explanation || '', difficulty: q.difficulty || 'medium',
              feedback_correct: q.feedbackCorrect || '¡Correcto!', feedback_incorrect: q.feedbackIncorrect || 'Incorrecto.',
              tags: [md.slug], xp_reward: 10, order_index: qi,
            });
          }
        }
        if (qData.length > 0) await QuestionBank.bulkCreate(qData);
      }
      console.log();
    }

    // Final exams (one per course)
    for (const courseData of COURSES_DATA) {
      const course = await Course.findOne({ where: { slug: courseData.slug } });
      if (!course) continue;
      const [fe] = await Assessment.findOrCreate({
        where: { course_id: course.id, type: 'final_exam' },
        defaults: {
          course_id: course.id, title: `Examen Final: ${courseData.title}`,
          type: 'final_exam', passing_score: 70, max_attempts: 1,
          time_limit_minutes: 60, question_count: 10, random_order: true, is_published: true,
        },
      });
      const existingQs = await QuestionBank.count({ where: { assessment_id: fe.id } }).catch(() => 0);
      if (existingQs === 0) {
        const qData = generateQuestions(courseData.title, 10).map((q, qi) => ({
          assessment_id: fe.id, text: q.text, type: 'multiple_choice',
          options: q.options, explanation: q.explanation,
          difficulty: qi < 4 ? 'easy' : qi < 8 ? 'medium' : 'hard',
          tags: ['final-exam', courseData.slug], xp_reward: 15, order_index: qi,
        }));
        await QuestionBank.bulkCreate(qData);
      }
    }

    console.log('\n✓ Seed de cursos completado');
    process.exit(0);
  } catch (err) {
    console.error('\n✗ Error:', err);
    process.exit(1);
  }
}

seedCourses();
