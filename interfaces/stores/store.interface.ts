export interface GetStoresResp {
    id:      string;
    name:    string;
    region:  Region;
    commune: Commune;
    code: number;
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




