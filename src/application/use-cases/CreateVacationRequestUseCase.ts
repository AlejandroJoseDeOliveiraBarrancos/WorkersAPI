import { inject, injectable } from 'inversify';
import { IWorkerRepository } from '../../domain/repositories/IWorkerRepository';
import { IVacationRequestRepository } from '../../domain/repositories/IVacationRequestRepository';
import { VacationCalculationService } from '../../domain/services/VacationCalculationService';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { WorkerId } from '../../domain/value-objects/WorkerId';
import { TYPES } from '../di/types';

export interface CreateVacationRequestRequest {
  workerId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  hours: number;
  type: 'days' | 'hours';
  reason: string;
}

export interface CreateVacationRequestResponse {
  id: string;
  workerId: string;
  startDate: string;
  endDate: string;
  days: number;
  hours: number;
  type: 'days' | 'hours';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  totalTimeInDays: number;
}

@injectable()
export class CreateVacationRequestUseCase {
  constructor(
    @inject(TYPES.WorkerRepository) private workerRepository: IWorkerRepository,
    @inject(TYPES.VacationRequestRepository) private vacationRequestRepository: IVacationRequestRepository,
    @inject(TYPES.VacationCalculationService) private vacationCalculationService: VacationCalculationService
  ) {}

  async execute(request: CreateVacationRequestRequest): Promise<CreateVacationRequestResponse> {
    // Verify worker exists
    const worker = await this.workerRepository.findById(WorkerId.create(request.workerId));
    if (!worker) {
      throw new Error(`Worker with id ${request.workerId} not found`);
    }

    // Get existing vacation requests for this worker
    const existingRequests = await this.vacationRequestRepository.findByWorkerId(worker.id);

    // Check if worker has enough vacation days
    const requestedDays = request.type === 'days' ? request.days : request.hours / 8;
    if (!this.vacationCalculationService.canRequestVacation(worker, existingRequests, requestedDays)) {
      throw new Error('Worker does not have enough available vacation days');
    }

    // Validate date range
    if (request.startDate >= request.endDate) {
      throw new Error('Start date must be before end date');
    }

    const vacationRequest = VacationRequest.create(
      request.workerId,
      request.startDate,
      request.endDate,
      request.days,
      request.hours,
      request.type,
      request.reason
    );

    await this.vacationRequestRepository.save(vacationRequest);

    return {
      id: vacationRequest.id.value,
      workerId: vacationRequest.workerId.value,
      startDate: vacationRequest.startDate.value.toISOString(),
      endDate: vacationRequest.endDate.value.toISOString(),
      days: vacationRequest.days.value,
      hours: vacationRequest.hours.value,
      type: vacationRequest.type.value,
      reason: vacationRequest.reason.value,
      status: vacationRequest.status.value,
      createdAt: vacationRequest.createdAt.toISOString(),
      totalTimeInDays: vacationRequest.totalTimeInDays
    };
  }
} 