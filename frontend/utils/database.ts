import * as SecureStore from 'expo-secure-store';
import { type SQLiteDatabase } from 'expo-sqlite';
import { Message, Role } from './interfaces';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 3;
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
        createdAt TEXT DEFAULT (datetime('now')),
        isFixed INTEGER DEFAULT 0,
        user_id TEXT
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

    currentDbVersion = 3;
  }
  
  if (currentDbVersion === 1) {
    await db.execAsync(`
      ALTER TABLE chats ADD COLUMN isFixed INTEGER DEFAULT 0;
    `);
    currentDbVersion = 2;
  }

  if (currentDbVersion === 2) {
    await db.execAsync(`
      ALTER TABLE chats ADD COLUMN user_id TEXT;
    `);
    currentDbVersion = 3;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export const addChat = async (db: SQLiteDatabase, title: string, id: number, type: string, userId?: string | null) => {
  if (await SecureStore.getItemAsync('settings.saveConversations') === 'false') {return;}
  const createdAt = new Date().toISOString();
  return await db.runAsync('INSERT OR IGNORE INTO chats (id, title, type, createdAt, user_id) VALUES (?, ?, ?, ?, ?)', id, title, type, createdAt, userId || null);
};

export const getChats = async (db: SQLiteDatabase, userId?: string | null) => {
  try {
    let query = 'SELECT * FROM chats';
    let params: any[] = [];
    
    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    } else {
      // Si no hay userId, mostrar solo chats sin usuario (legacy o modo incógnito)
      query += ' WHERE user_id IS NULL';
    }
    
    query += ' ORDER BY isFixed DESC, createdAt DESC';
    
    const rows = await db.getAllAsync<{
      id: number;
      title: string;
      type: string;
      createdAt: string;
      isFixed: number;
      user_id: string | null;
    }>(query, params);
    
    return rows.map((row) => ({
      ...row,
      isFixed: row.isFixed === 1,
    }));
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

export const deleteChat = async (db: SQLiteDatabase, chatId: number) => {
  try {
    await db.runAsync('DELETE FROM chats WHERE id = ?', chatId);
    console.log('Chat eliminado:', chatId);
  } catch (e) {
    console.error('deleteChat failed', e);
    throw e;
  }
};

export const togglePinChat = async (db: SQLiteDatabase, chatId: number, isFixed: boolean) => {
  try {
    await db.runAsync('UPDATE chats SET isFixed = ? WHERE id = ?', isFixed ? 1 : 0, chatId);
    console.log('Chat pin toggled:', chatId, isFixed);
  } catch (e) {
    console.error('togglePinChat failed', e);
    throw e;
  }
};

export const deleteDatabase = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`DROP TABLE IF EXISTS messages; DROP TABLE IF EXISTS chats;`);
    await db.execAsync(`PRAGMA user_version = 0;`);
  } catch (e) {
    console.warn('deleteDatabase failed', e);
    throw e;
  }
};

export const deleteUserChats = async (db: SQLiteDatabase, userId?: string | null) => {
  try {
    if (userId) {
      // Eliminar solo los chats del usuario específico
      await db.runAsync('DELETE FROM chats WHERE user_id = ?', userId);
      console.log('User chats deleted for userId:', userId);
    } else {
      // Si no hay userId, eliminar solo chats sin usuario asociado (legacy)
      await db.runAsync('DELETE FROM chats WHERE user_id IS NULL');
      console.log('Legacy chats deleted');
    }
  } catch (e) {
    console.error('deleteUserChats failed', e);
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