import { Profile } from "../../domain/entities/profile.entity";


export interface RegisterUserInputDto {
    confirmPassword: string;
    email: string;
    idSocial: string;
    lastName: string;
    name: string;
    password: string;
    profileImage: string;
    userName: string;

}

export interface RegisterUserOutputDto {
    id: string;
    userName: string;
    email: string;
    password: string;
    token: string;
    idToken: string;
    idSocial: string;
    verified: boolean;
    profile: Profile;
}
