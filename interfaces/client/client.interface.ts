export interface GetClientResp {
  id: string;
  name: string;
  rut: string;
  contacts: Contact[];
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}
