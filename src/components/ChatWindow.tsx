'use client';
import { useRef, useEffect } from 'react';
import { Message, SubSection, UserProgress } from '@/lib/types';

function Markdown({ text }: { text: string }) {
  return (
    <div className="leading-relaxed">
      {text.split('\n').map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="my-0.5">
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className="text-white font-700">{part.slice(2, -2)}</strong>
                : <span key={j}>{part}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

interface Props {
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: (v: string) => void;
  sendMessage: (text: string, mode?: string) => void;
  quickActions: { label: string; msg: string; mode: string }[];
  currentMode: string;
  setCurrentMode: (m: string) => void;
  activeSub: SubSection | null;
  updateProgress: (subId: string, patch: Partial<{ started: boolean; done: boolean }>) => void;
}

export default function ChatWindow({
  messages, loading, input, setInput, sendMessage,
  quickActions, currentMode, setCurrentMode, activeSub, updateProgress,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (input.trim()) sendMessage(input, currentMode);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mode selector + section badge */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/1 shrink-0 overflow-x-auto">
        {[
          { id: 'study', label: '📚 Estudar', color: 'porto' },
          { id: 'roleplay', label: '🎭 Roleplay', color: 'purple' },
          { id: 'quiz', label: '🧪 Quiz', color: 'green' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setCurrentMode(m.id)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              currentMode === m.id
                ? m.id === 'study' ? 'bg-porto-500/30 border-porto-500/60 text-porto-400'
                  : m.id === 'roleplay' ? 'bg-purple-500/30 border-purple-500/60 text-purple-400'
                  : 'bg-green-500/30 border-green-500/60 text-green-400'
                : 'bg-white/4 border-white/8 text-white/30 hover:text-white/60'
            }`}
          >
            {m.label}
          </button>
        ))}
        {activeSub && (
          <div className="ml-auto shrink-0 flex items-center gap-2">
            <span className="text-xs text-white/25 truncate max-w-40">{activeSub.title}</span>
            <button
              onClick={() => updateProgress(activeSub.id, { done: true })}
              title="Marcar como concluída"
              className="text-xs bg-green-500/15 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full hover:bg-green-500/25 transition-all"
            >
              ✓ Concluir
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => { setCurrentMode(qa.mode); sendMessage(qa.msg, qa.mode); }}
                className="text-left bg-white/3 hover:bg-white/7 border border-white/7 hover:border-porto-500/30 rounded-xl p-3 text-xs text-white/60 hover:text-white/90 transition-all"
              >
                {qa.label}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fade-up ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-porto-500 to-porto-700 flex items-center justify-center text-xs font-bold shrink-0 mt-1">R</div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-porto-500 text-white rounded-tr-sm'
                  : 'bg-white/5 border border-white/8 text-white/90 rounded-tl-sm'
              }`}
            >
              {msg.role === 'assistant' ? <Markdown text={msg.content} /> : <p>{msg.content}</p>}
              {msg.model === 'deepseek' && (
                <div className="mt-1 text-xs text-white/25">via Deepseek</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-porto-500 to-porto-700 flex items-center justify-center text-xs font-bold shrink-0">R</div>
            <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/6 bg-dark-bg shrink-0 pb-safe md:pb-3"
        style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="flex gap-2 items-end">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={
              currentMode === 'roleplay' ? 'Fale com o cliente...'
              : currentMode === 'quiz' ? 'Responda a pergunta...'
              : 'Sua mensagem para o Professor...'
            }
            className="flex-1 bg-white/6 border border-white/12 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-porto-500/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-porto-500 disabled:bg-white/10 disabled:text-white/20 text-white flex items-center justify-center hover:bg-porto-600 active:scale-95 transition-all shrink-0"
          >
            <i className="fas fa-paper-plane text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
