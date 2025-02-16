export abstract class UseCaseInterface {
    abstract execute(input: any): any;
}

export abstract class UseCaseApiInterface<T> {
    abstract execute(input: any, apiType: T): any;
}
