import { Container } from 'inversify';
import { TYPES } from './types';

import { IWorkerRepository } from '../../domain/repositories/IWorkerRepository';
import { IVacationRequestRepository } from '../../domain/repositories/IVacationRequestRepository';
import { WorkerRepository } from '../../infrastructure/repositories/WorkerRepository';
import { VacationRequestRepository } from '../../infrastructure/repositories/VacationRequestRepository';

import { VacationCalculationService } from '../../domain/services/VacationCalculationService';

import { CreateWorkerUseCase } from '../use-cases/CreateWorkerUseCase';
import { GetWorkerUseCase } from '../use-cases/GetWorkerUseCase';
import { GetAllWorkersUseCase } from '../use-cases/GetAllWorkersUseCase';
import { CreateVacationRequestUseCase } from '../use-cases/CreateVacationRequestUseCase';
import { ApproveVacationRequestUseCase } from '../use-cases/ApproveVacationRequestUseCase';
import { RejectVacationRequestUseCase } from '../use-cases/RejectVacationRequestUseCase';
import { GetWorkerVacationBalanceUseCase } from '../use-cases/GetWorkerVacationBalanceUseCase';

import { WorkerController } from '../../presentation/controllers/WorkerController';
import { VacationRequestController } from '../../presentation/controllers/VacationRequestController';

import { Database } from '../../infrastructure/database/Database';

const container = new Container();

container.bind<Database>(TYPES.Database).to(Database).inSingletonScope();

container.bind<IWorkerRepository>(TYPES.WorkerRepository).to(WorkerRepository);
container.bind<IVacationRequestRepository>(TYPES.VacationRequestRepository).to(VacationRequestRepository);

container.bind<VacationCalculationService>(TYPES.VacationCalculationService).to(VacationCalculationService);

container.bind<CreateWorkerUseCase>(TYPES.CreateWorkerUseCase).to(CreateWorkerUseCase);
container.bind<GetWorkerUseCase>(TYPES.GetWorkerUseCase).to(GetWorkerUseCase);
container.bind<GetAllWorkersUseCase>(TYPES.GetAllWorkersUseCase).to(GetAllWorkersUseCase);
container.bind<CreateVacationRequestUseCase>(TYPES.CreateVacationRequestUseCase).to(CreateVacationRequestUseCase);
container.bind<ApproveVacationRequestUseCase>(TYPES.ApproveVacationRequestUseCase).to(ApproveVacationRequestUseCase);
container.bind<RejectVacationRequestUseCase>(TYPES.RejectVacationRequestUseCase).to(RejectVacationRequestUseCase);
container.bind<GetWorkerVacationBalanceUseCase>(TYPES.GetWorkerVacationBalanceUseCase).to(GetWorkerVacationBalanceUseCase);

container.bind<WorkerController>(TYPES.WorkerController).to(WorkerController);
container.bind<VacationRequestController>(TYPES.VacationRequestController).to(VacationRequestController);

export { container }; 
