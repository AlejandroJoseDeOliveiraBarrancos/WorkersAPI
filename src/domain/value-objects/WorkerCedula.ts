export class WorkerCedula {
  constructor(private readonly _value: string) {
    this.ensureValidCedula(_value);
  }

  get value(): string {
    return this._value;
  }

  private ensureValidCedula(cedula: string): void {
    if (!cedula || cedula.trim().length === 0) {
      throw new Error('Worker cedula cannot be empty');
    }
    if (cedula.length < 8) {
      throw new Error('Worker cedula must be at least 8 characters long');
    }
    if (!/^\d+$/.test(cedula)) {
      throw new Error('Worker cedula must contain only numbers');
    }
  }

  static create(cedula: string): WorkerCedula {
    return new WorkerCedula(cedula.trim());
  }

  equals(other: WorkerCedula): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 