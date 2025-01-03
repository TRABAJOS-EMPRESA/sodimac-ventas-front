export interface VerifyToken {
    user:  User;
    token: string;
}

export interface User {
    id:        string;
    email:     string;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
}
