export const TYPES = {
  WorkerRepository: Symbol.for('WorkerRepository'),
  VacationRequestRepository: Symbol.for('VacationRequestRepository'),
  
  VacationCalculationService: Symbol.for('VacationCalculationService'),
  
  CreateWorkerUseCase: Symbol.for('CreateWorkerUseCase'),
  GetWorkerUseCase: Symbol.for('GetWorkerUseCase'),
  GetAllWorkersUseCase: Symbol.for('GetAllWorkersUseCase'),
  CreateVacationRequestUseCase: Symbol.for('CreateVacationRequestUseCase'),
  ApproveVacationRequestUseCase: Symbol.for('ApproveVacationRequestUseCase'),
  RejectVacationRequestUseCase: Symbol.for('RejectVacationRequestUseCase'),
  GetWorkerVacationBalanceUseCase: Symbol.for('GetWorkerVacationBalanceUseCase'),
  
  WorkerController: Symbol.for('WorkerController'),
  VacationRequestController: Symbol.for('VacationRequestController'),
  
  Database: Symbol.for('Database')
}; 
