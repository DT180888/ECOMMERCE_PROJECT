export function formatVND(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return "0 ₫";
  
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format ngày giờ (DateTime)
 * Ví dụ: "2023-11-25T10:30:00Z" -> "25/11/2023 10:30"
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format ngày (Date only)
 * Ví dụ: "25/11/2023"
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Format số lượng (có dấu chấm phân cách hàng nghìn)
 * Ví dụ: 12345 -> "12.345"
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}