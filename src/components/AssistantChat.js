import React, { useMemo, useState } from 'react';
import { axiosInstance } from '../services/transportService';

const UI = {
  es: {
    title: 'Asistente CHEEMS',
    subtitle:
      'Información sobre transporte público en bus: rutas, tarifas, conductores y buses. Las respuestas usan IA y pueden contener errores.',
    placeholder: 'Escribe tu mensaje…',
    send: 'Enviar',
    clear: 'Vaciar chat',
    responseLang: 'Idioma de respuesta',
    you: 'Tú',
    assistant: 'Asistente',
    empty: 'Aún no hay mensajes. Envía una pregunta para comenzar.',
    thinking: 'Pensando…',
  },
  en: {
    title: 'CHEEMS Assistant',
    subtitle:
      'Public bus transit info: routes, fares, drivers, and buses. AI answers may contain mistakes.',
    placeholder: 'Type your message…',
    send: 'Send',
    clear: 'Clear chat',
    responseLang: 'Response language',
    you: 'You',
    assistant: 'Assistant',
    empty: 'No messages yet. Send a question to start.',
    thinking: 'Thinking…',
  },
};

function errorMessage(err) {
  const d = err.response?.data;
  if (typeof d?.detail === 'string') return d.detail;
  if (Array.isArray(d?.detail)) return d.detail.map((x) => x?.msg || String(x)).join(' ');
  if (d?.message) return d.message;
  return err.message || 'Error';
}

const AssistantChat = () => {
  const [language, setLanguage] = useState('es');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = useMemo(() => UI[language] || UI.es, [language]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/chat/', {
        messages: next,
        language,
      });
      const reply = (data?.reply || '').trim();
      if (!reply) {
        throw new Error(language === 'es' ? 'Respuesta vacía' : 'Empty reply');
      }
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(errorMessage(err));
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="card card-pad border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{t.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{t.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.responseLang}
          </span>
          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
                language === 'es'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-white'
              }`}
              onClick={() => setLanguage('es')}
            >
              ES
            </button>
            <button
              type="button"
              className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-white'
              }`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="mt-4 flex max-h-[min(420px,55vh)] flex-col rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {messages.length === 0 && (
            <p className="text-center text-sm text-slate-500">{t.empty}</p>
          )}
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.role}`}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-800'
                }`}
              >
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-80">
                  {m.role === 'user' ? t.you : t.assistant}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                {t.thinking}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <textarea
              className="min-h-[44px] flex-1 resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t.placeholder}
              disabled={loading}
              aria-label={t.placeholder}
            />
            <div className="flex gap-2 sm:w-auto">
              <button
                type="button"
                className="btn flex-1 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 sm:flex-none"
                onClick={send}
                disabled={loading || !input.trim()}
              >
                {t.send}
              </button>
              <button
                type="button"
                className="btn border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300"
                onClick={() => {
                  setMessages([]);
                  setError('');
                }}
                disabled={loading}
              >
                {t.clear}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;
