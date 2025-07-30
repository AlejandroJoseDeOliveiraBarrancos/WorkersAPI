import { Entity } from './Entity';
import { WorkerId } from '../value-objects/WorkerId';
import { WorkerCode } from '../value-objects/WorkerCode';
import { WorkerName } from '../value-objects/WorkerName';
import { WorkerCedula } from '../value-objects/WorkerCedula';
import { WorkerArea } from '../value-objects/WorkerArea';
import { WorkerPosition } from '../value-objects/WorkerPosition';
import { HireDate } from '../value-objects/HireDate';

export class Worker extends Entity<WorkerId> {
  constructor(
    id: WorkerId,
    private readonly _code: WorkerCode,
    private readonly _cedula: WorkerCedula,
    private readonly _name: WorkerName,
    private readonly _hireDate: HireDate,
    private readonly _area: WorkerArea,
    private readonly _position: WorkerPosition
  ) {
    super(id);
  }

  get code(): WorkerCode {
    return this._code;
  }

  get cedula(): WorkerCedula {
    return this._cedula;
  }

  get name(): WorkerName {
    return this._name;
  }

  get hireDate(): HireDate {
    return this._hireDate;
  }

  get area(): WorkerArea {
    return this._area;
  }

  get position(): WorkerPosition {
    return this._position;
  }

  get seniorityYears(): number {
    const currentDate = new Date();
    const hireDate = this._hireDate.value;
    const diffTime = Math.abs(currentDate.getTime() - hireDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 365);
  }

  static create(
    code: string,
    cedula: string,
    name: string,
    hireDate: Date,
    area: string,
    position: string
  ): Worker {
    return new Worker(
      WorkerId.generate(),
      WorkerCode.create(code),
      WorkerCedula.create(cedula),
      WorkerName.create(name),
      HireDate.create(hireDate),
      WorkerArea.create(area),
      WorkerPosition.create(position)
    );
  }

  toJSON() {
    return {
      id: this.id.value,
      code: this._code.value,
      cedula: this._cedula.value,
      name: this._name.value,
      hireDate: this._hireDate.value.toISOString(),
      area: this._area.value,
      position: this._position.value,
      seniorityYears: this.seniorityYears
    };
  }
} 