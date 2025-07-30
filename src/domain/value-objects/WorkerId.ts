import { v4 as uuidv4 } from 'uuid';

export class WorkerId {
  constructor(private readonly _value: string) {
    this.ensureValidId(_value);
  }

  get value(): string {
    return this._value;
  }

  private ensureValidId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('Worker ID cannot be empty');
    }
  }

  static create(id: string): WorkerId {
    return new WorkerId(id);
  }

  static generate(): WorkerId {
    return new WorkerId(uuidv4());
  }

  equals(other: WorkerId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 