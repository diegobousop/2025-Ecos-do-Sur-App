import { type SQLiteDatabase } from 'expo-sqlite';
import { Message, Role } from './interfaces';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY NOT NULL, 
        title TEXT NOT NULL,
        type TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY NOT NULL, 
        chat_id INTEGER NOT NULL, 
        content TEXT NOT NULL, 
        imageUrl TEXT, 
        role TEXT, 
        prompt TEXT, 
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      );
    `);

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export const addChat = async (db: SQLiteDatabase, title: string, id: number, type: string) => {
  const createdAt = new Date().toISOString();
  return await db.runAsync('INSERT OR IGNORE INTO chats (id, title, type, createdAt) VALUES (?, ?, ?, ?)', id, title, type, createdAt);
};

export const getChats = async (db: SQLiteDatabase) => {
  try {
    return await db.getAllAsync('SELECT * FROM chats ORDER BY createdAt DESC');
  } catch (error) {
    console.warn('getChats failed (tabla no existe o error):', error);
    return [];
  }
};

export const addMessage = async (
  db: SQLiteDatabase,
  chatId: number,
  { content, role, imageUrl, prompt }: Message
) => {
  return await db.runAsync(
    'INSERT INTO messages (chat_id, content, role, imageUrl, prompt) VALUES (?, ?, ?, ?, ?)',
    chatId,
    content,
    role === Role.Bot ? 'bot' : role === Role.BotHeader ? 'botHeader' : 'user',
    imageUrl || '',
    prompt || ''
  );
};

export const getMessages = async (db: SQLiteDatabase, chatId: number): Promise<Message[]> => {
  const rows = await db.getAllAsync<{
    id: number;
    chat_id: number;
    content: string;
    imageUrl: string | null;
    role: string | null;
    prompt: string | null;
  }>('SELECT id, chat_id, content, imageUrl, role, prompt FROM messages WHERE chat_id = ? ORDER BY id ASC', chatId);
  return rows.map((row) => {
    const mappedRole = row.role === 'bot' 
      ? Role.Bot 
      : row.role === 'botHeader' 
        ? Role.BotHeader 
        : Role.User;
    return {
      id: `db_${row.id}`,
      role: mappedRole,
      content: row.content,
      imageUrl: row.imageUrl || undefined,
      prompt: row.prompt || undefined,
    };
  });
};

export const changeChatTitle = async (db: SQLiteDatabase, chatId: number, newTitle: string) => {
  await db.runAsync(
    "UPDATE chats SET title = ?, createdAt = datetime('now') WHERE id = ?",
    newTitle,
    chatId
  );
}

export const addType = async (db: SQLiteDatabase, chatId: number, type: string) => {
  await db.runAsync('UPDATE chats SET type = ? WHERE id = ?', type, chatId);
}

export const deleteDatabase = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`DROP TABLE IF EXISTS messages; DROP TABLE IF EXISTS chats;`);
    await db.execAsync(`PRAGMA user_version = 0;`);
  } catch (e) {
    console.warn('deleteDatabase failed', e);
    throw e;
  }
};

export const createDatabase = async (db: SQLiteDatabase) => {
  try {
    await migrateDbIfNeeded(db);
  } catch (e) {
    console.warn('createDatabase failed', e);
    throw e;
  }
}