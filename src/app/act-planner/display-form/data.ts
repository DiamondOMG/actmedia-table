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
  sequence?: string; // เพิ่ม field sequence
  status: string;
  requestType: string;
  requester: string;
  notes?: string;
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
    sequence: "https://sequence.actmedia.com/aeon-corband-march2025",
    status: "New",
    requestType: "New",
    requester: "anyanamee(Sai)",
    notes: "Need to process this request urgently",
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
    sequence: "https://sequence.actmedia.com/booking-march2025",
    status: "Closed",
    requestType: "New",
    requester: "anyanamee(Sai)",
    notes: "Customer requested specific time slot",
  },
  {
    id: "2994",
    name: "Finnix",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "ActMedia clients",
    duration: "0:15",
    startDate: "4/6/2025",
    endDate: "1/7/2025",
    bookingCode: "B2510ROS04060107",
    existingCampaign: "Summer Campaign 2025",
    existingSlot: "Slot A-123",
    media: "https://omnithailand.sharepoint.com/:f:/s/OMG_Digital/EhCkO_utN2CoXl7zdfgBTUp5_BCRs8xF7n0c2oAe-dGYe4q",
    sequence: "https://sequence.actmedia.com/finnix-summer2025",
    status: "New",
    requestType: "New",
    requester: "supitcha(Aew)",
    notes: "Please verify media specs before processing",
  },
  {
    id: "2995",
    name: "Getgo",
    retailer: "Big C",
    signType: "TV signage",
    assignedTo: "ActMedia clients",
    duration: "0:30",
    startDate: "15/6/2025",
    endDate: "15/7/2025",
    bookingCode: "B2510GET15060715",
    existingCampaign: "Digital Campaign Q2",
    existingSlot: "Slot B-456",
    media: "https://omnithailand.sharepoint.com/:f:/s/OMG_Digital/GetGo2025Q2",
    sequence: "https://sequence.actmedia.com/getgo-q2-2025", // เพิ่ม sequence
    status: "In Progress",
    requestType: "Update",
    requester: "thanapat(Bank)",
    notes: "Content update required for special promotion",
  },
  {
    id: "2996",
    name: "Smartswift",
    retailer: "Big C",
    signType: "Digital Display",
    assignedTo: "ActMedia clients",
    duration: "0:20",
    startDate: "1/7/2025",
    endDate: "31/7/2025",
    bookingCode: "B2510SWT01070731",
    existingCampaign: "Tech Innovation 2025",
    existingSlot: "Premium Slot P-789",
    media: "https://omnithailand.sharepoint.com/:f:/s/OMG_Digital/SmartSwift2025",
    sequence: "https://sequence.actmedia.com/smartswift-tech-2025", // เพิ่ม sequence
    status: "Pending Review",
    requestType: "New",
    requester: "patcharapa(Pat)",
    notes: "High priority campaign for new product launch",
  },
  {
    id: "2997",
    name: "Turbo",
    retailer: "Big C",
    signType: "LED Display",
    assignedTo: "ActMedia clients",
    duration: "0:45",
    startDate: "10/7/2025",
    endDate: "10/8/2025",
    bookingCode: "B2510TRB10071008",
    existingCampaign: "Power Performance 2025",
    existingSlot: "Premium Slot X-101",
    media: "https://omnithailand.sharepoint.com/:f:/s/OMG_Digital/Turbo2025July",
    sequence: "https://sequence.actmedia.com/turbo-performance-2025", // เพิ่ม sequence
    status: "Approved",
    requestType: "Renewal",
    requester: "siriporn(Som)",
    notes: "Extended campaign duration from previous booking",
  },
  {
    id: "2998",
    name: "Verify identity",
    retailer: "Big C",
    signType: "Interactive Display",
    assignedTo: "ActMedia clients",
    duration: "1:00",
    startDate: "20/7/2025",
    endDate: "20/8/2025",
    bookingCode: "B2510VID20072008",
    existingCampaign: "Security Awareness 2025",
    existingSlot: "Interactive Zone I-202",
    media: "https://omnithailand.sharepoint.com/:f:/s/OMG_Digital/VerifyID2025",
    sequence: "https://sequence.actmedia.com/verify-security-2025", // เพิ่ม sequence
    status: "Under Review",
    requestType: "Special",
    requester: "rattanaporn(Ploy)",
    notes: "Interactive content needs technical verification",
  },
];