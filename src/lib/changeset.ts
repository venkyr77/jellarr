import {
  Operation,
  atomizeChangeset,
  unatomizeChangeset,
  type IChange,
  type IAtomicChange,
} from "json-diff-ts";

interface IChangeBase {
  type: Operation;
  key: string;
}

abstract class BaseChangeSetBuilder<T extends IChangeBase> {
  constructor(protected changes: T[]) {}

  protected abstract create(changes: T[]): this;

  withoutRemoves(): this {
    return this.create(
      this.changes.filter((c: IChange) => c.type !== Operation.REMOVE),
    );
  }

  withoutUpdates(): this {
    return this.create(
      this.changes.filter((c: IChange) => c.type !== Operation.UPDATE),
    );
  }

  withKey(key: string): this {
    return this.create(this.changes.filter((c: IChange) => c.key === key));
  }

  toArray(): T[] {
    return this.changes;
  }
}

export class ChangeSetBuilder extends BaseChangeSetBuilder<IChange> {
  protected create(changes: IChange[]): this {
    return new ChangeSetBuilder(changes) as this;
  }

  atomize(): AtomicChangeSetBuilder {
    return new AtomicChangeSetBuilder(atomizeChangeset(this.changes));
  }
}

export class AtomicChangeSetBuilder extends BaseChangeSetBuilder<IAtomicChange> {
  protected create(changes: IAtomicChange[]): this {
    return new AtomicChangeSetBuilder(changes) as this;
  }

  unatomize(): ChangeSetBuilder {
    return new ChangeSetBuilder(unatomizeChangeset(this.changes));
  }
}
