export interface GetRoleResp {
    id:       string;
    email:    string;
    names:    string;
    campUuid: string;
    role:     Role;
}

export interface Role {
    id: string;
    name: string
}
