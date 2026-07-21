const https = require('https');

const API_KEY = process.env.OPENROUTER_API_KEY;

const CONFIG = {
  model: process.env.AI_MODEL || 'meta-llama/llama-3.2-3b-instruct',
  temperature: 0.7,
  timeout: 30000,
  maxTokensPerRequest: 800,
};

const TUTOR_SYSTEM_PROMPT = `Eres el Dr. García, profesor universitario de química con más de 15 años de experiencia docente. Actualmente trabajas como tutor personalizado en la plataforma ChemSystem.

REGLAS FUNDAMENTALES:
1. NUNCA menciones que eres una IA, modelo de lenguaje, OpenRouter ni ninguna tecnología. Eres un profesor de química.
2. Siempre responde en español, con tono paciente, académico y alentador. Usa "tú" para dirigirte al estudiante.
3. Usa el CONTEXTO DEL ESTUDIANTE que se te proporciona para personalizar cada respuesta.
4. Si el estudiante expresa confusión ("no entendí", "no comprendo", etc.) identifica automáticamente el concepto basándote en el contexto y explícalo con una analogía del mundo real.
5. Después de explicar un concepto, ofrece un ejemplo práctico o un ejercicio breve.
6. Si el estudiante te pide ejercicios, genera exactamente 3 ejercicios relacionados con su módulo actual y nivel de dificultad.
7. NUNCA respondas con frases genéricas como "¿en qué puedo ayudarte?". Siempre usa el contexto.

CONTEXTO ACTUAL DEL ESTUDIANTE:
{CONTEXTO}

INSTRUCCIONES ESPECÍFICAS:
- SALUDO INICIAL: Saluda al estudiante por su nombre. Menciona el curso y módulo que está viendo. Si tuvo una evaluación reciente, haz referencia a sus resultados. Ejemplo: "¡Hola Juan! Veo que estás estudiando Equilibrio Químico. En tu última práctica obtuviste 6/10, vamos a repasar los conceptos que necesitas reforzar."
- EXPLICACIONES: Usa analogías del mundo real. Por ejemplo, para explicar el equilibrio químico, compáralo con una balanza o con personas entrando y saliendo de una habitación.
- EJERCICIOS: Cuando el estudiante pida ejercicios, genera 3 ejercicios numerados, con enunciado claro, y al final ofrece resolverlos paso a paso.
- ADAPTACIÓN DE DIFICULTAD: Si el estudiante ha fallado varias veces el mismo concepto, simplifica drásticamente. Usa ejemplos cotidianos. No uses terminología avanzada. Cuando demuestre comprensión, aumenta gradualmente la complejidad.
- NIVELES: Si el estudiante pide "explica fácil", "como secundaria", "como universidad", "con analogías" o "paso a paso", adapta inmediatamente el nivel.
- RECOMENDACIONES: Basándote en los conceptos débiles del contexto, recomienda al estudiante qué repasar antes de continuar.
- RESPUESTA: Mantén las respuestas concisas pero completas. Entre 3-5 párrafos máximo, a menos que el estudiante pida más detalles.
- NUNCA digas "Como asistente IA", "Como modelo de lenguaje" o frases similares.`;

function log(level, message, data) {
  if (process.env.NODE_ENV !== 'development') return;
  const prefix = { info: '[AI]', warn: '[AI] ⚠', error: '[AI] ✗' }[level] || '[AI]';
  console.log(`${prefix} ${message}${data ? ' ' + JSON.stringify(data) : ''}`);
}

function formatContext(context) {
  if (!context) return 'No hay información disponible del estudiante.';

  let output = '';
  if (context.user?.name) output += `Nombre del estudiante: ${context.user.name}\n`;

  if (context.course) {
    output += `\n--- CURSO ACTUAL ---\n`;
    output += `Curso: ${context.course.title}\n`;
    output += `Progreso del curso: ${context.progress?.percent || 0}% (${context.progress?.modulesCompleted || 0}/${context.progress?.totalModules || 0} módulos completados)\n`;
  }

  if (context.module) {
    output += `\n--- MÓDULO ACTUAL ---\n`;
    output += `Módulo: ${context.module.title}\n`;
    if (context.progress?.moduleProgress !== undefined) {
      output += `Progreso del módulo: ${context.progress.moduleProgress}%\n`;
    }
    if (context.progress?.moduleStatus) {
      output += `Estado del módulo: ${context.progress.moduleStatus}\n`;
    }
  }

  if (context.lesson) {
    output += `\n--- LECCIÓN ACTUAL ---\n`;
    output += `Lección: ${context.lesson.title}\n`;
  }

  if (context.lastAssessment) {
    output += `\n--- ÚLTIMA EVALUACIÓN ---\n`;
    output += `Resultado: ${context.lastAssessment.passed ? 'Aprobada' : 'No aprobada'}\n`;
    output += `Puntaje: ${context.lastAssessment.score}%\n`;
    if (context.lastAssessment.wrongAnswers?.length > 0) {
      output += `Preguntas incorrectas:\n`;
      for (const wa of context.lastAssessment.wrongAnswers) {
        output += `- ${wa.question}\n`;
        output += `  Concepto: ${wa.concept}\n`;
        output += `  Explicación: ${wa.explanation}\n`;
      }
    }
  }

  if (context.weakConcepts?.length > 0) {
    output += `\n--- CONCEPTOS A REFORZAR ---\n`;
    output += context.weakConcepts.map(c => `- ${c}`).join('\n') + '\n';
  }

  if (context.strengths?.length > 0) {
    output += `\n--- CONCEPTOS DOMINADOS ---\n`;
    output += context.strengths.map(s => `- ${s}`).join('\n') + '\n';
  }

  return output;
}

function callOpenRouter(messages) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      model: CONFIG.model,
      messages,
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.maxTokensPerRequest,
    });

    const opts = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      timeout: CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://chemsystem.edu',
        'X-Title': 'ChemSystem',
      },
    };

    const start = Date.now();
    const req = https.request(opts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        log('info', `${res.statusCode} in ${Date.now() - start}ms`, { msgs: messages.length, model: CONFIG.model });
        try {
          const parsed = JSON.parse(body);
          if (parsed.error) log('error', 'OpenRouter error', { message: parsed.error.message });
          resolve(parsed);
        } catch {
          resolve({ error: { message: 'Respuesta inválida del servidor' } });
        }
      });
    });
    req.on('error', e => resolve({ error: { message: 'Error de red: ' + e.message } }));
    req.on('timeout', () => { req.destroy(); resolve({ error: { message: 'Tiempo de espera agotado (30s)' } }); });
    req.write(payload);
    req.end();
  });
}

async function chat(messages, context) {
  if (!API_KEY) {
    log('error', 'OPENROUTER_API_KEY no configurada');
    return { reply: 'Error: La API de IA no está configurada. Contacta al administrador.' };
  }
  try {
    const contextStr = formatContext(context);
    const systemWithContext = TUTOR_SYSTEM_PROMPT.replace('{CONTEXTO}', contextStr);
    const fullMessages = [
      { role: 'system', content: systemWithContext },
      ...messages,
    ];
    const res = await callOpenRouter(fullMessages);
    const reply = res.choices?.[0]?.message?.content;
    if (!reply) {
      const errMsg = res.error?.message || 'Respuesta vacía';
      log('error', 'Empty response', { detail: res.error?.message });
      return { reply: `Error de IA: ${errMsg}` };
    }
    return { reply };
  } catch (err) {
    log('error', 'Exception', { message: err.message });
    return { reply: 'Error de conexión con la IA. Intenta de nuevo.' };
  }
}

async function generateExercises(context, count = 3) {
  if (!API_KEY) return [];
  const contextStr = formatContext(context);
  const moduleInfo = context?.module?.title || 'química general';
  const courseInfo = context?.course?.title || 'química';
  const weakAreas = context?.weakConcepts?.join(', ') || 'conceptos generales';

  const prompt = `Genera exactamente ${count} ejercicios de química para un estudiante que está estudiando "${moduleInfo}" dentro del curso "${courseInfo}". 

El estudiante necesita reforzar estos temas: ${weakAreas}.

ADAPTACIÓN: Los ejercicios deben ser de dificultad media-baja si el estudiante tiene conceptos débiles.

Formato para cada ejercicio:
- Enunciado claro y conciso
- 4 opciones de respuesta (A, B, C, D)
- Indicar cuál es la respuesta correcta
- Incluir una breve explicación de por qué es correcta

Devuelve SOLO un JSON array válido sin markdown. Ejemplo:
[{"question":"Enunciado","options":{"A":"opción A","B":"opción B","C":"opción C","D":"opción D"},"correctAnswer":"A","explanation":"Explicación breve"}]`;

  try {
    const res = await callOpenRouter([
      { role: 'system', content: 'Eres un profesor de química generando ejercicios. Devuelves solo JSON válido.' },
      { role: 'user', content: prompt },
    ]);
    const text = res.choices?.[0]?.message?.content || '[]';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return [];
  }
}

async function suggestInterventions(atRiskStudents, className) {
  if (!API_KEY) return [];
  const studentData = atRiskStudents.map(s => `${s.name}: promedio ${s.average}%`).join('\n');
  const prompt = `Basado en estos estudiantes en riesgo del curso "${className}", genera sugerencias de intervención. Devuelve solo un JSON array con objetos {"type":"tip"|"warning","message":"texto"}. Máximo 3.\n\nEstudiantes:\n${studentData || 'Sin datos'}`;
  try {
    const res = await callOpenRouter([
      { role: 'system', content: 'Eres un analista educativo. Devuelves solo JSON válido.' },
      { role: 'user', content: prompt },
    ]);
    const text = res.choices?.[0]?.message?.content || '[]';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch { return []; }
}

async function recommendForParent(studentName, kpis, subjectProgress) {
  if (!API_KEY) return { insights: [], summary: '' };
  const progressStr = subjectProgress.map(s => `${s.subject}: ${s.progress}%`).join('\n');
  const prompt = `Genera recomendaciones para ${studentName}. Promedio ${kpis.avgScore}%, racha ${kpis.streak} días.\n\nProgreso:\n${progressStr}\n\nDevuelve JSON: {"summary":"texto","insights":[{"label":"","value":"","detail":""}]}. Máximo 4 insights.`;
  try {
    const res = await callOpenRouter([
      { role: 'system', content: 'Eres un consejero educativo para padres. Devuelves solo JSON.' },
      { role: 'user', content: prompt },
    ]);
    const text = res.choices?.[0]?.message?.content || '{}';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch { return { insights: [], summary: '' }; }
}

module.exports = { chat, generateExercises, suggestInterventions, recommendForParent };
