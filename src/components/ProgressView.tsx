'use client';
import { MODULES } from '@/lib/modules';
import { Note, UserProgress } from '@/lib/types';

interface Props {
  progress: UserProgress;
  notes: Note[];
  noteInput: string;
  setNoteInput: (v: string) => void;
  saveNote: () => void;
  setNotes: (fn: (prev: Note[]) => Note[]) => void;
  completedSubs: number;
  startedSubs: number;
  updateProgress: (subId: string, patch: Partial<{ started: boolean; done: boolean }>) => void;
  openExport: () => void;
  clearAll: () => void;
}

export default function ProgressView({
  progress, notes, noteInput, setNoteInput, saveNote, setNotes,
  completedSubs, startedSubs, updateProgress, openExport, clearAll,
}: Props) {
  const allSubs = MODULES.flatMap(m => m.subs);
  const totalSubs = allSubs.length;

  return (
    <div className="h-full overflow-y-auto px-4 py-4 pb-24 md:pb-4 space-y-5">
      {/* Stats */}
      <div>
        <div className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Meu Progresso</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Em andamento', val: startedSubs, color: 'text-porto-400' },
            { label: 'Concluídas', val: completedSubs, color: 'text-green-400' },
            { label: 'Total seções', val: totalSubs, color: 'text-white/40' },
          ].map(s => (
            <div key={s.label} className="bg-white/4 border border-white/7 rounded-xl p-3 text-center">
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Per-module progress */}
        <div className="space-y-3">
          {MODULES.map(mod => {
            const done = mod.subs.filter(s => progress[s.id]?.done).length;
            const pct = Math.round((done / mod.subs.length) * 100);
            return (
              <div key={mod.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-white/65 font-medium">{mod.icon} {mod.title}</span>
                  <span className={`text-xs font-semibold ${pct === 100 ? 'text-green-400' : 'text-porto-400'}`}>{done}/{mod.subs.length}</span>
                </div>
                <div className="h-1.5 bg-white/7 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-porto-500 to-porto-400'}`}
                    style={{ width: `${pct}%` }} />
                </div>
                {mod.subs.map(sub => {
                  const st = progress[sub.id];
                  if (!st?.started) return null;
                  return (
                    <div key={sub.id} className="flex items-center gap-2 py-1 px-1">
                      <span className="text-xs">{st.done ? '✅' : '🔄'}</span>
                      <span className={`text-xs flex-1 ${st.done ? 'text-green-400' : 'text-white/45'}`}>{sub.title}</span>
                      {st.started && !st.done && (
                        <button onClick={() => updateProgress(sub.id, { done: true })}
                          className="text-xs bg-green-500/12 border border-green-500/25 text-green-400 px-2 py-0.5 rounded hover:bg-green-500/20 transition-all">
                          ✓ Concluir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Minhas Anotações</div>
        <div className="flex gap-2 mb-3">
          <textarea
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote(); } }}
            placeholder="Anote algo importante... (Enter salva)"
            rows={2}
            className="flex-1 bg-white/5 border border-white/9 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-porto-500/50 resize-none"
          />
          <button onClick={saveNote} className="bg-porto-500/70 hover:bg-porto-500 text-white rounded-xl px-4 font-bold text-lg transition-colors shrink-0">+</button>
        </div>
        {notes.length === 0 && <div className="text-xs text-white/18 text-center py-4">Nenhuma anotação ainda</div>}
        <div className="space-y-2">
          {notes.map(n => (
            <div key={n.id} className="bg-white/4 border border-white/7 rounded-xl px-3 py-2">
              <div className="text-sm text-white/75 leading-relaxed">{n.text}</div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-white/20">{n.date}</span>
                <button onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))}
                  className="text-xs text-white/20 hover:text-red-400 transition-colors">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pb-2">
        <button onClick={openExport} className="w-full bg-porto-500/15 border border-porto-500/30 rounded-xl py-2.5 text-porto-400 text-sm font-semibold hover:bg-porto-500/25 transition-all">
          📲 Exportar / Importar progresso
        </button>
        <button onClick={clearAll} className="w-full bg-white/3 border border-white/7 rounded-xl py-2 text-white/22 text-xs hover:text-red-400 hover:border-red-500/20 transition-all">
          🗑 Limpar todo o histórico
        </button>
        <div className="text-xs text-white/12 text-center">Lei 11.795/2008 · Banco Central do Brasil</div>
      </div>
    </div>
  );
}
