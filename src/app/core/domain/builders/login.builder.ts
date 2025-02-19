import { Login } from '../entities/login.entity';
import { LoginType } from '../enums/login-type.enum';
import { BuilderImpl } from './builder.builder';

export class LoginBuilder extends BuilderImpl<Login, LoginBuilder> {

    static builder() { return new this(); }

    setEmail(email: string): LoginBuilder { return this.set('email', email); }
    setPassword(password: string): LoginBuilder { return this.set('password', password); }
    setLoginType(loginType: LoginType): LoginBuilder { return this.set('loginType', loginType); }
    setKeepLogin(keepLogin: boolean): LoginBuilder { return this.set('keepLogin', keepLogin); }
    setToken(token: string): LoginBuilder { return this.set('token', token); }
}
