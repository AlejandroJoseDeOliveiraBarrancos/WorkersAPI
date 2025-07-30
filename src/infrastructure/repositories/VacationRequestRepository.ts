import { inject, injectable } from 'inversify';
import { Database as SQLiteDatabase } from 'sqlite3';
import { promisify } from 'util';
import { IVacationRequestRepository } from '../../domain/repositories/IVacationRequestRepository';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { VacationRequestId } from '../../domain/value-objects/VacationRequestId';
import { WorkerId } from '../../domain/value-objects/WorkerId';
import { VacationStartDate } from '../../domain/value-objects/VacationStartDate';
import { VacationEndDate } from '../../domain/value-objects/VacationEndDate';
import { VacationDays } from '../../domain/value-objects/VacationDays';
import { VacationHours } from '../../domain/value-objects/VacationHours';
import { VacationRequestStatus } from '../../domain/value-objects/VacationRequestStatus';
import { VacationRequestType } from '../../domain/value-objects/VacationRequestType';
import { VacationRequestReason } from '../../domain/value-objects/VacationRequestReason';
import { TYPES } from '../../application/di/types';
import { Database } from '../database/Database';

@injectable()
export class VacationRequestRepository implements IVacationRequestRepository {
  private db: SQLiteDatabase;

  constructor(@inject(TYPES.Database) database: Database) {
    this.db = database.getConnection();
  }

  async save(vacationRequest: VacationRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO vacation_requests 
         (id, worker_id, start_date, end_date, days, hours, type, reason, status, created_at, approved_at, rejected_at, approved_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vacationRequest.id.value,
          vacationRequest.workerId.value,
          vacationRequest.startDate.value.toISOString(),
          vacationRequest.endDate.value.toISOString(),
          vacationRequest.days.value,
          vacationRequest.hours.value,
          vacationRequest.type.value,
          vacationRequest.reason.value,
          vacationRequest.status.value,
          vacationRequest.createdAt.toISOString(),
          vacationRequest.approvedAt?.toISOString() || null,
          vacationRequest.rejectedAt?.toISOString() || null,
          vacationRequest.approvedBy || null
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async findById(id: VacationRequestId): Promise<VacationRequest | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM vacation_requests WHERE id = ?', [id.value], (err, row: any) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else resolve(this.mapRowToVacationRequest(row));
      });
    });
  }

  async findByWorkerId(workerId: WorkerId): Promise<VacationRequest[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM vacation_requests WHERE worker_id = ? ORDER BY created_at DESC', [workerId.value], (err, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows.map(row => this.mapRowToVacationRequest(row)));
      });
    });
  }

  async findByStatus(status: VacationRequestStatus): Promise<VacationRequest[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM vacation_requests WHERE status = ? ORDER BY created_at DESC', [status.value], (err, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows.map(row => this.mapRowToVacationRequest(row)));
      });
    });
  }

  async findAll(): Promise<VacationRequest[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM vacation_requests ORDER BY created_at DESC', (err, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows.map(row => this.mapRowToVacationRequest(row)));
      });
    });
  }

  async delete(id: VacationRequestId): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM vacation_requests WHERE id = ?', [id.value], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  private mapRowToVacationRequest(row: any): VacationRequest {
    const vacationRequest = new VacationRequest(
      VacationRequestId.create(row.id),
      WorkerId.create(row.worker_id),
      VacationStartDate.createFromString(row.start_date),
      VacationEndDate.createFromString(row.end_date),
      VacationDays.create(row.days),
      VacationHours.create(row.hours),
      VacationRequestType.create(row.type),
      VacationRequestReason.create(row.reason),
      VacationRequestStatus.create(row.status),
      new Date(row.created_at),
      row.approved_at ? new Date(row.approved_at) : undefined,
      row.rejected_at ? new Date(row.rejected_at) : undefined,
      row.approved_by || undefined
    );

    return vacationRequest;
  }
} 