const https = require('https');

const API_KEY = process.env.OPENROUTER_API_KEY;

const CONFIG = {
  model: process.env.AI_MODEL || 'meta-llama/llama-3.2-3b-instruct',
  temperature: 0.7,
  timeout: 30000,
  maxTokensPerRequest: 500,
  systemPrompt: `Eres un asistente educativo de ChemSystem, una plataforma de química. Ayudas a estudiantes con sus consultas sobre cursos, simuladores, laboratorios y ejercicios. Respondes en español de forma clara, breve y amigable. Si te saludan, solo saluda cordialmente. Si preguntan sobre química, explica con ejemplos prácticos. No inventes información que no conozcas.`,
};

function log(level, message, data) {
  if (process.env.NODE_ENV !== 'development') return;
  const prefix = { info: '[AI]', warn: '[AI] ⚠', error: '[AI] ✗' }[level] || '[AI]';
  console.log(`${prefix} ${message}${data ? ' ' + JSON.stringify(data) : ''}`);
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

async function chat(messages) {
  if (!API_KEY) {
    log('error', 'OPENROUTER_API_KEY no configurada');
    return { reply: 'Error: La API de IA no está configurada. Contacta al administrador.' };
  }
  try {
    const fullMessages = [{ role: 'system', content: CONFIG.systemPrompt }, ...messages];
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

module.exports = { chat, suggestInterventions, recommendForParent };
