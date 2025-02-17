import { LoginType } from "../enums/login-type.enum";

export interface Login {
    email: string;
    password: string;
    loginType: LoginType;
    keepLogin: boolean;
    token: string;
}
