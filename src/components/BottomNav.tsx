'use client';
import { TabType } from './AcademiaApp';

interface Props {
  tab: TabType;
  setTab: (t: TabType) => void;
}

export default function BottomNav({ tab, setTab }: Props) {
  const items: { id: TabType; icon: string; label: string }[] = [
    { id: 'chat',     icon: 'fa-comment-dots', label: 'Professor' },
    { id: 'modules',  icon: 'fa-book-open',    label: 'Módulos'   },
    { id: 'progress', icon: 'fa-chart-line',   label: 'Progresso' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card/90 border-t border-white/8"
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex">
        {items.map(item => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="flex-1 flex flex-col items-center justify-center pt-2 pb-3 gap-1 transition-all relative"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-porto-500" />
              )}
              <i className={`fas ${item.icon} text-lg transition-colors ${active ? 'text-porto-400' : 'text-white/30'}`} />
              <span className={`text-xs font-medium transition-colors ${active ? 'text-porto-400' : 'text-white/25'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
