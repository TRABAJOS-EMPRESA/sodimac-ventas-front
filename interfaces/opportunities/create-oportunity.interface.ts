export interface CreateOpportunityRequest {
    availableBudget: number;
    clientId: string;
    communeId: string;
    contactIds: string[];
    description: string;
    endDate: number; 
    executiveId: string;
    opportunityName: string;
    productLineId: string;
    projectTypeId: string;
    regionId: string;
    salesMethod: string;
    salesTeam: string;
    startDate: number;
    statusId: string;
    storeId: string;
    workDirection: string;
  }
  