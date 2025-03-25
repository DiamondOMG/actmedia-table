// /src/app/form/data.ts
export interface Booking {
  id: string;
  campaignName: string;
  status: string;
  bookingCode: string;
  customer: string;
  created: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  mediumInventoryType: string;
}

export interface Request {
  id: string;
  name: string;
  retailer: string;
  signType: string;
  assignedTo: string;
  duration: string;
  startDate: string;
  endDate: string;
  bookingCode: string;
  existingCampaign: string;
  existingSlot: string;
  media: string;
  status: string;
  requestType: string;
  requester: string;
}

export const mockBookings: Booking[] = [
  {
    id: "B2361FOR17120704",
    campaignName: "Coke Zero (Soft Drink)",
    status: "Booked",
    bookingCode: "B2361FOR17120704",
    customer: "Abbott",
    created: "27/2/2024 13:26",
    createdBy: "Supanat",
    lastModified: "5/4/2024 16:30",
    lastModifiedBy: "Adison anchunpatee",
    mediumInventoryType:
      "Coke Zero (Soft Drink) - MKCA-003 - LED - 16:9 - Entrance Aisle - Makro Srinakarin - Flexible",
  },
  {
    id: "B2361FOR17120705",
    campaignName: "Coke Zero (Soft Drink)",
    status: "Booked",
    bookingCode: "B2361FOR17120705",
    customer: "Beri Jucker",
    created: "27/2/2024 13:26",
    createdBy: "Supanat",
    lastModified: "5/4/2024 16:30",
    lastModifiedBy: "Adison anchunpatee",
    mediumInventoryType:
      "Coke Zero (Soft Drink) - MKCA-003 - LED - Billboard - Makro Srinakarin",
  },
  {
    id: "B2361FOR17120706",
    campaignName: "Coke Zero (Soft Drink)",
    status: "Booked",
    bookingCode: "B2361FOR17120706",
    customer: "CP Meiji",
    created: "27/2/2024 13:26",
    createdBy: "Supanat",
    lastModified: "5/4/2024 16:30",
    lastModifiedBy: "Adison anchunpatee",
    mediumInventoryType:
      "Coke Zero (Soft Drink) - MKCA-003 - LED - Checkout - Panorama - Makro Srinakarin",
  },
];

// Mock data for Customer Autocomplete
export const mockCustomers: string[] = [
  "Abbott",
  "Beri Jucker",
  "CP Meiji",
  "Ajinomoto",
  "Ensure",
];

// Mock data for Requests
export const mockRequests: Request[] = [
  {
    id: "2992",
    name: "Aeon Corband",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "Big C",
    duration: "0:15",
    startDate: "1/3/2025",
    endDate: "31/3/2025",
    bookingCode: "-",
    existingCampaign: "-",
    existingSlot: "-",
    media:
      "https://omnithailand.sharepoint.com/:f:/s/OMG_Digital/Eh3rHrkxN2Co1l7zdfgBTUp5_BCRs8xF7n0c2oAe-dGYe4q",
    status: "New",
    requestType: "New",
    requester: "anyanamee(Sai)",
  },
  {
    id: "2993",
    name: "Booking",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "Big C",
    duration: "0:15",
    startDate: "1/3/2025",
    endDate: "31/3/2025",
    bookingCode: "-",
    existingCampaign: "-",
    existingSlot: "-",
    media: "",
    status: "Closed",
    requestType: "New",
    requester: "anyanamee(Sai)",
  },
  {
    id: "2994",
    name: "Finnix",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "Big C",
    duration: "0:15",
    startDate: "1/3/2025",
    endDate: "31/3/2025",
    bookingCode: "-",
    existingCampaign: "-",
    existingSlot: "-",
    media: "",
    status: "Closed",
    requestType: "New",
    requester: "anyanamee(Sai)",
  },
  {
    id: "2995",
    name: "Getgo",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "Big C",
    duration: "0:15",
    startDate: "1/3/2025",
    endDate: "31/3/2025",
    bookingCode: "-",
    existingCampaign: "-",
    existingSlot: "-",
    media: "",
    status: "Closed",
    requestType: "New",
    requester: "anyanamee(Sai)",
  },
  {
    id: "2996",
    name: "Smartswift",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "Big C",
    duration: "0:15",
    startDate: "1/3/2025",
    endDate: "31/3/2025",
    bookingCode: "-",
    existingCampaign: "-",
    existingSlot: "-",
    media: "",
    status: "Closed",
    requestType: "New",
    requester: "anyanamee(Sai)",
  },
  {
    id: "2997",
    name: "Turbo",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "Big C",
    duration: "0:15",
    startDate: "1/3/2025",
    endDate: "31/3/2025",
    bookingCode: "-",
    existingCampaign: "-",
    existingSlot: "-",
    media: "",
    status: "Closed",
    requestType: "New",
    requester: "anyanamee(Sai)",
  },
  {
    id: "2998",
    name: "Verify identity",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "Big C",
    duration: "0:15",
    startDate: "1/3/2025",
    endDate: "31/3/2025",
    bookingCode: "-",
    existingCampaign: "-",
    existingSlot: "-",
    media: "",
    status: "Closed",
    requestType: "New",
    requester: "anyanamee(Sai)",
  },
];