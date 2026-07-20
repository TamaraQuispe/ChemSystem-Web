const https = require('https');

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'google/gemini-2.0-flash-exp';

function callOpenRouter(messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ model: MODEL, messages, temperature: 0.9, seed: Math.floor(Math.random() * 100000) });
    const opts = {
      hostname: 'openrouter.ai', path: '/api/v1/chat/completions', method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://chemsystem.edu', 'X-Title': 'ChemSystem',
      },
    };
    const req = https.request(opts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { resolve({ error: 'Error al parsear respuesta' }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function chat(messages) {
  if (!API_KEY) return { reply: 'La IA no está configurada. Contacta al administrador.' };
  try {
    const lastMsg = messages[messages.length - 1]?.content || 'Dime hola';
    const res = await callOpenRouter([
      { role: 'system', content: 'Responde en español de forma breve y natural. Si te saludan, solo saluda. No des información no solicitada.' },
      { role: 'user', content: lastMsg },
    ]);
    const reply = res.choices?.[0]?.message?.content || res.error?.message || 'Error: ' + JSON.stringify(res).slice(0, 200);
    return { reply };
  } catch (err) {
    return { reply: 'Error: ' + err.message };
  }
}

async function testConnection() {
  try {
    const res = await callOpenRouter([{ role: 'user', content: 'Responde solo "OK" si me escuchas.' }]);
    const reply = res.choices?.[0]?.message?.content || JSON.stringify(res.error || res).slice(0, 200);
    return { status: res.choices ? 'ok' : 'error', reply, model: MODEL };
  } catch (err) {
    return { status: 'error', error: err.message, model: MODEL };
  }
}

async function suggestInterventions(atRiskStudents, className) {
  if (!API_KEY) return [];
  const studentData = atRiskStudents.map(s => `${s.name}: promedio ${s.average}%, tendencia ${s.trend > 0 ? '+' : ''}${s.trend}%`).join('\n');
  const prompt = `Eres un analista educativo. Basado en estos estudiantes en riesgo del curso "${className}", genera sugerencias de intervención concretas y accionables. Devuelve solo un JSON array con objetos { "type": "tip"|"warning", "message": "texto" }. Máximo 3 sugerencias.\n\nEstudiantes:\n${studentData || 'No hay datos específicos'}`;
  try {
    const res = await callOpenRouter([{ role: 'user', content: prompt }]);
    const text = res.choices?.[0]?.message?.content || '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch { return []; }
}

async function recommendForParent(studentName, kpis, subjectProgress) {
  if (!API_KEY) return { insights: [], summary: '' };
  const progressStr = subjectProgress.map(s => `${s.subject}: ${s.progress}% (${s.status})`).join('\n');
  const prompt = `Eres un consejero educativo para padres. Genera recomendaciones personalizadas para ${studentName}. Datos: promedio ${kpis.avgScore}%, racha ${kpis.streak} días, módulos: ${kpis.challengesCompleted}.\n\nProgreso por materia:\n${progressStr}\n\nDevuelve solo un JSON: { "summary": "texto breve", "insights": [{"label": "Título", "value": "valor", "detail": "detalle"}] }. Máximo 4 insights.`;
  try {
    const res = await callOpenRouter([{ role: 'user', content: prompt }]);
    const text = res.choices?.[0]?.message?.content || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch { return { insights: [], summary: '' }; }
}

module.exports = { chat, suggestInterventions, recommendForParent, testConnection };
