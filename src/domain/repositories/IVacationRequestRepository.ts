import { VacationRequest } from '../entities/VacationRequest';
import { VacationRequestId } from '../value-objects/VacationRequestId';
import { WorkerId } from '../value-objects/WorkerId';
import { VacationRequestStatus } from '../value-objects/VacationRequestStatus';

export interface IVacationRequestRepository {
  save(vacationRequest: VacationRequest): Promise<void>;
  findById(id: VacationRequestId): Promise<VacationRequest | null>;
  findByWorkerId(workerId: WorkerId): Promise<VacationRequest[]>;
  findByStatus(status: VacationRequestStatus): Promise<VacationRequest[]>;
  findAll(): Promise<VacationRequest[]>;
  delete(id: VacationRequestId): Promise<void>;
} 