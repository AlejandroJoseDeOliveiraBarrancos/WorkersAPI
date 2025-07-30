import { inject, injectable } from 'inversify';
import { IVacationRequestRepository } from '../../domain/repositories/IVacationRequestRepository';
import { VacationRequestId } from '../../domain/value-objects/VacationRequestId';
import { TYPES } from '../di/types';

export interface RejectVacationRequestRequest {
  vacationRequestId: string;
  rejectedBy: string;
}

export interface RejectVacationRequestResponse {
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
  rejectedAt: string;
  rejectedBy: string;
  totalTimeInDays: number;
}

@injectable()
export class RejectVacationRequestUseCase {
  constructor(
    @inject(TYPES.VacationRequestRepository) private vacationRequestRepository: IVacationRequestRepository
  ) {}

  async execute(request: RejectVacationRequestRequest): Promise<RejectVacationRequestResponse> {
    const vacationRequest = await this.vacationRequestRepository.findById(
      VacationRequestId.create(request.vacationRequestId)
    );

    if (!vacationRequest) {
      throw new Error(`Vacation request with id ${request.vacationRequestId} not found`);
    }

    vacationRequest.reject(request.rejectedBy);

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
      rejectedAt: vacationRequest.rejectedAt!.toISOString(),
      rejectedBy: vacationRequest.approvedBy!,
      totalTimeInDays: vacationRequest.totalTimeInDays
    };
  }
} 