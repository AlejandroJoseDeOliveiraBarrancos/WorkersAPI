import { inject, injectable } from 'inversify';
import { IWorkerRepository } from '../../domain/repositories/IWorkerRepository';
import { IVacationRequestRepository } from '../../domain/repositories/IVacationRequestRepository';
import { VacationCalculationService, VacationBalance } from '../../domain/services/VacationCalculationService';
import { WorkerId } from '../../domain/value-objects/WorkerId';
import { TYPES } from '../di/types';

export interface GetWorkerVacationBalanceResponse {
  workerId: string;
  workerName: string;
  seniorityYears: number;
  vacationBalance: VacationBalance;
}

@injectable()
export class GetWorkerVacationBalanceUseCase {
  constructor(
    @inject(TYPES.WorkerRepository) private workerRepository: IWorkerRepository,
    @inject(TYPES.VacationRequestRepository) private vacationRequestRepository: IVacationRequestRepository,
    @inject(TYPES.VacationCalculationService) private vacationCalculationService: VacationCalculationService
  ) {}

  async execute(workerId: string): Promise<GetWorkerVacationBalanceResponse> {
    const worker = await this.workerRepository.findById(WorkerId.create(workerId));
    
    if (!worker) {
      throw new Error(`Worker with id ${workerId} not found`);
    }

    const vacationRequests = await this.vacationRequestRepository.findByWorkerId(worker.id);
    const vacationBalance = this.vacationCalculationService.calculateVacationBalance(worker, vacationRequests);

    return {
      workerId: worker.id.value,
      workerName: worker.name.value,
      seniorityYears: worker.seniorityYears,
      vacationBalance
    };
  }
} 