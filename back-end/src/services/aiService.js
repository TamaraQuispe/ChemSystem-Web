const https = require('https');

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'meta-llama/llama-3.2-3b-instruct';

const SYSTEM_PROMPT = {
  role: 'system',
  content: `Eres un asistente educativo de ChemSystem, una plataforma de química. Ayudas a estudiantes con sus consultas sobre cursos, simuladores, laboratorios y ejercicios. Respondes en español de forma clara, breve y amigable. Si te saludan, solo saluda cordialmente. Si preguntan sobre química, explica con ejemplos prácticos. No inventes información que no conozcas.`,
};

const REQUEST_TIMEOUT = 30000;

function callOpenRouter(messages) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ model: MODEL, messages, temperature: 0.7 });
    const opts = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      timeout: REQUEST_TIMEOUT,
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
        if (process.env.NODE_ENV === 'development') {
          console.log(`[AI] ${res.statusCode} in ${Date.now() - start}ms (${messages.length} msgs)`);
        }
        try {
          const parsed = JSON.parse(body);
          if (parsed.error && process.env.NODE_ENV === 'development') {
            console.error('[AI] OpenRouter error:', parsed.error.message);
          }
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
    console.error('[AI] OPENROUTER_API_KEY no configurada');
    return { reply: 'Error: La API de IA no está configurada. Contacta al administrador.' };
  }
  try {
    const fullMessages = [SYSTEM_PROMPT, ...messages];
    const res = await callOpenRouter(fullMessages);
    const reply = res.choices?.[0]?.message?.content;
    if (!reply) {
      const errMsg = res.error?.message || JSON.stringify(res).slice(0, 200);
      console.error('[AI] Empty response:', errMsg);
      return { reply: `Error de IA: ${errMsg}` };
    }
    return { reply };
  } catch (err) {
    console.error('[AI] Exception:', err.message);
    return { reply: 'Error de conexión con la IA. Intenta de nuevo.' };
  }
}

async function testConnection() {
  try {
    const res = await callOpenRouter([
      { role: 'system', content: 'Responde solo con la palabra OK si funciono.' },
      { role: 'user', content: 'Funcionas?' },
    ]);
    const reply = res.choices?.[0]?.message?.content;
    return {
      status: reply ? 'ok' : 'error',
      reply: reply || res.error?.message || JSON.stringify(res).slice(0, 200),
      model: MODEL,
    };
  } catch (err) {
    return { status: 'error', error: err.message, model: MODEL };
  }
}

async function suggestInterventions(atRiskStudents, className) {
  if (!API_KEY) return [];
  const studentData = atRiskStudents.map(s => `${s.name}: promedio ${s.average}%, tendencia ${s.trend > 0 ? '+' : ''}${s.trend}%`).join('\n');
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
  const progressStr = subjectProgress.map(s => `${s.subject}: ${s.progress}% (${s.status})`).join('\n');
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

module.exports = { chat, testConnection, suggestInterventions, recommendForParent };
