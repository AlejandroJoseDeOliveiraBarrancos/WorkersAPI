import { Entity } from './Entity';
import { VacationRequestId } from '../value-objects/VacationRequestId';
import { WorkerId } from '../value-objects/WorkerId';
import { VacationStartDate } from '../value-objects/VacationStartDate';
import { VacationEndDate } from '../value-objects/VacationEndDate';
import { VacationDays } from '../value-objects/VacationDays';
import { VacationHours } from '../value-objects/VacationHours';
import { VacationRequestStatus } from '../value-objects/VacationRequestStatus';
import { VacationRequestType } from '../value-objects/VacationRequestType';
import { VacationRequestReason } from '../value-objects/VacationRequestReason';

export class VacationRequest extends Entity<VacationRequestId> {
  constructor(
    id: VacationRequestId,
    private readonly _workerId: WorkerId,
    private readonly _startDate: VacationStartDate,
    private readonly _endDate: VacationEndDate,
    private readonly _days: VacationDays,
    private readonly _hours: VacationHours,
    private readonly _type: VacationRequestType,
    private readonly _reason: VacationRequestReason,
    private _status: VacationRequestStatus,
    private readonly _createdAt: Date,
    private _approvedAt?: Date,
    private _rejectedAt?: Date,
    private _approvedBy?: string
  ) {
    super(id);
  }

  get workerId(): WorkerId {
    return this._workerId;
  }

  get startDate(): VacationStartDate {
    return this._startDate;
  }

  get endDate(): VacationEndDate {
    return this._endDate;
  }

  get days(): VacationDays {
    return this._days;
  }

  get hours(): VacationHours {
    return this._hours;
  }

  get type(): VacationRequestType {
    return this._type;
  }

  get reason(): VacationRequestReason {
    return this._reason;
  }

  get status(): VacationRequestStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get approvedAt(): Date | undefined {
    return this._approvedAt;
  }

  get rejectedAt(): Date | undefined {
    return this._rejectedAt;
  }

  get approvedBy(): string | undefined {
    return this._approvedBy;
  }

  approve(approvedBy: string): void {
    if (this._status.value !== 'pending') {
      throw new Error('Only pending requests can be approved');
    }
    this._status = VacationRequestStatus.create('approved');
    this._approvedAt = new Date();
    this._approvedBy = approvedBy;
  }

  reject(approvedBy: string): void {
    if (this._status.value !== 'pending') {
      throw new Error('Only pending requests can be rejected');
    }
    this._status = VacationRequestStatus.create('rejected');
    this._rejectedAt = new Date();
    this._approvedBy = approvedBy;
  }

  get totalTimeInDays(): number {
    if (this._type.value === 'days') {
      return this._days.value;
    } else {
      return this._hours.value / 8;
    }
  }

  static create(
    workerId: string,
    startDate: Date,
    endDate: Date,
    days: number,
    hours: number,
    type: 'days' | 'hours',
    reason: string
  ): VacationRequest {
    return new VacationRequest(
      VacationRequestId.generate(),
      WorkerId.create(workerId),
      VacationStartDate.create(startDate),
      VacationEndDate.create(endDate),
      VacationDays.create(days),
      VacationHours.create(hours),
      VacationRequestType.create(type),
      VacationRequestReason.create(reason),
      VacationRequestStatus.create('pending'),
      new Date()
    );
  }

  toJSON() {
    return {
      id: this.id.value,
      workerId: this._workerId.value,
      startDate: this._startDate.value.toISOString(),
      endDate: this._endDate.value.toISOString(),
      days: this._days.value,
      hours: this._hours.value,
      type: this._type.value,
      reason: this._reason.value,
      status: this._status.value,
      createdAt: this._createdAt.toISOString(),
      approvedAt: this._approvedAt?.toISOString(),
      rejectedAt: this._rejectedAt?.toISOString(),
      approvedBy: this._approvedBy,
      totalTimeInDays: this.totalTimeInDays
    };
  }
} 
