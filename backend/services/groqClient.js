const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Chat completion against Groq. Options mirror the SDK:
 *   model          — model id (defaults to a fast, JSON-capable model)
 *   temperature    — sampling temperature (default 0.7)
 *   max_tokens     — optional cap on generated tokens
 *   response_format — e.g. { type: 'json_object' } for structured output
 *   timeout        — request timeout in ms, passed as per-request options
 *                    (groq-sdk rejects `timeout` inside the request body)
 */
async function groqChat(messages, options = {}) {
  const body = {
    model: options.model || 'openai/gpt-oss-120b',
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens,
    response_format: options.response_format,
  };
  const requestOptions = {};
  if (options.timeout) requestOptions.timeout = options.timeout;

  const completion = await groq.chat.completions.create(body, requestOptions);
  return completion.choices[0]?.message?.content || '';
}

module.exports = { groqChat };