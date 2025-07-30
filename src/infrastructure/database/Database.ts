import { Database as SQLiteDatabase } from 'sqlite3';
import { promisify } from 'util';

export class Database {
  private db: SQLiteDatabase;

  constructor() {
    this.db = new SQLiteDatabase(':memory:');
  }

  async initialize(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    const all = promisify(this.db.all.bind(this.db));

    await run(`
      CREATE TABLE IF NOT EXISTS workers (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        cedula TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        hire_date TEXT NOT NULL,
        area TEXT NOT NULL,
        position TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS vacation_requests (
        id TEXT PRIMARY KEY,
        worker_id TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        days INTEGER NOT NULL,
        hours INTEGER NOT NULL,
        type TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        approved_at TEXT,
        rejected_at TEXT,
        approved_by TEXT,
        FOREIGN KEY (worker_id) REFERENCES workers (id)
      )
    `);

    await run('CREATE INDEX IF NOT EXISTS idx_workers_code ON workers (code)');
    await run('CREATE INDEX IF NOT EXISTS idx_workers_cedula ON workers (cedula)');
    await run('CREATE INDEX IF NOT EXISTS idx_vacation_requests_worker_id ON vacation_requests (worker_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_vacation_requests_status ON vacation_requests (status)');
  }

  getConnection(): SQLiteDatabase {
    return this.db;
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
} 