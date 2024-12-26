export type Role = 'ADMIN' | 'LIBRARIAN' | 'USER';


export interface LoginRequest {
    email: string;
    password: string;
}



export interface LoginResponse {
    token: string;
    user: User;
}

export interface SignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role; 
}

export interface PasswordReset {
    token: string;
    password: string;
}

export interface PasswordChange {
    oldPassword: string;
    newPassword: string;
}

export interface ForgotPassword {
    email: string;
}