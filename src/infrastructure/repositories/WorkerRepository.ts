import { inject, injectable } from 'inversify';
import { Database as SQLiteDatabase } from 'sqlite3';
import { promisify } from 'util';
import { IWorkerRepository } from '../../domain/repositories/IWorkerRepository';
import { Worker } from '../../domain/entities/Worker';
import { WorkerId } from '../../domain/value-objects/WorkerId';
import { WorkerCode } from '../../domain/value-objects/WorkerCode';
import { WorkerName } from '../../domain/value-objects/WorkerName';
import { WorkerCedula } from '../../domain/value-objects/WorkerCedula';
import { WorkerArea } from '../../domain/value-objects/WorkerArea';
import { WorkerPosition } from '../../domain/value-objects/WorkerPosition';
import { HireDate } from '../../domain/value-objects/HireDate';
import { TYPES } from '../../application/di/types';
import { Database } from '../database/Database';

@injectable()
export class WorkerRepository implements IWorkerRepository {
  private db: SQLiteDatabase;

  constructor(@inject(TYPES.Database) database: Database) {
    this.db = database.getConnection();
  }

  async save(worker: Worker): Promise<void> {
    const now = new Date().toISOString();

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO workers (id, code, cedula, name, hire_date, area, position, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          worker.id.value,
          worker.code.value,
          worker.cedula.value,
          worker.name.value,
          worker.hireDate.value.toISOString(),
          worker.area.value,
          worker.position.value,
          now,
          now
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async findById(id: WorkerId): Promise<Worker | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM workers WHERE id = ?', [id.value], (err, row: any) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          resolve(new Worker(
            WorkerId.create(row.id),
            WorkerCode.create(row.code),
            WorkerCedula.create(row.cedula),
            WorkerName.create(row.name),
            HireDate.createFromString(row.hire_date),
            WorkerArea.create(row.area),
            WorkerPosition.create(row.position)
          ));
        }
      });
    });
  }

  async findByCode(code: string): Promise<Worker | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM workers WHERE code = ?', [code], (err, row: any) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          resolve(new Worker(
            WorkerId.create(row.id),
            WorkerCode.create(row.code),
            WorkerCedula.create(row.cedula),
            WorkerName.create(row.name),
            HireDate.createFromString(row.hire_date),
            WorkerArea.create(row.area),
            WorkerPosition.create(row.position)
          ));
        }
      });
    });
  }

  async findByCedula(cedula: string): Promise<Worker | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM workers WHERE cedula = ?', [cedula], (err, row: any) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          resolve(new Worker(
            WorkerId.create(row.id),
            WorkerCode.create(row.code),
            WorkerCedula.create(row.cedula),
            WorkerName.create(row.name),
            HireDate.createFromString(row.hire_date),
            WorkerArea.create(row.area),
            WorkerPosition.create(row.position)
          ));
        }
      });
    });
  }

  async findAll(): Promise<Worker[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM workers ORDER BY name', (err, rows: any[]) => {
        if (err) reject(err);
        else {
          resolve(rows.map(row => new Worker(
            WorkerId.create(row.id),
            WorkerCode.create(row.code),
            WorkerCedula.create(row.cedula),
            WorkerName.create(row.name),
            HireDate.createFromString(row.hire_date),
            WorkerArea.create(row.area),
            WorkerPosition.create(row.position)
          )));
        }
      });
    });
  }

  async delete(id: WorkerId): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM workers WHERE id = ?', [id.value], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
} 