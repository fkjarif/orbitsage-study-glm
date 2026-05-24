import Dexie, { type EntityTable } from 'dexie';

interface Setting {
  key: string;
  value: string;
}

interface Message {
  id?: number;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string;
  timestamp: number;
}

const db = new Dexie('OrbitSageDB') as Dexie & {
  settings: EntityTable<Setting, 'key'>;
  messages: EntityTable<Message, 'id'>;
};

db.version(1).stores({
  settings: 'key',
  messages: '++id, chatId, timestamp',
});

export { db };
export type { Message, Setting };
