#!/usr/bin/env node
'use strict';

/**
 * Octavious local server
 * -----------------------
 * - Serves OCTAVIOUS_INTERACTIVE_APPLICATION.html
 * - Reads/writes API keys to a local .env file (never sent anywhere but the
 *   provider you choose)
 * - Proxies the Song Key Lookup feature to whichever provider is active, so
 *   your API key never has to sit in the browser or in page source
 *
 * Requires Node.js 18+ (for global fetch). No npm install needed.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 8787;
const ROOT = __dirname;
const HTML_FILE = path.join(ROOT, 'OCTAVIOUS_INTERACTIVE_APPLICATION.html');
const ENV_FILE = path.join(ROOT, '.env');

const PROVIDER_KEYS = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
  groq: 'GROQ_API_KEY',
  gemini: 'GEMINI_API_KEY',
};

// ---------------- .env handling (no dependencies) ----------------

function readEnvFile() {
  const env = {};
  if (fs.existsSync(ENV_FILE)) {
    const raw = fs.readFileSync(ENV_FILE, 'utf8');
    raw.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    });
  }
  return env;
}

function writeEnvFile(env) {
  const lines = Object.entries(env)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${v}`);
  fs.writeFileSync(ENV_FILE, lines.join('\n') + '\n', 'utf8');
}

function getState() {
  const env = readEnvFile();
  const providers = {};
  for (const [name, envKey] of Object.entries(PROVIDER_KEYS)) {
    providers[name] = Boolean(env[envKey] && env[envKey].length > 0);
  }
  const active =
    env.ACTIVE_PROVIDER && PROVIDER_KEYS[env.ACTIVE_PROVIDER] ? env.ACTIVE_PROVIDER : null;
  return { env, providers, active };
}

// ---------------- Provider calls ----------------

const SYSTEM_PROMPT =
  'You find the musical key of songs. If you have live web search available, use it. ' +
  'Respond with ONLY a single JSON object and nothing else - no markdown fences, no ' +
  'commentary, no text before or after. Shape exactly: ' +
  '{"song":string,"artist":string|null,"root":string|null,"quality":"major"|"minor"|null,"source":string|null}. ' +
  '"root" must be one of: C, C#, D, D#, E, F, F#, G, G#, A, A#, B (sharps only, no flats, ' +
  'no extra characters). If sources disagree, use the most commonly cited key. If no reliable ' +
  'key can be found, set root and quality to null.';

function extractJson(text) {
  const cleaned = String(text || '').replace(/```json|```/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in the model response');
  return JSON.parse(match[0]);
}

async function callAnthropic(apiKey, query) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Find the musical key of this song: ${query}` }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  return extractJson(text);
}

async function callOpenAI(apiKey, query) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      instructions: SYSTEM_PROMPT,
      input: `Find the musical key of this song: ${query}`,
      tools: [{ type: 'web_search_preview' }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text =
    data.output_text ||
    (data.output || [])
      .flatMap((item) => (item.content || []).filter((c) => c.type === 'output_text').map((c) => c.text))
      .join('\n');
  return extractJson(text);
}

async function callGroq(apiKey, query) {
  // Groq's hosted models don't include a built-in web search tool, so this
  // answers from the model's training knowledge only. Fine for well-known
  // songs, less reliable for very recent or obscure ones.
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            SYSTEM_PROMPT +
            ' Note: you do not have live web search here - answer from what you already know, ' +
            'and if you are not confident, set root and quality to null rather than guessing.',
        },
        { role: 'user', content: `Find the musical key of this song: ${query}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  return extractJson(text);
}

async function callGemini(apiKey, query) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: `Find the musical key of this song: ${query}` }] }],
        tools: [{ google_search: {} }],
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('\n');
  return extractJson(text);
}

const PROVIDER_CALLERS = {
  anthropic: callAnthropic,
  openai: callOpenAI,
  groq: callGroq,
  gemini: callGemini,
};

// ---------------- HTTP server ----------------

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
      const html = fs.readFileSync(HTML_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (req.method === 'GET' && req.url === '/api/config') {
      const { providers, active } = getState();
      sendJson(res, 200, { providers, active });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/save-key') {
      const body = await readBody(req);
      const { provider, apiKey, setActive } = body;
      if (!PROVIDER_KEYS[provider]) {
        sendJson(res, 400, { error: 'Unknown provider' });
        return;
      }
      const { env } = getState();
      if (apiKey) {
        env[PROVIDER_KEYS[provider]] = apiKey;
      } else {
        delete env[PROVIDER_KEYS[provider]];
      }
      if (setActive) {
        env.ACTIVE_PROVIDER = provider;
      }
      writeEnvFile(env);
      const state = getState();
      sendJson(res, 200, { ok: true, providers: state.providers, active: state.active });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/lookup') {
      const body = await readBody(req);
      const query = (body.query || '').trim();
      if (!query) {
        sendJson(res, 400, { error: 'Missing query' });
        return;
      }
      const { env, providers, active } = getState();
      const provider = body.provider && PROVIDER_KEYS[body.provider] ? body.provider : active;
      if (!provider || !providers[provider]) {
        sendJson(res, 400, {
          error: 'No API key configured for the selected provider. Add one in API Settings.',
        });
        return;
      }
      const apiKey = env[PROVIDER_KEYS[provider]];
      const caller = PROVIDER_CALLERS[provider];
      const result = await caller(apiKey, query);
      sendJson(res, 200, { ...result, provider });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: err.message || 'Server error' });
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('');
  console.log('  🎸🎹 Octavious is live at ' + url);
  console.log('  Press Ctrl+C to stop.');
  console.log('');

  const platform = process.platform;
  const cmd =
    platform === 'win32'
      ? `start "" "${url}"`
      : platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;

  exec(cmd, (err) => {
    if (err) {
      console.log(`  Couldn't open your browser automatically — visit ${url} manually.`);
    }
  });
});
