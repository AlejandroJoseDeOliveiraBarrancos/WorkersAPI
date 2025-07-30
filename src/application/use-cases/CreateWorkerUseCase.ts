import { inject, injectable } from 'inversify';
import { IWorkerRepository } from '../../domain/repositories/IWorkerRepository';
import { Worker } from '../../domain/entities/Worker';
import { TYPES } from '../di/types';

export interface CreateWorkerRequest {
  code: string;
  cedula: string;
  name: string;
  hireDate: Date;
  area: string;
  position: string;
}

export interface CreateWorkerResponse {
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
export class CreateWorkerUseCase {
  constructor(
    @inject(TYPES.WorkerRepository) private workerRepository: IWorkerRepository
  ) {}

  async execute(request: CreateWorkerRequest): Promise<CreateWorkerResponse> {
    const existingWorkerByCode = await this.workerRepository.findByCode(request.code);
    if (existingWorkerByCode) {
      throw new Error(`Worker with code ${request.code} already exists`);
    }

    const existingWorkerByCedula = await this.workerRepository.findByCedula(request.cedula);
    if (existingWorkerByCedula) {
      throw new Error(`Worker with cedula ${request.cedula} already exists`);
    }

    const worker = Worker.create(
      request.code,
      request.cedula,
      request.name,
      request.hireDate,
      request.area,
      request.position
    );

    await this.workerRepository.save(worker);

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