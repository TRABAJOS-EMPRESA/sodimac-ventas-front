export interface CreateOpportunityRequest {
  
  opportunityName: string;
  workDirection: string;
  regionId: string;
  communeId: string;
  storeId: string;
  projectTypeId: string;
  executiveId: string;
  clientId: string;
  contactIds: string[];
  availableBudget: number;
  startDate: Date; 
  endDate: Date;   
  description: string;
  statusId: string;
  salesTeam: string;
  salesMethod: string;
  }
  