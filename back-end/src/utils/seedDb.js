require('dotenv').config();
const bcrypt = require('bcrypt');
const {
  sequelize,
  User,
  Compound,
  Module,
  UserModule,
  Experiment,
  ExperimentCompound,
  Prediction,
  KineticSnapshot,
  AiRecommendation,
  Notification,
  UserAnalytics,
  CommunityPost,
  FamilyRelationship,
  Conversation,
  Message,
  Classroom,
  Enrollment,
  Grade,
  Assignment,
  QuizResult,
  Achievement,
  Course,
  Lesson,
  Assessment,
  QuestionBank,
  AssessmentAttempt,
  CourseProgress,
  Certificate,
} = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✓ Tablas recreadas');

    const passwordHash = await bcrypt.hash('password123', 10);

    const julian = await User.create({
      email: 'julian@chemsystem.edu',
      password_hash: passwordHash,
      name: 'Julian Mendoza',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
      role: 'student',
      level: 14,
      xp: 1250,
    });

    const maria = await User.create({
      email: 'maria@chemsystem.edu',
      password_hash: passwordHash,
      name: 'María García',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      role: 'student',
      level: 12,
      xp: 980,
    });

    const carlos = await User.create({
      email: 'profesor@chemsystem.edu',
      password_hash: passwordHash,
      name: 'Dr. Carlos Ruiz',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      role: 'teacher',
      level: 25,
      xp: 5200,
    });

    await User.create({
      email: 'mariaprof@chemsystem.edu',
      password_hash: passwordHash,
      name: 'Prof. María García',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaT',
      role: 'teacher',
      level: 22,
      xp: 4300,
    });

    const ana = await User.create({
      email: 'padre@chemsystem.edu',
      password_hash: passwordHash,
      name: 'Ana Mendoza',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      role: 'parent',
      level: 8,
      xp: 450,
    });

    // Parent-child relationships
    await FamilyRelationship.bulkCreate([
      { parent_id: ana.id, student_id: julian.id, relationship: 'mother' },
      { parent_id: ana.id, student_id: maria.id, relationship: 'mother' },
    ]);

    const compounds = await Compound.bulkCreate([
      { code: 'H2SO4', name: 'H₂SO₄', label: 'Ácido Sulfúrico', concentration: '98%', color_class: 'text-blue-500 bg-blue-50 border-blue-100', dot_class: 'bg-blue-500', formula: 'H2SO4' },
      { code: 'KMnO4', name: 'KMnO₄', label: 'Permanganato de Potasio', concentration: '0.1 M', color_class: 'text-emerald-500 bg-emerald-50 border-emerald-100', dot_class: 'bg-emerald-500', formula: 'KMnO4' },
      { code: 'NaOH', name: 'NaOH', label: 'Hidróxido de Sodio', concentration: '2.0 M', color_class: 'text-purple-500 bg-purple-50 border-purple-100', dot_class: 'bg-purple-500', formula: 'NaOH' },
      { code: 'H2O', name: 'H₂O', label: 'Agua Destilada', concentration: '1.0 M', color_class: 'text-blue-500 bg-blue-50 border-blue-100', dot_class: 'bg-blue-500', formula: 'H2O' },
      { code: 'O2', name: 'O₂', label: 'Oxígeno Molecular', concentration: 'gas', color_class: 'text-emerald-500 bg-emerald-50 border-emerald-100', dot_class: 'bg-emerald-500', formula: 'O2' },
    ]);

    // Courses
    const course1 = await Course.create({
      title: 'Química General', slug: 'quimica-general',
      description: 'Curso fundamental de química que cubre estructura atómica, enlaces químicos y estados de la materia.',
      category: 'Química', difficulty: 'beginner', duration_hours: 15, order_index: 1,
      objectives: ['Comprender la estructura del átomo', 'Identificar tipos de enlaces químicos', 'Analizar estados de la materia y cambios de fase'],
      competencies: ['Pensamiento analítico', 'Resolución de problemas', 'Comprensión de modelos atómicos'],
    });

    const course2 = await Course.create({
      title: 'Catálisis', slug: 'catalisis',
      description: 'Estudio de los catalizadores, su mecanismo de acción y aplicaciones industriales.',
      category: 'Química', difficulty: 'advanced', duration_hours: 20, order_index: 2,
      objectives: ['Comprender el mecanismo de acción catalítica', 'Identificar tipos de catalizadores', 'Analizar cinética catalítica'],
      competencies: ['Análisis de procesos', 'Pensamiento sistémico', 'Aplicación industrial'],
    });

    const modules = await Module.bulkCreate([
      {
        course_id: course1.id,
        title: 'Estructura del Átomo', description: 'Conoce las partículas subatómicas, el núcleo y la nube electrónica.',
        slug: 'estructura-atomo', difficulty: 'beginner', category: 'Química General', duration_minutes: 25, order_index: 1, xp_reward: 120,
        content: { objectives: ['Identificar las partículas subatómicas y sus propiedades', 'Comprender la estructura del núcleo atómico', 'Diferenciar entre número atómico y masa atómica'], prerequisites: ['Conceptos básicos de materia y elementos'], sections: [
          { id: 's1', title: 'Partículas Subatómicas', content: 'El átomo está compuesto por tres partículas fundamentales:\n\n• **Protón**: carga positiva (+1), masa de 1 unidad de masa atómica (uma). Se encuentra en el núcleo.\n• **Neutrón**: carga neutra (0), masa de 1 uma. También en el núcleo.\n• **Electrón**: carga negativa (-1), masa de aproximadamente 1/1836 uma. En la nube electrónica alrededor del núcleo.\n\nEl número de protones determina el **elemento químico**. Por ejemplo, todo átomo con 6 protones es carbono.', highlight: 'El 99.9% de la masa del átomo está en el núcleo, pero el núcleo ocupa solo 1/10,000 del volumen total del átomo.', question: { text: '¿Qué partícula subatómica tiene carga positiva y se encuentra en el núcleo?', options: ['Electrón', 'Protón', 'Neutrón', 'Fotón'], correctIndex: 1, feedbackCorrect: '¡Correcto! El protón tiene carga +1 y se encuentra en el núcleo atómico.', feedbackIncorrect: 'Incorrecto. El protón (carga +1) está en el núcleo. Los electrones tienen carga -1 y orbitan alrededor.', xpReward: 10 } },
          { id: 's2', title: 'Número Atómico y Masa Atómica', content: '**Número atómico (Z)**: es el número de protones en el núcleo. Identifica al elemento.\n\n**Masa atómica (A)**: es la suma de protones + neutrones.\n\n**Ejemplo**: El carbono tiene Z=6 (6 protones) y A≈12 (6 protones + 6 neutrones).\n\nLos **isótopos** son átomos del mismo elemento con diferente número de neutrones. Por ejemplo, el carbono-14 tiene 8 neutrones en lugar de 6.', highlight: 'El hidrógeno es el único elemento cuyo átomo más común no tiene neutrones: solo 1 protón y 1 electrón.', question: { text: 'Si un átomo tiene Z=11 y A=23, ¿cuántos neutrones tiene?', options: ['11', '12', '23', '34'], correctIndex: 1, feedbackCorrect: '¡Excelente! Neutrones = A − Z = 23 − 11 = 12 neutrones.', feedbackIncorrect: 'Los neutrones se calculan como A − Z. En este caso: 23 − 11 = 12 neutrones.', xpReward: 10 } },
          { id: 's3', title: 'Nube Electrónica y Orbitales', content: 'Los electrones no orbitan en círculos fijos como planetas, sino que se mueven en regiones de probabilidad llamadas **orbitales**.\n\n• Los orbitales tienen formas características: s (esférico), p (lóbulo), d (más complejo).\n• Cada orbital puede contener máximo 2 electrones.\n• Los electrones se organizan en **capas** y **subcapas** según su nivel de energía.\n\nLa **configuración electrónica** describe cómo se distribuyen los electrones en los diferentes orbitales.', highlight: 'El principio de exclusión de Pauli establece que no pueden existir dos electrones con los mismos números cuánticos dentro del mismo átomo.', question: { text: '¿Cuántos electrones puede contener un orbital como máximo?', options: ['1', '2', '6', '8'], correctIndex: 1, feedbackCorrect: '¡Correcto! Cada orbital puede contener máximo 2 electrones con espines opuestos.', feedbackIncorrect: 'Cada orbital alberga máximo 2 electrones. Por ejemplo, el orbital 1s tiene 2 electrones en el helio.', xpReward: 10 } },
        ]},
        finalExam: [
          { text: '¿Qué partícula subatómica tiene la menor masa?', options: ['Protón', 'Neutrón', 'Electrón', 'Núcleo'], correctIndex: 2, explanation: 'El electrón tiene aproximadamente 1/1836 de la masa de un protón o neutrón.' },
          { text: 'El número atómico (Z) representa:', options: ['Los neutrones', 'Los protones', 'Los electrones', 'La masa total'], correctIndex: 1, explanation: 'Z es el número de protones. Identifica al elemento químico.' },
          { text: '¿Qué son los isótopos?', options: ['Átomos con diferente número de protones', 'Átomos con diferente número de neutrones', 'Átomos con diferente número de electrones', 'Átomos de diferentes elementos'], correctIndex: 1, explanation: 'Los isótopos tienen el mismo Z pero diferente A (difieren en neutrones).' },
        ],
        summary: { concepts: ['Átomo: unidad básica de la materia', 'Protón: carga +1, en el núcleo', 'Neutrón: carga 0, en el núcleo', 'Electrón: carga -1, en la nube electrónica', 'Número atómico Z = protones', 'Masa atómica A = protones + neutrones'], formulas: ['A = Z + N (neutrones)', 'N = A − Z'], commonMistakes: ['Confundir número atómico con masa atómica', 'Pensar que los electrones orbitan en círculos fijos', 'Creer que todos los átomos del mismo elemento tienen la misma masa (olvidar isótopos)'], applications: ['La datación por carbono-14 usa isótopos radiactivos', 'Los isótopos se usan en medicina nuclear para diagnóstico y tratamiento', 'La configuración electrónica determina las propiedades químicas de los elementos'] },
        curiosities: [
          { title: 'El átomo más pequeño', content: 'El átomo de hidrógeno es el más pequeño y ligero de todos. Tiene solo 1 protón, 1 electrón y ningún neutrón.', type: 'data' },
          { title: 'La paradoja del núcleo', content: 'Si un átomo fuera del tamaño de un estadio de fútbol, el núcleo sería del tamaño de un guisante en el centro. ¡Todo lo demás es espacio vacío!', type: 'analogy' },
          { title: 'Isótopos en arqueología', content: 'El carbono-14 permite datar fósiles y restos arqueológicos de hasta 50,000 años de antigüedad. Fue descubierto en 1940 por Willard Libby.', type: 'history' },
        ]
      },
      {
        course_id: course1.id,
        title: 'Enlaces Químicos', description: 'Aprende cómo los átomos se unen mediante enlaces iónicos, covalentes y metálicos.',
        slug: 'enlaces-quimicos', difficulty: 'intermediate', category: 'Química General', duration_minutes: 30, order_index: 2, xp_reward: 150,
        content: { objectives: ['Diferenciar entre enlaces iónicos, covalentes y metálicos', 'Comprender la regla del octeto', 'Predecir el tipo de enlace según los elementos involucrados', 'Representar estructuras de Lewis'], prerequisites: ['Estructura del Átomo', 'Configuración electrónica básica'], sections: [
          { id: 's1', title: 'La Regla del Octeto', content: 'Los átomos tienden a ganar, perder o compartir electrones para completar su última capa con 8 electrones (configuración de gas noble).\n\nEsta tendencia se conoce como la **regla del octeto** y explica por qué se forman los enlaces químicos.\n\n**Ejemplo**: El sodio (Na) tiene 1 electrón en su última capa. Para alcanzar el octeto, tiende a perder ese electrón. El cloro (Cl) tiene 7 electrones en su última capa y tiende a ganar 1. ¡Por eso el NaCl (sal de mesa) se forma!', highlight: 'El helio es una excepción: solo tiene 2 electrones en su última capa (dueto), pero es estable.', question: { text: '¿Cuántos electrones buscan tener los átomos en su última capa según la regla del octeto?', options: ['2', '6', '8', '18'], correctIndex: 2, feedbackCorrect: '¡Correcto! La regla del octeto establece que los átomos buscan tener 8 electrones en su última capa.', feedbackIncorrect: 'La regla del octeto dice que los átomos buscan 8 electrones en su capa de valencia, como los gases nobles.', xpReward: 10 } },
          { id: 's2', title: 'Enlace Iónico', content: 'El **enlace iónico** se forma por transferencia de electrones entre un metal y un no metal.\n\n• El metal **pierde** electrones y se convierte en un **catión** (ión positivo).\n• El no metal **gana** electrones y se convierte en un **anión** (ión negativo).\n• Los iones se atraen por fuerzas electrostáticas.\n\n**Ejemplo**: NaCl (sal de mesa): Na⁺ + Cl⁻ → NaCl.\n\nLos compuestos iónicos son sólidos a temperatura ambiente, tienen altos puntos de fusión y conducen electricidad cuando están disueltos.', highlight: 'La sal de mesa (NaCl) tiene un punto de fusión de 801°C debido a la fuerte atracción entre iones.', question: { text: '¿Qué tipo de enlace se forma por transferencia de electrones?', options: ['Covalente', 'Iónico', 'Metálico', 'Puente de hidrógeno'], correctIndex: 1, feedbackCorrect: '¡Correcto! En el enlace iónico hay transferencia de electrones de un metal a un no metal.', feedbackIncorrect: 'El enlace iónico implica transferencia de electrones. El covalente implica compartición.', xpReward: 10 } },
          { id: 's3', title: 'Enlace Covalente', content: 'El **enlace covalente** se forma por **compartición** de electrones entre dos no metales.\n\n• **Covalente simple**: se comparte 1 par de electrones (ej: H₂).\n• **Covalente doble**: se comparten 2 pares (ej: O₂).\n• **Covalente triple**: se comparten 3 pares (ej: N₂).\n\n**Ejemplo**: La molécula de agua (H₂O) tiene dos enlaces covalentes O−H.\n\nLos compuestos covalentes pueden ser gases, líquidos o sólidos de bajo punto de fusión.', highlight: 'El enlace covalente triple del nitrógeno (N≡N) es uno de los enlaces más fuertes en la naturaleza, con una energía de 945 kJ/mol.', question: { text: '¿Cuántos pares de electrones se comparten en un enlace covalente doble?', options: ['1', '2', '3', '4'], correctIndex: 1, feedbackCorrect: '¡Correcto! En un enlace covalente doble se comparten 2 pares de electrones (4 electrones).', feedbackIncorrect: 'En un enlace covalente doble se comparten 2 pares. Simple = 1 par, Triple = 3 pares.', xpReward: 10 } },
          { id: 's4', title: 'Estructuras de Lewis', content: 'Las **estructuras de Lewis** representan los electrones de valencia de un átomo o molécula.\n\n**Cómo dibujarlas**:\n1. Suma los electrones de valencia de todos los átomos.\n2. Coloca el átomo menos electronegativo en el centro.\n3. Conecta los átomos con enlaces simples (2 electrones).\n4. Distribuye los electrones restantes para completar octetos.\n\n**Ejemplo**: CO₂ tiene 16 electrones de valencia: O=C=O', highlight: 'Existen excepciones a la regla del octeto, como el fósforo (PCl₅) que puede tener 10 electrones y el azufre (SF₆) que puede tener hasta 12.', question: { text: '¿Cuántos electrones de valencia tiene el carbono?', options: ['2', '4', '6', '8'], correctIndex: 1, feedbackCorrect: '¡Correcto! El carbono tiene 4 electrones de valencia (grupo 14 de la tabla periódica).', feedbackIncorrect: 'El carbono está en el grupo 14, por lo tanto tiene 4 electrones de valencia.', xpReward: 10 } },
        ]},
        finalExam: [
          { text: '¿Qué tipo de enlace se forma entre un metal y un no metal?', options: ['Covalente', 'Iónico', 'Metálico', 'Van der Waals'], correctIndex: 1, explanation: 'Los metales pierden electrones (cationes) y los no metales ganan (aniones), formando enlace iónico.' },
          { text: '¿Cuál de las siguientes moléculas tiene un enlace covalente triple?', options: ['H₂', 'O₂', 'N₂', 'CO₂'], correctIndex: 2, explanation: 'N₂ tiene un triple enlace N≡N. H₂ tiene simple, O₂ tiene doble.' },
          { text: 'La regla del octeto establece que los átomos buscan tener ____ electrones en su última capa:', options: ['2', '6', '8', '10'], correctIndex: 2, explanation: '8 electrones en la capa de valencia, como los gases nobles.' },
        ],
        summary: { concepts: ['Regla del octeto: 8 electrones en la capa de valencia', 'Enlace iónico: transferencia de electrones (metal + no metal)', 'Enlace covalente: compartición de electrones (no metal + no metal)', 'Estructuras de Lewis: representación de electrones de valencia'], formulas: ['Energía de enlace: kJ/mol necesarios para romper un enlace'], commonMistakes: ['Confundir enlace iónico con covalente', 'Olvidar que el hidrógeno solo necesita 2 electrones (dueto)', 'No contar correctamente los electrones de valencia en estructuras de Lewis'], applications: ['La sal de mesa (NaCl) es un compuesto iónico esencial en la alimentación', 'El agua (H₂O) con enlaces covalentes es el solvente universal', 'Los enlaces metálicos permiten la conducción eléctrica en los cables de cobre'] },
        curiosities: [
          { title: 'La molécula del agua', content: 'El agua (H₂O) tiene una forma angular con un ángulo de 104.5°. Esta geometría es responsable de sus propiedades únicas como solvente universal.', type: 'data' },
          { title: 'El enlace más fuerte', content: 'El enlace covalente triple del nitrógeno molecular (N≡N) tiene una energía de 945 kJ/mol, lo que lo hace extremadamente difícil de romper.', type: 'industry' },
          { title: 'Material del futuro', content: 'El grafeno es una lámina de carbono de un solo átomo de espesor con enlaces covalentes. Es 200 veces más resistente que el acero y conduce electricidad mejor que el cobre.', type: 'research' },
        ]
      },
      {
        course_id: course1.id,
        title: 'Estados de la Materia', description: 'Comprende los estados sólido, líquido, gaseoso y los cambios de fase.',
        slug: 'estados-materia', difficulty: 'beginner', category: 'Química General', duration_minutes: 25, order_index: 3, xp_reward: 100,
        content: { objectives: ['Identificar los 3 estados clásicos de la materia', 'Comprender los cambios de fase', 'Relacionar temperatura y presión con el estado de la materia'], prerequisites: ['Concepto de molécula y átomo'], sections: [
          { id: 's1', title: 'Los Estados de la Materia', content: 'La materia puede existir en tres estados clásicos:\n\n**Sólido**: forma y volumen fijos. Partículas muy juntas, solo vibran.\n**Líquido**: volumen fijo, forma variable. Partículas más separadas, pueden deslizarse.\n**Gas**: forma y volumen variables. Partículas muy separadas, se mueven libremente.\n\nEl **estado** depende de la temperatura y la presión. Al aumentar la temperatura, las partículas ganan energía cinética y pueden cambiar de estado.', highlight: 'Existe un cuarto estado llamado plasma, que es un gas ionizado. Es el estado más abundante del universo (estrellas, nebulosas).', question: { text: '¿En qué estado de la materia las partículas tienen mayor libertad de movimiento?', options: ['Sólido', 'Líquido', 'Gas', 'Plasma'], correctIndex: 2, feedbackCorrect: '¡Correcto! En el estado gaseoso, las partículas se mueven libremente ocupando todo el espacio disponible.', feedbackIncorrect: 'En el gas las partículas tienen la mayor libertad de movimiento. En sólidos solo vibran.', xpReward: 10 } },
          { id: 's2', title: 'Cambios de Fase', content: 'Los cambios de fase ocurren cuando se agrega o elimina energía:\n\n• **Fusión** (sólido → líquido): se absorbe energía.\n• **Vaporización** (líquido → gas): se absorbe energía.\n• **Condensación** (gas → líquido): se libera energía.\n• **Solidificación** (líquido → sólido): se libera energía.\n• **Sublimación** (sólido → gas): directo, absorbe energía.\n• **Deposición** (gas → sólido): directo, libera energía.\n\n**Ejemplo cotidiano**: El hielo se derrite (fusión) a 0°C y el agua hierve (vaporización) a 100°C al nivel del mar.', highlight: 'La sublimación del hielo seco (CO₂ sólido) a −78°C lo convierte directamente en gas sin pasar por líquido, ideal para efectos de humo en espectáculos.', question: { text: '¿Cómo se llama el cambio de líquido a gas?', options: ['Fusión', 'Solidificación', 'Vaporización', 'Sublimación'], correctIndex: 2, feedbackCorrect: '¡Correcto! La vaporización es el cambio de líquido a gas, que puede ser por evaporación o ebullición.', feedbackIncorrect: 'La vaporización es el cambio de líquido a gas. La fusión es de sólido a líquido.', xpReward: 10 } },
          { id: 's3', title: 'Diagrama de Fases del Agua', content: 'El **diagrama de fases** muestra en qué estado se encuentra una sustancia según temperatura y presión.\n\nPara el agua:\n• A 1 atm y 25°C → líquido.\n• A 1 atm y −10°C → sólido (hielo).\n• A 1 atm y 110°C → gas (vapor).\n\n**Punto triple**: temperatura y presión donde coexisten los 3 estados (0.01°C, 0.006 atm).\n**Punto crítico**: temperatura máxima donde el líquido puede existir (374°C, 218 atm para el agua).', highlight: 'El agua es una de las pocas sustancias cuyo sólido es menos denso que el líquido. Por eso el hielo flota en el agua.', question: { text: '¿Qué es el punto triple del agua?', options: ['Donde hierve el agua', 'Donde coexisten sólido, líquido y gas', 'Donde se congela el agua', 'Donde el agua se ioniza'], correctIndex: 1, feedbackCorrect: '¡Correcto! En el punto triple (0.01°C, 0.006 atm) coexisten los tres estados simultáneamente.', feedbackIncorrect: 'El punto triple es donde sólido, líquido y gas coexisten en equilibrio. Ocurre a 0.01°C y 0.006 atm.', xpReward: 10 } },
        ]},
        finalExam: [
          { text: '¿Cuál es el cambio de sólido a líquido?', options: ['Vaporización', 'Fusión', 'Sublimación', 'Condensación'], correctIndex: 1, explanation: 'Fusión es el cambio de sólido a líquido (ej: hielo derritiéndose).' },
          { text: '¿Por qué el hielo flota en el agua?', options: ['Porque es más denso', 'Porque es menos denso', 'Porque tiene aire', 'Porque es frío'], correctIndex: 1, explanation: 'El hielo es menos denso que el agua líquida debido a la estructura hexagonal de sus enlaces de hidrógeno.' },
          { text: 'La sublimación es el cambio directo de:', options: ['Sólido a líquido', 'Líquido a gas', 'Sólido a gas', 'Gas a líquido'], correctIndex: 2, explanation: 'Sublimación es de sólido a gas sin pasar por líquido (ej: hielo seco).' },
        ],
        summary: { concepts: ['Sólido: forma y volumen fijos', 'Líquido: volumen fijo, forma variable', 'Gas: forma y volumen variables', 'Cambios de fase: fusión, vaporización, condensación, solidificación, sublimación, deposición', 'Diagrama de fases: T vs P'], formulas: ['Q = m × L (calor latente de cambio de fase)'], commonMistakes: ['Confundir evaporación (superficie) con ebullición (todo el volumen)', 'Pensar que la temperatura cambia durante un cambio de fase (permanece constante)', 'Creer que el vapor de agua se ve (lo que se ve es la condensación en pequeñas gotas)'], applications: ['La refrigeración usa evaporación y condensación de refrigerantes', 'La destilación separa mezclas basándose en diferentes puntos de ebullición', 'El diagrama de fases es crítico en la industria farmacéutica para liofilización'] },
        curiosities: [
          { title: 'El agua y su densidad anómala', content: 'El agua alcanza su máxima densidad a 4°C, no a 0°C. Por eso los lagos se congelan desde la superficie hacia abajo, permitiendo la vida acuática en invierno.', type: 'data' },
          { title: 'El estado plasma', content: 'El plasma constituye el 99.9% de la materia visible del universo. En la Tierra se encuentra en relámpagos, auroras boreales y pantallas de plasma.', type: 'research' },
          { title: 'Liofilización industrial', content: 'La liofilización sublima el agua congelada de los alimentos al vacío, preservando su estructura y sabor. Se usa en café instantáneo y alimentos para astronautas.', type: 'industry' },
        ]
      },
    ]);

    // Lessons for Module 1
    const lesson1 = await Lesson.create({
      module_id: modules[0].id, title: 'Partículas Subatómicas', slug: 'particulas-subatomicas', order_index: 1,
      content_blocks: [
        { type: 'text', data: { content: '## Partículas Subatómicas\n\nEl átomo está compuesto por tres partículas fundamentales:\n\n• **Protón**: carga positiva (+1), masa de 1 uma.\n• **Neutrón**: carga neutra (0), masa de 1 uma.\n• **Electrón**: carga negativa (-1), masa de 1/1836 uma.', format: 'markdown' } },
        { type: 'highlight', data: { text: 'El 99.9% de la masa del átomo está en el núcleo, que ocupa solo 1/10,000 del volumen.', variant: 'info' } },
      ],
    });

    const lesson2 = await Lesson.create({
      module_id: modules[0].id, title: 'Número Atómico y Masa Atómica', slug: 'numero-atomico', order_index: 2,
      content_blocks: [
        { type: 'text', data: { content: '## Número Atómico y Masa Atómica\n\nEl **número atómico (Z)** es el número de protones. Identifica al elemento.\nLa **masa atómica (A)** es protones + neutrones.', format: 'markdown' } },
      ],
    });

    // Assessment for Module 1
    const assessment1 = await Assessment.create({
      module_id: modules[0].id, title: 'Práctica: Estructura del Átomo',
      type: 'graded_practice', passing_score: 70, max_attempts: 3, question_count: 5, random_order: true,
    });

    await QuestionBank.bulkCreate([
      { assessment_id: assessment1.id, text: '¿Qué partícula subatómica tiene carga positiva?', type: 'multiple_choice',
        options: [{ id: 'a', text: 'Electrón', is_correct: false }, { id: 'b', text: 'Protón', is_correct: true }, { id: 'c', text: 'Neutrón', is_correct: false }],
        explanation: 'El protón tiene carga +1 y se encuentra en el núcleo.', difficulty: 'easy', tags: ['atomos', 'particulas'], xp_reward: 10,
        feedback_correct: '¡Correcto! El protón tiene carga +1 en el núcleo.', feedback_incorrect: 'El protón tiene carga +1. Los electrones tienen carga -1.' },
      { assessment_id: assessment1.id, text: '¿Dónde se encuentran los electrones en el átomo?', type: 'multiple_choice',
        options: [{ id: 'a', text: 'En el núcleo', is_correct: false }, { id: 'b', text: 'En la nube electrónica', is_correct: true }, { id: 'c', text: 'Distribuidos uniformemente', is_correct: false }],
        explanation: 'Los electrones se encuentran en la nube electrónica alrededor del núcleo.', difficulty: 'easy', tags: ['atomos'],
        feedback_correct: '¡Correcto! La nube electrónica rodea al núcleo.', feedback_incorrect: 'Los electrones están en la nube electrónica, no en el núcleo.' },
      { assessment_id: assessment1.id, text: 'Si un átomo tiene 6 protones y 6 neutrones, ¿cuál es su número atómico?', type: 'multiple_choice',
        options: [{ id: 'a', text: '6', is_correct: true }, { id: 'b', text: '12', is_correct: false }, { id: 'c', text: '18', is_correct: false }],
        explanation: 'Z = número de protones = 6. El elemento es carbono.', difficulty: 'medium', tags: ['atomos', 'numeros-cuanticos'],
        feedback_correct: '¡Correcto! Z = 6, es carbono.', feedback_incorrect: 'Z = protones = 6. A = protones + neutrones = 12.' },
    ]);

    // Final exam for Course 1
    const finalExam = await Assessment.create({
      course_id: course1.id, title: 'Examen Final: Química General',
      type: 'final_exam', passing_score: 70, max_attempts: 1, time_limit_minutes: 60, question_count: 10, random_order: true,
    });

    await QuestionBank.bulkCreate([
      { assessment_id: finalExam.id, text: '¿Qué partícula tiene la menor masa?', type: 'multiple_choice',
        options: [{ id: 'a', text: 'Protón', is_correct: false }, { id: 'b', text: 'Neutrón', is_correct: false }, { id: 'c', text: 'Electrón', is_correct: true }],
        explanation: 'El electrón tiene 1/1836 de la masa de un protón.', difficulty: 'easy', tags: ['atomos'], xp_reward: 15 },
      { assessment_id: finalExam.id, text: '¿Qué tipo de enlace se forma por transferencia de electrones?', type: 'multiple_choice',
        options: [{ id: 'a', text: 'Covalente', is_correct: false }, { id: 'b', text: 'Iónico', is_correct: true }, { id: 'c', text: 'Metálico', is_correct: false }],
        explanation: 'En el enlace iónico hay transferencia de electrones del metal al no metal.', difficulty: 'medium', tags: ['enlaces'],
        feedback_correct: '¡Correcto! Transferencia de electrones.', feedback_incorrect: 'El enlace iónico implica transferencia. El covalente comparte electrones.' },
      { assessment_id: finalExam.id, text: '¿Cómo se llama el cambio de sólido a gas sin pasar por líquido?', type: 'multiple_choice',
        options: [{ id: 'a', text: 'Fusión', is_correct: false }, { id: 'b', text: 'Vaporización', is_correct: false }, { id: 'c', text: 'Sublimación', is_correct: true }],
        explanation: 'La sublimación es el cambio directo de sólido a gas.', difficulty: 'easy', tags: ['estados'],
        feedback_correct: '¡Correcto! Sublimación.', feedback_incorrect: 'Sublimación es de sólido a gas. El hielo seco es un ejemplo.' },
    ]);

    await UserModule.bulkCreate([
      { user_id: julian.id, module_id: modules[0].id, progress_percent: 100, status: 'completed', started_at: new Date() },
      { user_id: julian.id, module_id: modules[1].id, progress_percent: 65, status: 'in_progress', started_at: new Date() },
      { user_id: julian.id, module_id: modules[2].id, progress_percent: 40, status: 'in_progress', started_at: new Date() },
    ]);

    const experiment = await Experiment.create({
      user_id: julian.id,
      title: 'Simulador de Catálisis',
      status: 'active',
      temperature: 298,
      pressure: 1.2,
      conc_a: 0.5,
      conc_b: 0.2,
      active_timeline_step: 'Transición',
    });

    await ExperimentCompound.bulkCreate([
      { experiment_id: experiment.id, compound_id: compounds[0].id },
      { experiment_id: experiment.id, compound_id: compounds[2].id },
    ]);

    await Prediction.bulkCreate([
      { experiment_id: experiment.id, user_id: julian.id, yield_percent: 89, stability_percent: 94, energy_value: -4.2, atoms_count: 1428, risk_level: 'Bajo', global_state: 'Estable', catalyst_efficiency: 75, enthalpy: -285, entropy: 130, accuracy_percent: 92, estimated_time: '2m 34s' },
      { user_id: julian.id, yield_percent: 85, stability_percent: 88, energy_value: -4.5, atoms_count: 1380, risk_level: 'Moderado', global_state: 'Advertencia', catalyst_efficiency: 72, enthalpy: -290, entropy: 125, accuracy_percent: 88, estimated_time: '3m 10s' },
    ]);

    await KineticSnapshot.bulkCreate([
      { experiment_id: experiment.id, time_label: '10s', yield_percent: 20, stability_percent: 95, is_prediction: false, order_index: 0 },
      { experiment_id: experiment.id, time_label: '30s', yield_percent: 42, stability_percent: 91, is_prediction: false, order_index: 1 },
      { experiment_id: experiment.id, time_label: '1m', yield_percent: 63, stability_percent: 85, is_prediction: false, order_index: 2 },
      { experiment_id: experiment.id, time_label: '1.5m', yield_percent: 78, stability_percent: 80, is_prediction: false, order_index: 3 },
      { experiment_id: experiment.id, time_label: '2m', yield_percent: 89, stability_percent: 94, is_prediction: true, order_index: 4 },
    ]);

    await AiRecommendation.bulkCreate([
      { type: 'tip', message: 'La IA recomienda aumentar la temperatura a 310 K para optimizar el rendimiento.', priority: 1 },
      { type: 'success', message: 'Reducir concentración de O₂ mejorará la estabilidad global.', priority: 2 },
      { type: 'warning', message: 'Presión elevada detectada. Considera reducir a 1.2 atm.', priority: 3 },
    ]);

    await Notification.bulkCreate([
      { user_id: julian.id, title: 'Nuevo módulo disponible', message: 'El módulo de Termodinámica Aplicada ya está disponible.', type: 'info', is_read: false },
      { user_id: julian.id, title: 'Logro desbloqueado', message: 'Completaste 10 experimentos de catálisis.', type: 'achievement', is_read: true },
      { user_id: julian.id, title: 'Predicción IA lista', message: 'Tu última simulación alcanzó 92% de precisión.', type: 'system', is_read: false },
    ]);

    await UserAnalytics.bulkCreate([
      { user_id: julian.id, total_experiments: 24, avg_yield: 87.5, avg_accuracy: 90, best_yield: 94, rank_position: 3 },
      { user_id: maria.id, total_experiments: 18, avg_yield: 82.3, avg_accuracy: 85.5, best_yield: 91, rank_position: 7 },
    ]);

    await CommunityPost.bulkCreate([
      { user_id: maria.id, title: '¿Cómo optimizar catálisis en fase homogénea?', content: 'Estoy trabajando con permanganato...', category: 'dudas', likes_count: 12 },
      { user_id: julian.id, title: 'Mi mejor rendimiento: 94%', content: 'Logré estabilidad alta usando 310K.', category: 'logros', likes_count: 28 },
    ]);

    // Parent notifications about children
    await Notification.bulkCreate([
      { user_id: ana.id, title: 'Bajo rendimiento en Termodinámica', message: 'Tu hijo Julián ha obtenido 55/100 en el último examen. Sugerimos reforzar los temas de entalpía.', type: 'alert', is_read: false },
      { user_id: ana.id, title: 'Estado emocional: Estresado', message: 'El sistema detectó frustración durante ejercicios de cinética química. Considera una pausa activa.', type: 'emotional', is_read: false },
      { user_id: ana.id, title: 'Logro desbloqueado: Químico en Progreso', message: 'Completaste 10 laboratorios virtuales consecutivos.', type: 'achievement', is_read: true },
      { user_id: ana.id, title: 'Nueva tarea asignada: Ácidos y Bases', message: 'El docente asignó una práctica de laboratorio para este viernes.', type: 'info', is_read: true },
      { user_id: ana.id, title: 'Actualización de la plataforma', message: 'Nuevos simuladores de electroquímica disponibles en el laboratorio.', type: 'system', is_read: true },
      { user_id: ana.id, title: 'Tendencia positiva: Motivación en aumento', message: 'Tu hijo muestra mayor interés en química orgánica esta semana.', type: 'emotional', is_read: true },
      { user_id: ana.id, title: 'Práctica de laboratorio calificada', message: 'Obtuvo 92/100 en Estructura Molecular — excelente desempeño.', type: 'achievement', is_read: true },
      { user_id: ana.id, title: 'Sube de nivel: Alumno destacado', message: 'Alcanzó el nivel 8 en la ruta de aprendizaje personalizada.', type: 'achievement', is_read: true },
    ]);

    // Conversations
    const conv1 = await Conversation.create({
      parent_id: ana.id, teacher_id: carlos.id, student_id: julian.id,
      subject: 'Rendimiento en Termodinámica',
    });

    const conv2 = await Conversation.create({
      parent_id: ana.id, teacher_id: carlos.id, student_id: maria.id,
      subject: 'Práctica de Laboratorio',
    });

    await Message.bulkCreate([
      { conversation_id: conv1.id, sender_id: carlos.id, content: 'Buenos días, Ana. Le escribo para comentarle sobre el rendimiento de Julián en Termodinámica.' },
      { conversation_id: conv1.id, sender_id: ana.id, content: 'Buenos días, profesor. Sí, vi que tuvo dificultades. ¿Qué me recomienda?' },
      { conversation_id: conv1.id, sender_id: carlos.id, content: 'Le sugiero reforzar los temas de entalpía con los simuladores interactivos de la plataforma. También puedo asignarle ejercicios adicionales.' },
      { conversation_id: conv1.id, sender_id: ana.id, content: 'Perfecto, muchas gracias. Revisaré esa herramienta con él esta tarde.' },
      { conversation_id: conv2.id, sender_id: carlos.id, content: 'Hola Ana, María ha mejorado mucho en sus prácticas de laboratorio. Su último reporte fue excelente.' },
      { conversation_id: conv2.id, sender_id: ana.id, content: '¡Qué alegría! Ella está muy motivada con los experimentos virtuales.' },
    ]);

    // Teacher seed data
    const aula1 = await Classroom.create({ teacher_id: carlos.id, name: 'Química Orgánica II', subject: 'Química Orgánica', code: 'QO-2026-1', section: 'A', academic_period: '2026-1' });
    const aula2 = await Classroom.create({ teacher_id: carlos.id, name: 'Química General', subject: 'Química General', code: 'QG-2026-1', section: 'B', academic_period: '2026-1' });

    await Enrollment.bulkCreate([
      { classroom_id: aula1.id, student_id: julian.id },
      { classroom_id: aula1.id, student_id: maria.id },
      { classroom_id: aula2.id, student_id: julian.id },
    ]);

    const [enrJulianAula1, enrMariaAula1, enrJulianAula2] = await Enrollment.findAll({ where: { classroom_id: [aula1.id, aula2.id] }, order: [['created_at', 'ASC']] });

    await Grade.bulkCreate([
      { enrollment_id: enrJulianAula1.id, type: 'task', score: 85, max_score: 100, weight: 0.2, topic: 'Enlaces Químicos', date: '2026-02-15' },
      { enrollment_id: enrJulianAula1.id, type: 'lab', score: 78, max_score: 100, weight: 0.3, topic: 'Síntesis de Compuestos', date: '2026-03-01' },
      { enrollment_id: enrJulianAula1.id, type: 'exam', score: 65, max_score: 100, weight: 0.5, topic: 'Reacciones Orgánicas', date: '2026-03-15' },
      { enrollment_id: enrMariaAula1.id, type: 'task', score: 92, max_score: 100, weight: 0.2, topic: 'Enlaces Químicos', date: '2026-02-15' },
      { enrollment_id: enrMariaAula1.id, type: 'lab', score: 88, max_score: 100, weight: 0.3, topic: 'Síntesis de Compuestos', date: '2026-03-01' },
      { enrollment_id: enrMariaAula1.id, type: 'exam', score: 78, max_score: 100, weight: 0.5, topic: 'Reacciones Orgánicas', date: '2026-03-15' },
      { enrollment_id: enrJulianAula2.id, type: 'task', score: 90, max_score: 100, weight: 0.2, topic: 'Estequiometría', date: '2026-02-20' },
      { enrollment_id: enrJulianAula2.id, type: 'lab', score: 82, max_score: 100, weight: 0.3, topic: 'Balanceo de Ecuaciones', date: '2026-03-05' },
      { enrollment_id: enrJulianAula2.id, type: 'exam', score: 70, max_score: 100, weight: 0.5, topic: 'Cálculos Químicos', date: '2026-03-20' },
    ]);

    await Assignment.bulkCreate([
      { classroom_id: aula1.id, title: 'Ejercicios de Enlaces Químicos', description: 'Resolver 10 ejercicios sobre tipos de enlaces.', type: 'task', due_date: '2026-02-20', max_score: 100 },
      { classroom_id: aula1.id, title: 'Laboratorio: Síntesis Orgánica', description: 'Completar el laboratorio virtual de síntesis.', type: 'lab', due_date: '2026-03-05', max_score: 100 },
      { classroom_id: aula1.id, title: 'Examen Parcial: Reacciones', description: 'Examen escrito sobre reacciones orgánicas.', type: 'exam', due_date: '2026-03-20', max_score: 100 },
      { classroom_id: aula2.id, title: 'Tarea de Estequiometría', description: 'Resolver problemas de estequiometría.', type: 'task', due_date: '2026-02-25', max_score: 100 },
      { classroom_id: aula2.id, title: 'Práctica de Balanceo', description: 'Balancear 15 ecuaciones químicas.', type: 'lab', due_date: '2026-03-10', max_score: 100 },
    ]);

    // Student achievements
    await Achievement.bulkCreate([
      { user_id: julian.id, title: 'Primer Laboratorio', description: 'Completó su primer laboratorio virtual', icon: 'flask', rarity: 'common', xp_awarded: 50 },
      { user_id: julian.id, title: 'Racha de 7 Días', description: 'Mantuvo una racha de estudio de 7 días consecutivos', icon: 'zap', rarity: 'rare', xp_awarded: 100 },
      { user_id: julian.id, title: 'Maestro de Estequiometría', description: 'Resolvió correctamente 20 ejercicios', icon: 'brain', rarity: 'epic', xp_awarded: 250 },
      { user_id: maria.id, title: 'Estrella del Mes', description: 'Mejor desempeño del mes en su grupo', icon: 'star', rarity: 'legendary', xp_awarded: 500 },
    ]);

    // Quiz results
    await QuizResult.bulkCreate([
      { user_id: julian.id, score: 85, max_score: 100, xp_earned: 85, time_spent_seconds: 420 },
      { user_id: julian.id, score: 65, max_score: 100, xp_earned: 65, time_spent_seconds: 380 },
      { user_id: maria.id, score: 92, max_score: 100, xp_earned: 92, time_spent_seconds: 510 },
    ]);

    // Teacher notifications
    await Notification.bulkCreate([
      { user_id: carlos.id, title: 'Julián necesita refuerzo', message: 'Su promedio en Química Orgánica II bajó a 73%.', type: 'alert', is_read: false },
      { user_id: carlos.id, title: 'Práctica calificada: María', message: 'María obtuvo 88/100 en Síntesis de Compuestos.', type: 'achievement', is_read: true },
      { user_id: carlos.id, title: 'Nuevo mensaje de padre', message: 'Ana Mendoza te envió un mensaje sobre Julián.', type: 'info', is_read: false },
    ]);

    console.log('✓ Seed completado');
    console.log('  Usuario demo:      julian@chemsystem.edu / password123');
    console.log('  Usuario profesor:  profesor@chemsystem.edu / password123 (es la cuenta teacher)');
    console.log('  Usuario padre:     padre@chemsystem.edu / password123');
    process.exit(0);
  } catch (err) {
    console.error('✗ Error en seed:', err);
    process.exit(1);
  }
}

seed();
