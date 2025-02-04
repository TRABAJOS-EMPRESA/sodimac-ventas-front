// export interface Task {
//   id: string;
//   idOpportunity: string;
//   opportunityName: string;
//   opportunityDate: string;
//   mountOpportunitie: string;
//   clientName: string;
//   statusOpportunity: string;
//   projectType: string;
// }


export interface Task {
  id: string;
  taskName: string;
  planned: boolean;
  color: string;
  createdAt: string; // Se puede cambiar a Date si se maneja como objeto de fecha
  startDate: string;
  endDate: string;
  updatedAt: string;
  plannedAt: string | null;
  deletedAt: string | null;
  version: string;
  childOpportunity: ChildOpportunity;
  status: Status;
  tag: Tag;
  type: TaskType;
  notes: string[]; // Array de strings
}

interface ChildOpportunity {
  id: string;
  parentOpportunity: ParentOpportunity;
}

interface ParentOpportunity {
  id: string;
  client: Client;
  assignments: Assignment[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  rut: string;
}

interface Assignment {
  id: string;
  executive: Executive;
}

interface Executive {
  id: string;
}

interface Status {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

export interface TaskType {
  id: string;
  name: string;
}
