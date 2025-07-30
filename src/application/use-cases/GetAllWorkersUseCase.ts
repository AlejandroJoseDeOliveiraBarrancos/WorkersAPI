import { inject, injectable } from 'inversify';
import { IWorkerRepository } from '../../domain/repositories/IWorkerRepository';
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
export class GetAllWorkersUseCase {
  constructor(
    @inject(TYPES.WorkerRepository) private workerRepository: IWorkerRepository
  ) {}

  async execute(): Promise<GetWorkerResponse[]> {
    const workers = await this.workerRepository.findAll();
    
    return workers.map(worker => ({
      id: worker.id.value,
      code: worker.code.value,
      cedula: worker.cedula.value,
      name: worker.name.value,
      hireDate: worker.hireDate.value.toISOString(),
      area: worker.area.value,
      position: worker.position.value,
      seniorityYears: worker.seniorityYears
    }));
  }
} 