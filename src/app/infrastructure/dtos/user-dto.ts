export interface UserTO {
    id: string
    userName: string
    email: string
    token: string
    idSocial: string
    verified: boolean
    profileTO: ProfileTO
    publicProfile: PublicProfile
}

export interface ProfileTO {
    id: number
    name: string
    lastName: string
    country: string
    city: string
    state: string
    birthDate: string
    profileImage: string
    friendshipStatus: any
    username: string
}

export interface PublicProfile {
    id: string
    name: string
    description: string
    user: User
    createdAt: string
    followers: any[]
}

export interface User {
    id: string
    userName: string
    profileTO: ProfileTO
}


