export abstract class FactoryApi<T> {
    abstract create(input: any): T;
}
