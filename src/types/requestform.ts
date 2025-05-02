export interface RequestForm {
  id: string;
  requestType: string;
  requesterName: string;
  requesterEmail: string;
  retailerTypes: string[];
  bookings: string[];
  existingCampaign: string;
  startDate: number;
  endDate: number;
  duration: string;
  mediaLinks: string;
  notes: string;
  linkedCampaigns: string;
  campaigns: string[];
  createDate: number;
  isDelete: number;
}

export interface RequestFormResponse {
  status: string;
  data: RequestForm[] | RequestForm | null;
  message: string;
}
