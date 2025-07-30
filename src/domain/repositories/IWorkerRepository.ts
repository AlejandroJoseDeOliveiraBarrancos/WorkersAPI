import { Worker } from '../entities/Worker';
import { WorkerId } from '../value-objects/WorkerId';

export interface IWorkerRepository {
  save(worker: Worker): Promise<void>;
  findById(id: WorkerId): Promise<Worker | null>;
  findByCode(code: string): Promise<Worker | null>;
  findByCedula(cedula: string): Promise<Worker | null>;
  findAll(): Promise<Worker[]>;
  delete(id: WorkerId): Promise<void>;
} 