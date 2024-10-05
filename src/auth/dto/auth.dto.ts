export class AuthDto {
    email: string
    password: string
}

export class CreateAccountDto {
    email: string
    password: string
    name: string
    profilePicture: string
    phoneNumber: string
    bio: string
}