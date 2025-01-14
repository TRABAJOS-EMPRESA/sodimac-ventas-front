export interface GetRegionsResp {
    id:           string;
    name:         string;
    romanNumber:  string;
    number:       string;
    abbreviation: string;
    communes:     Commune[];
}

export interface Commune {
    id:         string;
    name:       string;
    identifier: string;
}
