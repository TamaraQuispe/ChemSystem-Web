require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Course, Module, Lesson, Assessment, QuestionBank } = require('../models');

function q(text, correct, opts, explanation) {
  return { text, options: opts.map((o, i) => ({ id: String.fromCharCode(97 + i), text: o, is_correct: i === correct })), explanation };
}

const C = (t, s, d, diff, hours, objectives, comps, modules, finalExams) => ({ title: t, slug: s, description: d, difficulty: diff, category: 'Química', duration_hours: hours, order_index: 0, objectives, competencies: comps, modules: modules, finalExamQuestions: finalExams });

const L = (t, s, ...blocks) => ({ t, s, blocks });
const TX = (content) => ({ type: 'text', data: { content, format: 'markdown' } });
const HL = (text, variant = 'info') => ({ type: 'highlight', data: { text, variant } });
const Q = (text, correct, opts, explanation) => ({ text, options: opts.map((o, i) => ({ id: String.fromCharCode(97 + i), text: o, is_correct: i === correct })), explanation, feedbackCorrect: '¡Correcto! ' + explanation, feedbackIncorrect: 'Incorrecto. ' + explanation });
const M = (title, slug, desc, mins, xp, lessons, questions, summary, curiosities) => ({ title, slug, desc, mins, xp, lessons, questions: questions || [Q('¿Comprendes el concepto?', 0, ['Sí', 'No'], 'El conocimiento se construye paso a paso.')], summary: summary || { concepts: [desc], formulas: [], commonMistakes: [], applications: [] }, curiosities: curiosities || [{ title: 'Dato curioso', content: 'La química transforma nuestra vida diaria.', type: 'data' }] });

const COURSES_DATA = [
  C('Fundamentos de Química', 'fundamentos-quimica', 'Curso introductorio que cubre los conceptos fundamentales de la química: materia, átomos, elementos, enlaces y reacciones.', 'beginner', 12,
    ['Comprender la naturaleza de la materia', 'Identificar los estados de agregación', 'Diferenciar entre elementos, compuestos y mezclas'],
    ['Pensamiento analítico', 'Observación científica'],
    [
      M('La Materia y sus Propiedades', 'materia-propiedades', 'Concepto de materia, masa, volumen, densidad.', 25, 100,
        [L('¿Qué es la Materia?', 'que-es-materia', TX('## ¿Qué es la Materia?\n\nLa materia es todo aquello que tiene masa y ocupa un lugar en el espacio. Sus propiedades generales son masa, volumen, densidad e impenetrabilidad.\n\n**Clasificación de la materia:**\n- **Sustancias puras**: elementos y compuestos\n- **Mezclas**: homogéneas y heterogéneas'), HL('La densidad del agua es 1 g/mL a 4°C.')), L('Propiedades Físicas y Químicas', 'propiedades-fisicas-quim', TX('## Propiedades Físicas y Químicas\n\n**Propiedades físicas:** color, olor, punto de fusión, densidad.\n**Propiedades químicas:** reactividad, combustibilidad, oxidación.\n\n**Cambios físicos:** no alteran la composición (cambio de estado).\n**Cambios químicos:** alteran la composición (combustión).'))],
        [Q('¿Qué propiedad se define como masa/volumen?', 1, ['Masa', 'Densidad', 'Volumen'], 'La densidad es masa/volumen.'),
         Q('¿La oxidación del hierro es un cambio?', 1, ['Físico', 'Químico', 'Nuclear'], 'La oxidación forma una nueva sustancia.'),
         Q('¿Unidad SI para cantidad de sustancia?', 1, ['Gramo', 'Mol', 'Kelvin'], 'El mol es la unidad de cantidad de sustancia.')]),
      M('Estados de Agregación', 'estados-agregacion', 'Sólido, líquido, gas y cambios de fase.', 30, 100,
        [L('Los Estados de la Materia', 'estados-materia', TX('## Estados de la Materia\n\n**Sólido:** forma y volumen fijos. Partículas vibran en posiciones fijas.\n**Líquido:** volumen fijo, forma variable. Partículas se deslizan.\n**Gas:** forma y volumen variables. Partículas se mueven libremente.\n\n**Cambios de fase:**\n- Fusión: sólido → líquido\n- Vaporización: líquido → gas\n- Condensación: gas → líquido\n- Solidificación: líquido → sólido\n- Sublimación: sólido → gas'), HL('El agua es la única sustancia que existe naturalmente en los tres estados en la Tierra.'))],
        [Q('¿Cómo se llama el cambio de líquido a gas?', 1, ['Fusión', 'Vaporización', 'Sublimación'], 'Vaporización incluye evaporación y ebullición.'),
         Q('¿En qué estado las partículas tienen mayor libertad?', 2, ['Sólido', 'Líquido', 'Gas'], 'En gas las partículas se mueven libremente.')]),
      M('Mezclas y Sustancias Puras', 'mezclas-sustancias', 'Clasificación de la materia y métodos de separación.', 30, 100,
        [L('Tipos de Mezclas', 'tipos-mezclas', TX('## Mezclas\n\n**Homogéneas:** composición uniforme (agua salada, aire).\n**Heterogéneas:** composición no uniforme (granito, ensalada).\n\n**Métodos de separación:**\n- Filtración: sólido + líquido\n- Destilación: líquidos con diferente punto de ebullición\n- Cristalización: sólido disuelto\n- Imantación: separar metales')), L('Sustancias Puras', 'sustancias-puras', TX('## Sustancias Puras\n\n**Elementos:** formados por un solo tipo de átomo (O₂, Fe, Au).\n**Compuestos:** formados por dos o más elementos (H₂O, CO₂, NaCl).\n\nUn compuesto tiene propiedades diferentes a los elementos que lo forman. El NaCl (sal) es un sólido cristalino, mientras que el Na es un metal reactivo y el Cl₂ es un gas tóxico.'))],
        [Q('¿El agua de mar es una mezcla?', 0, ['Homogénea', 'Heterogénea', 'Compuesto'], 'El agua de mar es una mezcla homogénea de agua y sales.'),
         Q('¿La destilación separa basándose en?', 1, ['Densidad', 'Punto de ebullición', 'Masa'], 'La destilación separa por diferencia en puntos de ebullición.')]),
    ]),
  C('Química General', 'quimica-general', 'Curso completo de química general: estructura atómica, tabla periódica, enlaces, gases, soluciones y equilibrio.', 'beginner', 15,
    ['Comprender la estructura atómica', 'Analizar la tabla periódica', 'Identificar tipos de enlaces'],
    ['Razonamiento lógico', 'Análisis de datos'],
    [
      M('Estructura Atómica', 'estructura-atomica', 'Partículas subatómicas, número atómico y masa atómica.', 30, 110,
        [L('Partículas Subatómicas', 'particulas-sub', TX('## Partículas Subatómicas\n\n**Protón (p⁺):** carga +1, masa 1 uma, en el núcleo.\n**Neutrón (n⁰):** carga 0, masa 1 uma, en el núcleo.\n**Electrón (e⁻):** carga -1, masa 1/1836 uma, en la nube electrónica.\n\nEl número de protones define el elemento químico (número atómico Z). La suma de protones y neutrones da la masa atómica A.\n\n**Isótopos:** átomos del mismo elemento con diferente número de neutrones.')), L('Nube Electrónica', 'nube-electronica', TX('## Nube Electrónica\n\nLos electrones se organizan en niveles de energía (capas). Cada nivel puede contener un número máximo de electrones: 2, 8, 18, 32.\n\nLos **orbitales** son regiones de probabilidad donde se encuentran los electrones:\n- s: esférico (máx 2 e⁻)\n- p: lóbulo (máx 6 e⁻)\n- d: máx 10 e⁻\n- f: máx 14 e⁻'))],
        [Q('¿Qué partícula tiene carga positiva?', 0, ['Protón', 'Neutrón', 'Electrón'], 'El protón tiene carga +1.'),
         Q('Z=6, A=12, ¿cuántos neutrones?', 1, ['6', '6', '8'], 'N = A - Z = 12 - 6 = 6 neutrones.'),
         Q('¿Los isótopos varían en?', 1, ['Protones', 'Neutrones', 'Electrones'], 'Los isótopos difieren en el número de neutrones.')]),
      M('Configuración Electrónica', 'configuracion-electronica', 'Distribución de electrones en niveles y orbitales.', 35, 120,
        [L('Principio de Aufbau', 'principio-aufbau', TX('## Principio de Aufbau\n\nLos electrones llenan primero los orbitales de menor energía. Diagrama de Moeller: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s...\n\n**Regla de Hund:** los electrones ocupan orbitales del mismo subnivel de manera que maximicen el espín paralelo.\n\n**Principio de exclusión de Pauli:** cada orbital puede contener máximo 2 electrones con espines opuestos.')),
         L('Configuración de Elementos', 'config-elementos', TX('## Ejemplos\n\nH (Z=1): 1s¹\nHe (Z=2): 1s²\nC (Z=6): 1s² 2s² 2p²\nNa (Z=11): 1s² 2s² 2p⁶ 3s¹\nFe (Z=26): 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶'))],
        [Q('¿Cuántos electrones caben en un orbital s?', 1, ['1', '2', '6'], 'Cada orbital s contiene máximo 2 electrones.')]),
      M('Tabla Periódica', 'tabla-periodica', 'Organización de elementos y propiedades periódicas.', 35, 120,
        [L('Grupos y Periodos', 'grupos-periodos', TX('## Tabla Periódica\n\n**Grupos (columnas):** 18 grupos. Elementos del mismo grupo tienen propiedades químicas similares.\n**Periodos (filas):** 7 periodos. Cada periodo corresponde a un nivel de energía.\n\n**Metales:** izquierda y centro. Buenos conductores, brillantes, dúctiles.\n**No metales:** derecha. Malos conductores.\n**Metaloides:** frontera entre metales y no metales (Si, Ge, As).\n\n**Propiedades periódicas:** radio atómico, energía de ionización, electronegatividad.')), L('Electronegatividad', 'electronegatividad', TX('## Electronegatividad\n\nCapacidad de un átomo para atraer electrones en un enlace. Escala de Pauling:\n- F (4.0) > O (3.5) > Cl (3.0) > N (3.0)\n\nAumenta hacia arriba y la derecha en la tabla periódica. El flúor es el elemento más electronegativo.'))],
        [Q('¿El flúor tiene la electronegatividad más?', 1, ['Baja', 'Alta', 'Media'], 'El flúor tiene la máxima electronegatividad (4.0).')]),
    ]),
  C('Química Orgánica', 'quimica-organica', 'Estudio de los compuestos del carbono: hidrocarburos, grupos funcionales y polímeros.', 'intermediate', 18,
    ['Comprender la versatilidad del carbono', 'Identificar grupos funcionales', 'Nombrar compuestos orgánicos según IUPAC'],
    ['Pensamiento sistémico', 'Clasificación molecular'],
    [
      M('Introducción a la Química Orgánica', 'intro-organica', 'El carbono y la versatilidad de sus compuestos.', 30, 110,
        [L('El Átomo de Carbono', 'atomo-carbono', TX('## El Carbono\n\nEl carbono (Z=6) tiene 4 electrones de valencia, lo que le permite formar 4 enlaces covalentes. Puede unirse consigo mismo formando cadenas largas (cateneo).\n\n**Tipos de carbono según su entorno:**\n- Primario: unido a 1 carbono\n- Secundario: unido a 2 carbonos\n- Terciario: unido a 3 carbonos\n- Cuaternario: unido a 4 carbonos\n\n**Hibridación:**\n- sp³: 4 enlaces simples (tetraédrico)\n- sp²: 1 doble enlace (trigonal plana)\n- sp: 1 triple enlace (lineal)')), L('Fórmulas Moleculares', 'formulas-moleculares', TX('## Representación\n\n**Fórmula molecular:** C₆H₁₂O₆ (glucosa)\n**Fórmula semidesarrollada:** CH₃-CH₂-OH (etanol)\n**Fórmula desarrollada:** muestra todos los enlaces\n**Fórmula esqueletal:** solo el esqueleto carbonado'))],
        [Q('¿Cuántos enlaces forma el carbono?', 2, ['2', '3', '4'], 'El carbono tiene 4 electrones de valencia, forma 4 enlaces.')]),
    ]),
  C('Química Analítica', 'quimica-analitica', 'Técnicas de análisis químico: gravimetría, volumetría, espectroscopía y cromatografía.', 'advanced', 20,
    ['Aplicar técnicas de análisis cuantitativo', 'Interpretar resultados analíticos', 'Validar métodos de laboratorio'],
    ['Precisión', 'Análisis crítico', 'Gestión de calidad'],
    [
      M('Introducción al Análisis Químico', 'intro-analitica', 'Principios del análisis químico cualitativo y cuantitativo.', 30, 110,
        [L('Análisis Cualitativo vs Cuantitativo', 'analisis-cuali-cuant', TX('## Análisis Químico\n\n**Análisis cualitativo:** identifica qué sustancias están presentes.\n**Análisis cuantitativo:** determina la cantidad de cada sustancia.\n\n**Etapas del análisis:**\n1. Toma de muestra\n2. Preparación de la muestra\n3. Medición\n4. Tratamiento de datos\n5. Interpretación de resultados\n\n**Precisión:** cercanía entre mediciones repetidas.\n**Exactitud:** cercanía al valor verdadero.')), L('Errores en el Análisis', 'errores-analisis', TX('## Errores\n\n**Sistemáticos:** afectan la exactitud (calibración incorrecta).\n**Aleatorios:** afectan la precisión (variaciones del operador).\n\n**Límite de detección (LOD):** concentración mínima detectable.\n**Límite de cuantificación (LOQ):** concentración mínima cuantificable.'))],
        [Q('¿Qué tipo de análisis identifica sustancias?', 0, ['Cualitativo', 'Cuantitativo', 'Estructural'], 'El análisis cualitativo identifica qué sustancias hay.')]),
    ]),
  C('Química Industrial y Seguridad', 'quimica-industrial', 'Procesos industriales, reactores, gestión de residuos y seguridad en laboratorios.', 'advanced', 22,
    ['Comprender procesos industriales químicos', 'Aplicar normas de seguridad', 'Gestionar residuos químicos'],
    ['Gestión de riesgos', 'Responsabilidad ambiental'],
    [
      M('Introducción a la Química Industrial', 'intro-industrial', 'Principios de la industria química y su impacto.', 30, 110,
        [L('La Industria Química', 'industria-quimica', TX('## Industria Química\n\nTransforma materias primas en productos de valor. Sectores principales:\n- Petroquímica\n- Farmacéutica\n- Alimentaria\n- Polímeros\n- Agroquímica\n\n**Indicadores clave:** rendimiento, selectividad, conversión.\n**Eficiencia energética:** relación entre energía útil y energía consumida.'), HL('Un proceso que funciona a escala laboratorio puede fallar al escalarlo por problemas de transferencia de calor.', 'warning')), L('Escalado de Procesos', 'escalado-procesos', TX('## Escalado\n\n**Escala laboratorio:** gramos, condiciones controladas.\n**Planta piloto:** kilogramos, prueba de proceso.\n**Escala industrial:** toneladas, producción continua.\n\nFactores críticos al escalar: transferencia de calor, mezclado, seguridad.'))],
        [Q('¿Qué sector transforma petróleo en combustibles?', 0, ['Petroquímica', 'Farmacéutica', 'Alimentaria'], 'La petroquímica transforma petróleo en derivados.')]),
    ]),
];

async function seedCourses() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión establecida');

    for (const courseData of COURSES_DATA) {
      const { modules: modulesData, finalExamQuestions, ...courseFields } = courseData;

      const [course] = await Course.findOrCreate({
        where: { slug: courseData.slug },
        defaults: courseFields,
      });
      console.log(`✓ Curso: ${course.title}`);

      for (let mi = 0; mi < modulesData.length; mi++) {
        const md = modulesData[mi];
        const [mod] = await Module.findOrCreate({
          where: { slug: md.slug },
          defaults: {
            course_id: course.id, title: md.title, slug: md.slug, description: md.desc,
            difficulty: 'beginner', category: courseData.category, duration_minutes: md.mins || 30,
            order_index: mi + 1, xp_reward: md.xp || 100,
            content: { objectives: [md.desc], prerequisites: [] },
            summary: md.summary || { concepts: [], formulas: [], commonMistakes: [], applications: [] },
            curiosities: md.curiosities || [],
          },
        });

        for (let li = 0; li < (md.lessons || []).length; li++) {
          const l = md.lessons[li];
          await Lesson.findOrCreate({
            where: { module_id: mod.id, slug: l.s },
            defaults: { module_id: mod.id, title: l.t, slug: l.s, order_index: li + 1, content_blocks: l.blocks },
          });
        }

        if (md.questions && md.questions.length > 0) {
          const [ass] = await Assessment.findOrCreate({
            where: { module_id: mod.id, type: 'graded_practice' },
            defaults: {
              module_id: mod.id, title: `Práctica: ${md.title}`,
              type: 'graded_practice', passing_score: 70, max_attempts: 3,
              question_count: md.questions.length, random_order: true, is_published: true,
            },
          });

          for (let qi = 0; qi < md.questions.length; qi++) {
            const q = md.questions[qi];
            const existing = await QuestionBank.findOne({ where: { assessment_id: ass.id, text: q.text.substring(0, 100) } });
            if (!existing) {
              await QuestionBank.create({
                assessment_id: ass.id, text: q.text, type: 'multiple_choice',
                options: q.options || [
                  { id: 'a', text: 'Opción A', is_correct: true },
                  { id: 'b', text: 'Opción B', is_correct: false },
                  { id: 'c', text: 'Opción C', is_correct: false },
                ],
                explanation: q.explanation || '', difficulty: q.difficulty || 'medium',
                feedback_correct: q.feedbackCorrect || '¡Correcto!', feedback_incorrect: q.feedbackIncorrect || 'Incorrecto.',
                tags: [md.slug], xp_reward: 10, order_index: qi,
              });
            }
          }
        }
      }

      // Final exam
      if (finalExamQuestions && finalExamQuestions.length > 0) {
        const [fe] = await Assessment.findOrCreate({
          where: { course_id: course.id, type: 'final_exam' },
          defaults: {
            course_id: course.id, title: `Examen Final: ${courseData.title}`,
            type: 'final_exam', passing_score: 70, max_attempts: 1,
            time_limit_minutes: 60, question_count: finalExamQuestions.length,
            random_order: true, is_published: true,
          },
        });
        for (let qi = 0; qi < finalExamQuestions.length; qi++) {
          const q = finalExamQuestions[qi];
          const existing = await QuestionBank.findOne({ where: { assessment_id: fe.id, text: q.text.substring(0, 100) } });
          if (!existing) {
            await QuestionBank.create({
              assessment_id: fe.id, text: q.text, type: 'multiple_choice',
              options: q.options || [
                { id: 'a', text: 'Opción A', is_correct: true },
                { id: 'b', text: 'Opción B', is_correct: false },
                { id: 'c', text: 'Opción C', is_correct: false },
              ],
              explanation: q.explanation || '', difficulty: q.difficulty || 'medium',
              tags: ['final-exam', courseData.slug], xp_reward: 15, order_index: qi,
            });
          }
        }
      }
    }

    console.log('✓ Seed de cursos completado');
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err);
    process.exit(1);
  }
}

seedCourses();
