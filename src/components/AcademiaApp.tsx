'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MODULES, QUICK_ACTIONS, WELCOME_MESSAGE } from '@/lib/modules';
import { Message, UserProgress, Note, UserProfile, Module, SubSection } from '@/lib/types';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ChatWindow from './ChatWindow';
import ModulesView from './ModulesView';
import ProgressView from './ProgressView';

const STORAGE = {
  msgs: 'academia-msgs-v5',
  profile: 'academia-profile-v3',
  progress: 'academia-progress-v5',
  notes: 'academia-notes-v3',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function saveStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export type TabType = 'chat' | 'modules' | 'progress' | 'notes';

export default function AcademiaApp() {
  const [tab, setTab] = useState<TabType>('chat');
  const [sideTab, setSideTab] = useState<'modules' | 'notes' | 'stats'>('modules');
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [profile, setProfile] = useState<UserProfile>({ name: '' });
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [expandedMod, setExpandedMod] = useState<number | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [ready, setReady] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncMode, setSyncMode] = useState<'export' | 'import'>('export');
  const [exportCode, setExportCode] = useState('');
  const [importInput, setImportInput] = useState('');
  const [syncStatus, setSyncStatus] = useState('');
  const [sideOpen, setSideOpen] = useState(true);
  const [offlineBanner, setOfflineBanner] = useState(false);
  const [currentMode, setCurrentMode] = useState<string>('study');
  const sendingRef = useRef(false);

  // Boot
  useEffect(() => {
    const msgs = loadStorage<Message[]>(STORAGE.msgs, []);
    const prof = loadStorage<UserProfile>(STORAGE.profile, { name: '' });
    const prog = loadStorage<UserProgress>(STORAGE.progress, {});
    const nts = loadStorage<Note[]>(STORAGE.notes, []);
    setMessages(msgs.length ? msgs : [{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setProfile(prof);
    setProgress(prog);
    setNotes(nts);
    setReady(true);
    if (!prof.name) setShowNameModal(true);
    const isMobile = window.innerWidth < 768;
    setSideOpen(!isMobile);
  }, []);

  // Persist
  useEffect(() => { if (ready && messages) saveStorage(STORAGE.msgs, messages); }, [messages, ready]);
  useEffect(() => { if (ready) saveStorage(STORAGE.notes, notes); }, [notes, ready]);
  useEffect(() => { if (ready) saveStorage(STORAGE.progress, progress); }, [progress, ready]);

  // Online/offline
  useEffect(() => {
    const on = () => { setIsOnline(true); setOfflineBanner(false); };
    const off = () => { setIsOnline(false); setOfflineBanner(true); };
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    setIsOnline(navigator.onLine);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const allSubs = MODULES.flatMap(m => m.subs);
  const completedSubs = allSubs.filter(s => progress[s.id]?.done).length;
  const startedSubs = allSubs.filter(s => progress[s.id]?.started && !progress[s.id]?.done).length;
  const activeMod = activeSubId ? MODULES.find(m => m.subs.some(s => s.id === activeSubId)) : null;
  const activeSub = activeSubId ? allSubs.find(s => s.id === activeSubId) : null;

  const updateProgress = useCallback((subId: string, patch: Partial<{ started: boolean; done: boolean }>) => {
    setProgress(p => {
      const updated = { ...p, [subId]: { ...p[subId], ...patch } };
      saveStorage(STORAGE.progress, updated);
      return updated;
    });
  }, []);

  const sendMessage = useCallback(async (text: string, mode?: string) => {
    if (!text.trim() || loading || sendingRef.current) return;
    if (!isOnline) { setOfflineBanner(true); return; }
    sendingRef.current = true;
    const userMsg: Message = { role: 'user', content: text };
    const newMsgs = [...(messages ?? []), userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.slice(-20),
          studentName: profile.name || undefined,
          moduleTitle: activeMod?.title,
          sectionTitle: activeSub?.title,
          mode: mode ?? currentMode,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...(prev ?? []), { role: 'assistant', content: data.reply, model: data.model }]);
      } else {
        setMessages(prev => [...(prev ?? []), { role: 'assistant', content: `❌ ${data.error ?? 'Erro ao conectar com a IA.'}` }]);
      }
    } catch {
      setMessages(prev => [...(prev ?? []), { role: 'assistant', content: '❌ Erro de conexão. Verifique sua internet.' }]);
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  }, [loading, isOnline, messages, profile.name, activeMod, activeSub, currentMode]);

  const selectSub = useCallback(async (sub: SubSection, mod: Module) => {
    setActiveSubId(sub.id);
    setTab('chat');
    setCurrentMode('study');
    updateProgress(sub.id, { started: true });
    if (window.innerWidth < 768) setSideOpen(false);
    await sendMessage(`Seção selecionada: "${sub.title}" (${sub.desc}) — módulo "${mod.title}". Inicie a aula de forma estruturada e didática, com exemplos práticos. Ao final, faça uma pergunta para engajar.`, 'study');
  }, [sendMessage, updateProgress]);

  const saveNote = () => {
    if (!noteInput.trim()) return;
    const newNote: Note = { id: Date.now(), text: noteInput, date: new Date().toLocaleDateString('pt-BR') };
    setNotes(prev => [newNote, ...prev]);
    setNoteInput('');
  };

  const saveProfile = () => {
    const updated = { name: nameInput.trim() };
    setProfile(updated);
    saveStorage(STORAGE.profile, updated);
    setShowNameModal(false);
    if (nameInput.trim()) {
      setMessages(prev => [...(prev ?? []), { role: 'assistant', content: `Prazer em conhecer você, **${nameInput.trim()}**! 🎉 Por onde quer começar?` }]);
    }
  };

  const clearAll = () => {
    Object.values(STORAGE).forEach(k => localStorage.removeItem(k));
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setActiveSubId(null); setNotes([]); setProgress({});
  };

  const openExport = () => {
    const payload = { messages: (messages ?? []).slice(-30), progress, notes, profile, exportedAt: new Date().toISOString() };
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    setExportCode((code.match(/.{1,40}/g) ?? []).join('\n'));
    setSyncMode('export'); setSyncStatus(''); setShowSyncModal(true);
  };

  const doImport = () => {
    try {
      const clean = importInput.replace(/\s+/g, '');
      const decoded = JSON.parse(decodeURIComponent(escape(atob(clean))));
      if (!decoded.profile && !decoded.progress) throw new Error('invalid');
      if (decoded.messages) { setMessages(decoded.messages); saveStorage(STORAGE.msgs, decoded.messages); }
      if (decoded.progress) { setProgress(decoded.progress); saveStorage(STORAGE.progress, decoded.progress); }
      if (decoded.notes) { setNotes(decoded.notes); saveStorage(STORAGE.notes, decoded.notes); }
      if (decoded.profile) { setProfile(decoded.profile); saveStorage(STORAGE.profile, decoded.profile); }
      setSyncStatus('success');
      setTimeout(() => { setShowSyncModal(false); setSyncStatus(''); setImportInput(''); }, 1800);
    } catch { setSyncStatus('error'); }
  };

  if (!ready) return (
    <div className="flex h-screen bg-dark-bg items-center justify-center">
      <div className="text-center text-white/40">
        <div className="text-4xl mb-3">🎯</div>
        <div className="text-sm">Carregando academia...</div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-pop-in">
          <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-white/10 rounded-2xl p-8 w-80 text-center">
            <div className="text-5xl mb-3">🎯</div>
            <div className="text-xl font-bold text-white mb-1">Bem-vindo!</div>
            <div className="text-sm text-white/40 mb-6">Como posso te chamar? (opcional)</div>
            <input
              type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveProfile()}
              placeholder="Seu nome..."
              autoFocus
              className="w-full bg-white/7 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none mb-3 focus:border-porto-500/50"
            />
            <button onClick={saveProfile} className="w-full bg-gradient-to-r from-porto-500 to-porto-600 rounded-xl py-3 text-white font-bold text-sm hover:opacity-90 transition-opacity">
              {nameInput.trim() ? `Olá, ${nameInput}! 🚀` : 'Continuar sem nome'}
            </button>
          </div>
        </div>
      )}

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-white/10 rounded-2xl p-6 w-full max-w-sm animate-pop-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-lg font-bold text-white">📲 Sincronizar Progresso</div>
                <div className="text-xs text-white/30 mt-1">Leve seus dados para outro dispositivo</div>
              </div>
              <button onClick={() => { setShowSyncModal(false); setSyncStatus(''); setImportInput(''); }} className="text-white/30 hover:text-white transition-colors text-xl">✕</button>
            </div>
            <div className="flex gap-2 mb-5">
              {(['export', 'import'] as const).map(m => (
                <button key={m} onClick={() => { setSyncMode(m); setSyncStatus(''); }}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${syncMode === m ? 'bg-porto-500/30 border border-porto-500/60 text-porto-400' : 'bg-white/4 border border-white/8 text-white/40'}`}>
                  {m === 'export' ? '📤 Exportar' : '📥 Importar'}
                </button>
              ))}
            </div>
            {syncMode === 'export' && (
              <>
                <p className="text-xs text-white/40 mb-2">Copie o código e cole no outro dispositivo para restaurar seu progresso.</p>
                <textarea readOnly value={exportCode} className="w-full h-28 bg-black/30 border border-white/10 rounded-xl p-3 text-green-400 text-xs font-mono outline-none" />
                <button onClick={() => { navigator.clipboard.writeText(exportCode.replace(/\n/g, '')); setSyncStatus('copied'); setTimeout(() => setSyncStatus(''), 2000); }}
                  className={`w-full mt-2 rounded-xl py-3 font-bold text-sm transition-all ${syncStatus === 'copied' ? 'bg-green-500' : 'bg-porto-500'} text-white`}>
                  {syncStatus === 'copied' ? '✅ Copiado!' : '📋 Copiar código'}
                </button>
              </>
            )}
            {syncMode === 'import' && (
              <>
                <p className="text-xs text-white/40 mb-2">Cole o código gerado no outro dispositivo.</p>
                <textarea value={importInput} onChange={e => { setImportInput(e.target.value); setSyncStatus(''); }} placeholder="Cole o código aqui..."
                  className={`w-full h-28 bg-black/30 border rounded-xl p-3 text-white text-xs font-mono outline-none ${syncStatus === 'error' ? 'border-red-500/50' : 'border-white/10'}`} />
                {syncStatus === 'error' && <p className="text-xs text-red-400 mt-1">❌ Código inválido.</p>}
                {syncStatus === 'success' && <p className="text-xs text-green-400 mt-1">✅ Dados restaurados!</p>}
                <button onClick={doImport} disabled={!importInput.trim()}
                  className="w-full mt-2 bg-porto-500 disabled:bg-white/10 rounded-xl py-3 text-white font-bold text-sm transition-all">
                  📥 Restaurar dados
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col transition-all duration-300 ${sideOpen ? 'w-72 min-w-[288px]' : 'w-0 min-w-0'} overflow-hidden bg-gradient-to-b from-dark-card to-dark-bg border-r border-white/7`}>
        <Sidebar
          profile={profile}
          sideTab={sideTab}
          setSideTab={setSideTab}
          progress={progress}
          notes={notes}
          noteInput={noteInput}
          setNoteInput={setNoteInput}
          saveNote={saveNote}
          setNotes={setNotes}
          expandedMod={expandedMod}
          setExpandedMod={setExpandedMod}
          activeSubId={activeSubId}
          selectSub={selectSub}
          updateProgress={updateProgress}
          completedSubs={completedSubs}
          startedSubs={startedSubs}
          allSubsLength={allSubs.length}
          openExport={openExport}
          clearAll={clearAll}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Offline Banner */}
        {offlineBanner && (
          <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-2 text-xs text-yellow-300 text-center flex items-center justify-center gap-2">
            <span>📵</span> Você está offline. As mensagens serão enviadas ao reconectar.
            <button onClick={() => setOfflineBanner(false)} className="ml-2 text-yellow-400 font-bold">✕</button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6 bg-white/2 shrink-0">
          <button onClick={() => setSideOpen(v => !v)} className="hidden md:block text-white/40 hover:text-white transition-colors text-sm">
            <i className="fas fa-bars" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-porto-500 to-porto-700 flex items-center justify-center text-sm font-bold shrink-0">R</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-white truncate">Prof. Dr. Ricardo Mestre</div>
            <div className="text-xs text-green-400">
              {loading ? <><span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-1" />digitando...</> : '● Online'}
            </div>
          </div>
          {activeSub && (
            <div className="hidden sm:block text-xs text-white/30 text-right shrink-0">
              <div className="text-porto-400 font-medium truncate max-w-32">{activeSub.title}</div>
              <div>Seção {activeSub.id}</div>
            </div>
          )}
          <button onClick={() => setShowNameModal(true)} title="Editar perfil"
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs">
            <i className="fas fa-user" />
          </button>
        </div>

        {/* Views */}
        <div className="flex-1 overflow-hidden">
          {tab === 'chat' && (
            <ChatWindow
              messages={messages ?? []}
              loading={loading}
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              quickActions={QUICK_ACTIONS}
              currentMode={currentMode}
              setCurrentMode={setCurrentMode}
              activeSub={activeSub}
              updateProgress={updateProgress}
            />
          )}
          {tab === 'modules' && (
            <ModulesView
              progress={progress}
              expandedMod={expandedMod}
              setExpandedMod={setExpandedMod}
              activeSubId={activeSubId}
              selectSub={selectSub}
              setTab={setTab}
            />
          )}
          {tab === 'progress' && (
            <ProgressView
              progress={progress}
              notes={notes}
              noteInput={noteInput}
              setNoteInput={setNoteInput}
              saveNote={saveNote}
              setNotes={setNotes}
              completedSubs={completedSubs}
              startedSubs={startedSubs}
              updateProgress={updateProgress}
              openExport={openExport}
              clearAll={clearAll}
            />
          )}
        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}
