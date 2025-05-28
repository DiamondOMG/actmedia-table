import React, { useState, useEffect } from "react";
import { useGetTable } from "@/hook/useRequestForm";
import RequestsSection from "./RequestsSection";
import RequestDetails from "./RequestDetails";

// สร้าง type ที่เหมาะสมกับ RequestsSection และ RequestDetails
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
  sequence?: string;
  status: string;
  requestType: string;
  requester: string;
  notes?: string;
}

export default function RequestsDataProvider() {
  const { data, isLoading, error } = useGetTable();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // แปลงข้อมูล response ให้ตรงกับ Request interface เดิม
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const mapped = data.map((item: any) => ({
        id: item.id,
        name: item.requestType, // หรือจะใช้ field อื่นตามต้องการ
        retailer: item.retailerTypes?.join(", ") ?? "",
        signType: item.requestType ?? "",
        assignedTo: item.requesterName ?? "",
        duration: item.duration ?? "",
        startDate: item.startDate ? new Date(item.startDate).toLocaleDateString() : "",
        endDate: item.endDate ? new Date(item.endDate).toLocaleDateString() : "",
        bookingCode: item.bookings?.join(", ") ?? "",
        existingCampaign: item.existingCampaign ?? "",
        existingSlot: item.linkedCampaigns ?? "",
        media: item.mediaLinks ?? "",
        sequence: "", // ถ้ามี field sequence ใน backend ให้ map มาด้วย
        status: "New", // หรือ map จาก field อื่น
        requestType: item.requestType ?? "",
        requester: item.requesterName ?? "",
        notes: item.notes ?? "",
      }));
      setRequests(mapped);
      if (mapped.length > 0) setSelectedRequest(mapped[0]);
    }
  }, [data]);

  const handleSelect = (request: Request) => {
    setSelectedRequest(request);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading requests</div>;

  return (
    <div className="flex gap-6">
      <div className="w-1/3">
        <RequestsSection requests={requests} onSelect={handleSelect} />
      </div>
      <div className="w-2/3">
        <RequestDetails selectedRequest={selectedRequest} />
      </div>
    </div>
  );
}