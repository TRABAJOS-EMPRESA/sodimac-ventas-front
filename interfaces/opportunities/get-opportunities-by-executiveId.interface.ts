export interface GetOpportunitiesByIDExecutive {
    id:              string;
    opportunityName: string;
    workDirection:   string;
    availableBudget: number;
    startDate:       Date;
    endDate:         Date;
    description:     string;
    salesMethod:     string;
    salesTeam:       string;
    client:          Client;
    executive:       Executive;
    location:        Location;
    store:           Store;
    projectType:     ProjectType;
    status:          StatusOppFather;
    contacts:        Client[];
    childs:          Child[];
}

export interface Child {
    id:              string;
    availableBudget: number;
    startDate:       Date;
    endDate:         Date;
    description:     string;
    status:          StatusOppChild;
    productLine:     ProjectType;
}

export interface ProjectType {
    id:   string;
    name: string;
}

export interface StatusOppFather {
    id:     string;
    status: StatusEnumOppFather;
}

export enum StatusEnumOppFather {
    Iniciar = "iniciar",
    Iniciada = "iniciada",
    Terminada = "terminada",
}
export interface StatusOppChild {
    id:     string;
    status: StatusEnumOppChild;
}

export enum StatusEnumOppChild {
    Inicio = "inicio",
    Cotizada = "cotizada",
    Ganada = "ganada",
    Perdida = "perdida",
}

export interface Client {
    id:    string;
    name:  string;
    email: string;
    phone: string;
    rut?:  string;
}

export interface Executive {
    id:       string;
    email:    string;
    names:    string;
    campUuid: string;
    role:     ProjectType;
}

export interface Location {
    region:  Region;
    commune: Commune;
}

export interface Commune {
    id:         string;
    name:       string;
    identifier: string;
}

export interface Region {
    id:           string;
    name:         string;
    romanNumber:  string;
    number:       string;
    abbreviation: string;
}

export interface Store {
    id:      string;
    name:    string;
    code:    number;
    region:  Region;
    commune: Commune;
}
