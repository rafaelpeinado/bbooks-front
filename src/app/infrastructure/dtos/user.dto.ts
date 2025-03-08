export interface UserTO {
    id: string;
    userName: string;
    email: string;
    token: string;
    idSocial: string;
    verified: boolean;
    profile: ProfileTO;
    publicProfile: PublicProfile;
}

export interface ProfileTO {
    id: string;
    name: string;
    lastName: string;
    country: string;
    city: string;
    state: string;
    birthDate: string;
    profileImage: string;
    friendshipStatus: any;
    username: string;
}

export interface PublicProfile {
    id: string;
    name: string;
    description: string;
    user: User;
    createdAt: Date;
    followers: any[];
}

interface User {
    id: string;
    userName: string;
    profile: ProfileTO;
}

export interface RegisterTO {
    name: string
    lastName: string
    email: string
    userName: string
    password: string
    confirmPassword: string
    idSocial: string
    profileImage: string
}


