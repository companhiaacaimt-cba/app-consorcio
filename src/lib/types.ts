export type NivelType = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface SubSection {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface Module {
  id: number;
  icon: string;
  title: string;
  nivel: NivelType;
  desc: string;
  subs: SubSection[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: 'claude' | 'deepseek';
}

export interface ProgressEntry {
  started: boolean;
  done: boolean;
}

export interface UserProgress {
  [sectionId: string]: ProgressEntry;
}

export interface Note {
  id: number;
  text: string;
  date: string;
}

export interface UserProfile {
  name: string;
}
