export interface GetOpportunity {
    id:              string;
    executive:       Executive;
    opportunityName: string;
    workDirection:   string;
    location:        Location;
    projectType:     string;
    availableBudget: number;
    store:           Store;
    startDate:       number;
    endDate:         number;
    description:     string;
    contacts:        Client[];
    client:          Client;
    status:          Status;
    salesTeam:       string;
    salesMethod:     string;
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
    role:     string;
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

export interface Status {
    id:     string;
    status: string;
}

export interface Store {
    id:   string;
    name: string;
}
