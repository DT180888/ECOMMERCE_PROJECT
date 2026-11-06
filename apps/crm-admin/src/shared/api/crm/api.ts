import { axiosClient } from "@my-project/shared-utils";
import type {
  Customer360Res,
  CustomerNoteDto,
  CreateCustomerNoteReq,
  CustomerTagManagementDto,
  CreateCustomerTagReq,
  AssignCustomerTagsReq,
  ListAbandonedCartsParams,
  ListAbandonedCartsRes,
  SendCartRecoveryReq,
  SendCartRecoveryRes,
  SegmentSummaryDto,
  PagedSegmentUsersRes,
  AutomationTriggerDto,
  CreateTriggerReq,
  UpdateTriggerReq,
} from "./types";

const buildQuery = (params?: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

function unwrap<T>(resData: any, fallback?: T): T {
  if (resData && typeof resData === "object" && "data" in resData && resData.data !== undefined) {
    return resData.data as T;
  }
  return (resData ?? fallback) as T;
}

// ==========================================
// 1. CUSTOMER 360° API
// ==========================================

export async function getCustomer360(userId: string): Promise<Customer360Res> {
  const { data } = await axiosClient.get(`/api/v1/admin/customers/${userId}/360`);
  return unwrap<Customer360Res>(data);
}

// ==========================================
// 2. CUSTOMER NOTES API
// ==========================================

export async function listCustomerNotes(userId: string): Promise<CustomerNoteDto[]> {
  const { data } = await axiosClient.get(`/api/v1/admin/customers/${userId}/notes`);
  return unwrap<CustomerNoteDto[]>(data, []);
}

export async function createCustomerNote(
  userId: string,
  payload: CreateCustomerNoteReq
): Promise<CustomerNoteDto> {
  const { data } = await axiosClient.post(
    `/api/v1/admin/customers/${userId}/notes`,
    payload
  );
  return unwrap<CustomerNoteDto>(data);
}

export async function deleteCustomerNote(userId: string, noteId: number): Promise<void> {
  await axiosClient.delete(`/api/v1/admin/customers/${userId}/notes/${noteId}`);
}

export async function togglePinCustomerNote(
  userId: string,
  noteId: number,
  isPinned: boolean
): Promise<void> {
  await axiosClient.patch(`/api/v1/admin/customers/${userId}/notes/${noteId}/pin`, {
    isPinned,
  });
}

// ==========================================
// 3. CUSTOMER TAGS API
// ==========================================

export async function listCustomerTags(): Promise<CustomerTagManagementDto[]> {
  const { data } = await axiosClient.get("/api/v1/admin/customers/tags");
  return unwrap<CustomerTagManagementDto[]>(data, []);
}

export async function createCustomerTag(
  payload: CreateCustomerTagReq
): Promise<CustomerTagManagementDto> {
  const { data } = await axiosClient.post(
    "/api/v1/admin/customers/tags",
    payload
  );
  return unwrap<CustomerTagManagementDto>(data);
}

export async function assignCustomerTags(
  userId: string,
  payload: AssignCustomerTagsReq
): Promise<void> {
  await axiosClient.put(`/api/v1/admin/customers/${userId}/tags`, payload);
}

// ==========================================
// 4. ABANDONED CARTS API
// ==========================================

export async function listAbandonedCarts(
  params?: ListAbandonedCartsParams
): Promise<ListAbandonedCartsRes> {
  const { data } = await axiosClient.get(
    "/api/v1/admin/abandoned-carts",
    { params: buildQuery(params) }
  );
  return unwrap<ListAbandonedCartsRes>(data, { items: [], page: 1, pageSize: 20, total: 0 });
}

export async function sendAbandonedCartRecovery(
  cartId: number,
  payload: SendCartRecoveryReq
): Promise<SendCartRecoveryRes> {
  const { data } = await axiosClient.post(
    `/api/v1/admin/abandoned-carts/${cartId}/send-recovery`,
    payload
  );
  return unwrap<SendCartRecoveryRes>(data);
}

// ==========================================
// 5. RFM SEGMENTATION SDK
// ==========================================

export async function getRfmSegmentsOverview(): Promise<SegmentSummaryDto[]> {
  const { data } = await axiosClient.get("/api/v1/admin/customers/segments");
  return unwrap<SegmentSummaryDto[]>(data, []);
}

export async function getRfmSegmentUsers(
  segmentKey: string,
  params?: { keyword?: string; page?: number; pageSize?: number }
): Promise<PagedSegmentUsersRes> {
  const { data } = await axiosClient.get(
    `/api/v1/admin/customers/segments/${segmentKey}/users`,
    { params: buildQuery(params) }
  );
  return unwrap<PagedSegmentUsersRes>(data, { items: [], page: 1, pageSize: 20, total: 0 });
}

export async function recalculateRfmNow(): Promise<string> {
  const { data } = await axiosClient.post("/api/v1/admin/customers/segments/calculate-now");
  return typeof data === "string" ? data : data?.message || "Đã tính toán phân cụm RFM thành công.";
}

export async function downloadRfmAudienceCsv(segmentKey: string): Promise<void> {
  const response = await axiosClient.get(
    `/api/v1/admin/customers/segments/${segmentKey}/export`,
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `audience-${segmentKey.toLowerCase()}-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// ==========================================
// 6. MARKETING AUTOMATION TRIGGERS SDK
// ==========================================

export async function listAutomationTriggers(): Promise<AutomationTriggerDto[]> {
  const { data } = await axiosClient.get("/api/v1/admin/automation/triggers");
  return unwrap<AutomationTriggerDto[]>(data, []);
}

export async function createAutomationTrigger(
  payload: CreateTriggerReq
): Promise<AutomationTriggerDto> {
  const { data } = await axiosClient.post(
    "/api/v1/admin/automation/triggers",
    payload
  );
  return unwrap<AutomationTriggerDto>(data);
}

export async function updateAutomationTrigger(
  id: number,
  payload: UpdateTriggerReq
): Promise<void> {
  await axiosClient.put(`/api/v1/admin/automation/triggers/${id}`, payload);
}

export async function toggleAutomationTrigger(
  id: number,
  isEnabled: boolean
): Promise<void> {
  await axiosClient.patch(`/api/v1/admin/automation/triggers/${id}/toggle`, {
    isEnabled,
  });
}

export async function runAutomationTriggersNow(): Promise<string> {
  const { data } = await axiosClient.post("/api/v1/admin/automation/triggers/run-now");
  return typeof data === "string" ? data : data?.message || "Đã quét và gửi thông điệp tiếp thị tự động thành công.";
}
