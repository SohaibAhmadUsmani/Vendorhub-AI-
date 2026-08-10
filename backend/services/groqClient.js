const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function groqChat(messages, options = {}) {
  const completion = await groq.chat.completions.create({
    model: options.model || 'llama-3.3-70b-versatile',
    messages,
    temperature: options.temperature ?? 0.7,
  });
  return completion.choices[0]?.message?.content || '';
}

module.exports = { groqChat };