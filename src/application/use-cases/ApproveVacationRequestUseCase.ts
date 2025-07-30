import { inject, injectable } from 'inversify';
import { IVacationRequestRepository } from '../../domain/repositories/IVacationRequestRepository';
import { VacationRequestId } from '../../domain/value-objects/VacationRequestId';
import { TYPES } from '../di/types';

export interface ApproveVacationRequestRequest {
  vacationRequestId: string;
  approvedBy: string;
}

export interface ApproveVacationRequestResponse {
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
  approvedAt: string;
  approvedBy: string;
  totalTimeInDays: number;
}

@injectable()
export class ApproveVacationRequestUseCase {
  constructor(
    @inject(TYPES.VacationRequestRepository) private vacationRequestRepository: IVacationRequestRepository
  ) {}

  async execute(request: ApproveVacationRequestRequest): Promise<ApproveVacationRequestResponse> {
    const vacationRequest = await this.vacationRequestRepository.findById(
      VacationRequestId.create(request.vacationRequestId)
    );

    if (!vacationRequest) {
      throw new Error(`Vacation request with id ${request.vacationRequestId} not found`);
    }

    vacationRequest.approve(request.approvedBy);

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
      approvedAt: vacationRequest.approvedAt!.toISOString(),
      approvedBy: vacationRequest.approvedBy!,
      totalTimeInDays: vacationRequest.totalTimeInDays
    };
  }
} 