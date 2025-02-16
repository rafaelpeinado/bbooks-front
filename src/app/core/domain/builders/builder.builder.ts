abstract class Builder<T, K extends Builder<T, K>> {
    abstract copyFrom(entity: T): K;
    abstract build(): T;
}

export class BuilderImpl<T, K extends BuilderImpl<T, K>> extends Builder<T, K> {

    protected constructor() {
        super();
    }
    protected _entity: Partial<T> = {};

    static builder(): any {
        throw new Error('Each builder must implement its own builder() method.');
    }

    protected set<Key extends keyof T>(key: Key, value: T[Key]): K {
        this._entity[key] = value;
        return this as unknown as K;
    }

    copyFrom(entity: T): K  {
        if (entity) {
            Object.assign(this._entity, entity);
        }
        return this as unknown as K;
    }

    build(): T {
        return this._entity as T;
    }
}
