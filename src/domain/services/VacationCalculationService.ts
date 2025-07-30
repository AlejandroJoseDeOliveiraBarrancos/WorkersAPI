import { Worker } from '../entities/Worker';
import { VacationRequest } from '../entities/VacationRequest';

export interface VacationBalance {
  totalDays: number;
  usedDays: number;
  availableDays: number;
  pendingDays: number;
}

export class VacationCalculationService {
  private readonly BASE_VACATION_DAYS = 15;
  private readonly MAX_VACATION_DAYS = 30;
  private readonly SENIORITY_BONUS_DAYS = 1;

  calculateVacationBalance(worker: Worker, vacationRequests: VacationRequest[]): VacationBalance {
    const totalDays = this.calculateTotalVacationDays(worker);
    const usedDays = this.calculateUsedVacationDays(vacationRequests);
    const pendingDays = this.calculatePendingVacationDays(vacationRequests);
    const availableDays = totalDays - usedDays - pendingDays;

    return {
      totalDays,
      usedDays,
      availableDays: Math.max(0, availableDays),
      pendingDays
    };
  }

  private calculateTotalVacationDays(worker: Worker): number {
    const seniorityYears = worker.seniorityYears;
    const baseDays = this.BASE_VACATION_DAYS;
    const seniorityBonus = Math.min(seniorityYears * this.SENIORITY_BONUS_DAYS, this.MAX_VACATION_DAYS - baseDays);
    
    return Math.min(baseDays + seniorityBonus, this.MAX_VACATION_DAYS);
  }

  private calculateUsedVacationDays(vacationRequests: VacationRequest[]): number {
    return vacationRequests
      .filter(request => request.status.value === 'approved')
      .reduce((total, request) => total + request.totalTimeInDays, 0);
  }

  private calculatePendingVacationDays(vacationRequests: VacationRequest[]): number {
    return vacationRequests
      .filter(request => request.status.value === 'pending')
      .reduce((total, request) => total + request.totalTimeInDays, 0);
  }

  canRequestVacation(worker: Worker, vacationRequests: VacationRequest[], requestedDays: number): boolean {
    const balance = this.calculateVacationBalance(worker, vacationRequests);
    return balance.availableDays >= requestedDays;
  }
} 