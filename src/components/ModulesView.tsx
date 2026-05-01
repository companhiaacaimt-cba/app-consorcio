'use client';
import { MODULES } from '@/lib/modules';
import { Module, SubSection, UserProgress } from '@/lib/types';
import { TabType } from './AcademiaApp';

const NIVEL_STYLE = {
  'Iniciante':     'bg-green-500/15 text-green-400',
  'Intermediário': 'bg-yellow-500/15 text-yellow-400',
  'Avançado':      'bg-red-500/15 text-red-400',
};

interface Props {
  progress: UserProgress;
  expandedMod: number | null;
  setExpandedMod: (id: number | null) => void;
  activeSubId: string | null;
  selectSub: (sub: SubSection, mod: Module) => void;
  setTab: (t: TabType) => void;
}

export default function ModulesView({ progress, expandedMod, setExpandedMod, activeSubId, selectSub, setTab }: Props) {
  return (
    <div className="h-full overflow-y-auto px-4 py-4 pb-24 md:pb-4 space-y-2">
      <div className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Trilha de Treinamento</div>
      {MODULES.map(mod => {
        const isExp = expandedMod === mod.id;
        const doneCount = mod.subs.filter(s => progress[s.id]?.done).length;
        const pct = Math.round((doneCount / mod.subs.length) * 100);
        return (
          <div key={mod.id} className="rounded-xl overflow-hidden border border-white/6">
            <button
              onClick={() => setExpandedMod(isExp ? null : mod.id)}
              className={`w-full text-left p-3 flex items-center gap-3 transition-all ${isExp ? 'bg-porto-500/15' : 'bg-white/3 hover:bg-white/5'}`}
            >
              <span className="text-xl shrink-0">{mod.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${isExp ? 'text-porto-400' : 'text-white/80'}`}>{mod.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${NIVEL_STYLE[mod.nivel]}`}>{mod.nivel}</span>
                  <span className="text-xs text-white/25">{mod.subs.length} seções</span>
                  {doneCount > 0 && <span className="text-xs text-green-400">{doneCount}✓</span>}
                </div>
                <div className="mt-1.5 h-1 bg-white/7 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-porto-500 to-porto-400'}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className={`text-xs text-white/25 transition-transform duration-200 shrink-0 ${isExp ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {isExp && (
              <div className="bg-black/20 border-t border-white/5">
                {mod.subs.map((sub, idx) => {
                  const isDone = progress[sub.id]?.done;
                  const isAct = activeSubId === sub.id;
                  const isStarted = progress[sub.id]?.started;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => { selectSub(sub, mod); setTab('chat'); }}
                      className={`w-full flex items-center gap-0 text-left transition-all hover:bg-porto-500/15 ${isAct ? 'bg-porto-500/20' : ''} ${idx < mod.subs.length - 1 ? 'border-b border-white/4' : ''}`}
                    >
                      <div className={`w-0.5 self-stretch shrink-0 transition-colors ${isDone ? 'bg-green-400' : isAct ? 'bg-porto-500' : isStarted ? 'bg-porto-500/40' : 'bg-white/6'}`} />
                      <div className="flex-1 flex items-start gap-2 p-2.5">
                        <span className="text-sm mt-0.5 shrink-0">{isDone ? '✅' : sub.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold leading-tight ${isDone ? 'text-green-400' : isAct ? 'text-porto-400' : 'text-white/70'}`}>
                            <span className="text-white/20 mr-1">{sub.id}</span>{sub.title}
                          </div>
                          <div className="text-xs text-white/25 mt-0.5 leading-tight">{sub.desc}</div>
                        </div>
                        <span className="text-xs shrink-0 mt-1">
                          {isDone ? <span className="text-green-400">✓</span>
                          : isStarted ? <span className="text-porto-400">▶</span>
                          : <span className="text-white/15">›</span>}
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
  );
}
