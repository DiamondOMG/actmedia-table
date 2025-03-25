export interface RequestForm {
    requestType: "New" | "Change";
    requesterName: string;
    requesterEmail: string;
    retailerTypes: string[];
    bookings: string[];
    existingCampaign: string;
    startDate: number | null;
    endDate: number | null;
    duration: string;
    mediaLinks: string;
    notes: string;
    linkedCampaigns: string;
    campaigns: string[];
  }
  
  export interface RequestFormResponse {
    status: string;
    data: RequestForm | null;
    message: string;
  }