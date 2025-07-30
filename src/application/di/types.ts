export const TYPES = {
  // Repositories
  WorkerRepository: Symbol.for('WorkerRepository'),
  VacationRequestRepository: Symbol.for('VacationRequestRepository'),
  
  // Services
  VacationCalculationService: Symbol.for('VacationCalculationService'),
  
  // Use Cases
  CreateWorkerUseCase: Symbol.for('CreateWorkerUseCase'),
  GetWorkerUseCase: Symbol.for('GetWorkerUseCase'),
  GetAllWorkersUseCase: Symbol.for('GetAllWorkersUseCase'),
  CreateVacationRequestUseCase: Symbol.for('CreateVacationRequestUseCase'),
  ApproveVacationRequestUseCase: Symbol.for('ApproveVacationRequestUseCase'),
  RejectVacationRequestUseCase: Symbol.for('RejectVacationRequestUseCase'),
  GetWorkerVacationBalanceUseCase: Symbol.for('GetWorkerVacationBalanceUseCase'),
  
  // Controllers
  WorkerController: Symbol.for('WorkerController'),
  VacationRequestController: Symbol.for('VacationRequestController'),
  
  // Database
  Database: Symbol.for('Database')
}; 