import React, { useMemo, useState } from 'react';
import { axiosInstance } from '../services/transportService';
import {
  INSTITUTIONAL_DECLARATION,
  INSTITUTIONAL_PILLARS,
  INSTITUTIONAL_UI,
} from '../constants/institutionalFramework';

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
    empty: 'También puedes usar el módulo reflexivo o escribir tu consulta sobre transporte.',
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
    empty: 'You can also use the reflective module or type your transit question.',
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
  const [philosophyOpen, setPhilosophyOpen] = useState(true);

  const t = useMemo(() => UI[language] || UI.es, [language]);
  const inst = useMemo(() => INSTITUTIONAL_UI[language] || INSTITUTIONAL_UI.es, [language]);
  const declaration = INSTITUTIONAL_DECLARATION[language] || INSTITUTIONAL_DECLARATION.es;
  const pillars = INSTITUTIONAL_PILLARS[language] || INSTITUTIONAL_PILLARS.es;

  const postChat = async (nextMessages) => {
    const { data } = await axiosInstance.post('/chat/', {
      messages: nextMessages,
      language,
    });
    const reply = (data?.reply || '').trim();
    if (!reply) {
      throw new Error(language === 'es' ? 'Respuesta vacía' : 'Empty reply');
    }
    return reply;
  };

  const sendWithMessages = async (next) => {
    setMessages(next);
    setError('');
    setLoading(true);
    try {
      const reply = await postChat(next);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(errorMessage(err));
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setInput('');
    await sendWithMessages(next);
  };

  const sendReflective = async (prompt) => {
    if (loading) return;
    const userMsg = { role: 'user', content: prompt };
    await sendWithMessages([...messages, userMsg]);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="card card-pad">
      <div className="glass-card-header flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="card-title text-xl font-bold">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(56,189,248,0.4)] text-white">✨</span>
            {t.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">{t.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {t.responseLang}:
          </span>
          <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1 backdrop-blur-xl">
            <button
              type="button"
              className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                language === 'es'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_10px_rgba(14,165,233,0.4)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => setLanguage('es')}
            >
              ES
            </button>
            <button
              type="button"
              className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_10px_rgba(14,165,233,0.4)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Sección informativa / filosofía orientadora */}
      <section
        className="mt-4 rounded-3xl border border-indigo-200 dark:border-indigo-400/25 bg-indigo-50/70 dark:bg-gradient-to-br dark:from-indigo-950/40 dark:via-slate-900/40 dark:to-slate-950/40 backdrop-blur-xl p-4 shadow-glass transition-all"
        aria-labelledby="philosophy-heading"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 id="philosophy-heading" className="text-sm font-bold text-indigo-900 dark:text-sky-200 flex items-center gap-2">
              <span>🏛️</span> {inst.philosophyTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">{inst.philosophyIntro}</p>
          </div>
          <button
            type="button"
            className="shrink-0 text-xs font-semibold text-indigo-600 dark:text-sky-400 hover:text-indigo-800 dark:hover:text-sky-300 transition-colors"
            onClick={() => setPhilosophyOpen((o) => !o)}
            aria-expanded={philosophyOpen}
          >
            {philosophyOpen ? inst.hidePhilosophy : inst.showPhilosophy}
          </button>
        </div>
        {philosophyOpen && (
          <div className="mt-3 pt-3 border-t border-indigo-200/60 dark:border-white/10">
            <blockquote className="border-l-2 border-indigo-500 dark:border-sky-400 pl-3 text-xs sm:text-sm italic leading-relaxed text-slate-800 dark:text-slate-200">
              &ldquo;{declaration}&rdquo;
            </blockquote>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-sky-300">
              {inst.pillarsTitle}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2" role="list">
              {pillars.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-indigo-300/60 dark:border-sky-400/30 bg-white/80 dark:bg-sky-500/10 px-3 py-1 text-xs font-medium text-indigo-900 dark:text-sky-200 backdrop-blur-md shadow-sm"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Módulo reflexivo */}
      <section className="mt-4 rounded-3xl border border-slate-200 dark:border-white/15 bg-slate-50/80 dark:bg-white/5 backdrop-blur-xl p-4 shadow-glass" aria-labelledby="reflective-heading">
        <h3 id="reflective-heading" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>💡</span> {inst.reflectiveTitle}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{inst.reflectiveHint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {inst.reflectivePrompts.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={loading}
              className="rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/60 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-glass-sm hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-white transition-all disabled:opacity-50"
              onClick={() => sendReflective(item.prompt)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div
          className="mt-4 p-3 rounded-2xl border border-rose-400/30 bg-rose-500/20 text-xs text-rose-700 dark:text-rose-200"
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="mt-4 flex max-h-[min(480px,60vh)] flex-col rounded-3xl border border-slate-200 dark:border-white/15 bg-slate-50/70 dark:bg-slate-950/60 backdrop-blur-2xl overflow-hidden shadow-glass-lg">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {/* Institutional Welcome */}
          <div className="flex justify-start">
            <div className="max-w-[90%] sm:max-w-[80%] rounded-3xl border border-sky-300/60 dark:border-sky-400/30 bg-white/90 dark:bg-gradient-to-br dark:from-sky-950/50 dark:to-slate-900/80 p-4 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 backdrop-blur-xl shadow-glass">
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                <span>🤖</span> {inst.welcomeLabel}
              </div>
              <div className="text-slate-600 dark:text-slate-300">{inst.welcomeBody}</div>
            </div>
          </div>

          {messages.length === 0 && (
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-6">{t.empty}</p>
          )}

          {messages.map((m, i) => (
            <div
              key={`${i}-${m.role}`}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-glass ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border border-white/25 rounded-tr-none'
                    : 'bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-slate-200 rounded-tl-none backdrop-blur-xl'
                }`}
              >
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {m.role === 'user' ? `👤 ${t.you}` : `✨ ${t.assistant}`}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/80 px-4 py-3 text-xs sm:text-sm text-sky-600 dark:text-sky-300 flex items-center gap-2 backdrop-blur-xl shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
                <span>{t.thinking}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-slate-900/80 backdrop-blur-xl p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <textarea
              className="min-h-[46px] flex-1 resize-y field text-xs sm:text-sm"
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
                className="btn-primary flex-1 sm:flex-none text-xs"
                onClick={send}
                disabled={loading || !input.trim()}
              >
                {t.send} 🚀
              </button>
              <button
                type="button"
                className="btn-secondary text-xs"
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
