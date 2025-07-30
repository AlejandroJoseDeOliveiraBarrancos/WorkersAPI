import { inject, injectable } from 'inversify';
import { IWorkerRepository } from '../../domain/repositories/IWorkerRepository';
import { WorkerId } from '../../domain/value-objects/WorkerId';
import { TYPES } from '../di/types';

export interface GetWorkerResponse {
  id: string;
  code: string;
  cedula: string;
  name: string;
  hireDate: string;
  area: string;
  position: string;
  seniorityYears: number;
}

@injectable()
export class GetWorkerUseCase {
  constructor(
    @inject(TYPES.WorkerRepository) private workerRepository: IWorkerRepository
  ) {}

  async execute(workerId: string): Promise<GetWorkerResponse> {
    const worker = await this.workerRepository.findById(WorkerId.create(workerId));
    
    if (!worker) {
      throw new Error(`Worker with id ${workerId} not found`);
    }

    return {
      id: worker.id.value,
      code: worker.code.value,
      cedula: worker.cedula.value,
      name: worker.name.value,
      hireDate: worker.hireDate.value.toISOString(),
      area: worker.area.value,
      position: worker.position.value,
      seniorityYears: worker.seniorityYears
    };
  }
} 