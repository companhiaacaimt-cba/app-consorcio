'use client';
import { MODULES } from '@/lib/modules';
import { Module, SubSection, UserProgress, Note } from '@/lib/types';

const NIVEL_STYLE = {
  'Iniciante':     'bg-green-500/15 text-green-400',
  'Intermediário': 'bg-yellow-500/15 text-yellow-400',
  'Avançado':      'bg-red-500/15 text-red-400',
};

interface Props {
  profile: { name: string };
  sideTab: 'modules' | 'notes' | 'stats';
  setSideTab: (t: 'modules' | 'notes' | 'stats') => void;
  progress: UserProgress;
  notes: Note[];
  noteInput: string;
  setNoteInput: (v: string) => void;
  saveNote: () => void;
  setNotes: (fn: (prev: Note[]) => Note[]) => void;
  expandedMod: number | null;
  setExpandedMod: (id: number | null) => void;
  activeSubId: string | null;
  selectSub: (sub: SubSection, mod: Module) => void;
  updateProgress: (subId: string, patch: Partial<{ started: boolean; done: boolean }>) => void;
  completedSubs: number;
  startedSubs: number;
  allSubsLength: number;
  openExport: () => void;
  clearAll: () => void;
}

export default function Sidebar({
  profile, sideTab, setSideTab, progress, notes, noteInput, setNoteInput,
  saveNote, setNotes, expandedMod, setExpandedMod, activeSubId,
  selectSub, updateProgress, completedSubs, startedSubs, allSubsLength,
  openExport, clearAll,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-porto-500 to-porto-700 flex items-center justify-center text-sm font-bold shrink-0">🎯</div>
          <div>
            <div className="text-sm font-bold text-white">Academia Consórcio</div>
            <div className="text-xs text-porto-400">Porto Seguro</div>
          </div>
        </div>
        {profile.name && (
          <div className="mt-3 bg-porto-500/10 border border-porto-500/20 rounded-lg px-3 py-2">
            <div className="text-xs text-porto-400/70">Aluno</div>
            <div className="text-sm font-semibold text-white truncate">{profile.name}</div>
          </div>
        )}
        {/* Sidebar Tabs */}
        <div className="flex gap-1 mt-3">
          {([['modules', '📚 Módulos'], ['notes', '📝 Notas'], ['stats', '📊 Stats']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setSideTab(id)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${sideTab === id ? 'bg-porto-500/30 text-porto-400' : 'text-white/30 hover:text-white/60'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* MODULES TAB */}
        {sideTab === 'modules' && (
          <div className="p-2 space-y-1">
            {MODULES.map(mod => {
              const isExp = expandedMod === mod.id;
              const doneCount = mod.subs.filter(s => progress[s.id]?.done).length;
              const pct = Math.round((doneCount / mod.subs.length) * 100);
              return (
                <div key={mod.id} className="rounded-xl overflow-hidden border border-white/5">
                  <button
                    onClick={() => setExpandedMod(isExp ? null : mod.id)}
                    className={`w-full text-left p-3 flex items-center gap-2 transition-all ${isExp ? 'bg-porto-500/15' : 'bg-white/2 hover:bg-white/5'}`}
                  >
                    <span className="text-lg shrink-0">{mod.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold truncate ${isExp ? 'text-porto-400' : 'text-white/75'}`}>{mod.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${NIVEL_STYLE[mod.nivel]}`}>{mod.nivel}</span>
                        <div className="flex-1 h-1 bg-white/7 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct === 100 ? 'bg-green-400' : 'bg-porto-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-white/20">{doneCount}/{mod.subs.length}</span>
                      </div>
                    </div>
                    <span className={`text-xs text-white/20 transition-transform duration-200 ${isExp ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {isExp && (
                    <div className="bg-black/15 border-t border-white/5">
                      {mod.subs.map(sub => {
                        const isDone = progress[sub.id]?.done;
                        const isAct = activeSubId === sub.id;
                        const isStarted = progress[sub.id]?.started;
                        return (
                          <button key={sub.id} onClick={() => selectSub(sub, mod)}
                            className={`w-full flex items-center gap-0 text-left border-b border-white/4 last:border-0 hover:bg-porto-500/10 transition-all ${isAct ? 'bg-porto-500/15' : ''}`}>
                            <div className={`w-0.5 self-stretch ${isDone ? 'bg-green-400' : isAct ? 'bg-porto-500' : isStarted ? 'bg-porto-500/40' : 'bg-white/6'}`} />
                            <div className="flex-1 flex items-center gap-2 px-3 py-2">
                              <span className="text-xs">{isDone ? '✅' : sub.icon}</span>
                              <span className={`text-xs font-medium flex-1 truncate ${isDone ? 'text-green-400' : isAct ? 'text-porto-400' : 'text-white/55'}`}>
                                <span className="text-white/15">{sub.id} </span>{sub.title}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NOTES TAB */}
        {sideTab === 'notes' && (
          <div className="p-3 space-y-2">
            <div className="flex gap-2">
              <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote(); } }}
                placeholder="Nova anotação... (Enter salva)"
                rows={2}
                className="flex-1 bg-white/5 border border-white/9 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none resize-none focus:border-porto-500/50"
              />
              <button onClick={saveNote} className="bg-porto-500/70 hover:bg-porto-500 text-white rounded-xl px-3 font-bold text-base transition-colors">+</button>
            </div>
            {notes.length === 0 && <div className="text-xs text-white/18 text-center py-6">Nenhuma anotação</div>}
            {notes.map(n => (
              <div key={n.id} className="bg-white/4 border border-white/7 rounded-xl px-3 py-2">
                <div className="text-xs text-white/70">{n.text}</div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-white/20">{n.date}</span>
                  <button onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))} className="text-xs text-white/20 hover:text-red-400">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STATS TAB */}
        {sideTab === 'stats' && (
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Concluídas', val: completedSubs, color: 'text-green-400' },
                { label: 'Em andamento', val: startedSubs, color: 'text-porto-400' },
                { label: 'Total', val: allSubsLength, color: 'text-white/40' },
                { label: 'Progresso', val: `${Math.round((completedSubs / allSubsLength) * 100)}%`, color: completedSubs === allSubsLength ? 'text-green-400' : 'text-porto-400' },
              ].map(s => (
                <div key={s.label} className="bg-white/4 border border-white/7 rounded-xl p-3 text-center">
                  <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                  <div className="text-xs text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="h-1 bg-white/7 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-porto-500 to-green-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.round((completedSubs / allSubsLength) * 100)}%` }} />
            </div>
            <button onClick={openExport} className="w-full bg-porto-500/15 border border-porto-500/30 rounded-xl py-2 text-porto-400 text-xs font-semibold hover:bg-porto-500/25 transition-all">📲 Exportar progresso</button>
            <button onClick={clearAll} className="w-full bg-white/3 border border-white/7 rounded-xl py-2 text-white/22 text-xs hover:text-red-400 hover:border-red-500/20 transition-all">🗑 Limpar tudo</button>
            <div className="text-xs text-white/12 text-center pt-1">Lei 11.795/2008 · Banco Central do Brasil</div>
          </div>
        )}
      </div>
    </div>
  );
}
