import { ApiType } from "../domain/enums/api-type.enum";

export abstract class UseCaseInterface {
    abstract execute(input: any): any;
}

export abstract class UseCaseApiInterface {
    abstract execute(input: any, apiType: ApiType): any;
}
