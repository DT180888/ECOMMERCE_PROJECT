// FE hiển thị key chữ cho dễ dùng
export type AttributeDataTypeKey =
  | "Text"
  | "Number"
  | "Bool"
  | "Date"
  | "Select"
  | "Multiselect";

// BE yêu cầu enum số
export type AttributeDataTypeBE = 0 | 1 | 2 | 3 | 4 | 5;

export type AttributeId = number;

export type Attribute = {
  attributeId: AttributeId;
  name: string;
  slug: string;
  dataType: AttributeDataTypeBE; // ⬅️ nhận từ BE là số
  unit?: string | null;
  isFilterable: boolean;
  isVariant: boolean;
  createdAt: string; // ISO
};

export type AttributeListRes = {
  page: number;
  size: number;
  total: number;
  items: Array<Attribute>;
};

// Requests — gửi cho BE dạng số
export type CreateAttributeReq = {
  name: string;
  slug: string;
  dataType: AttributeDataTypeBE; // ⬅️ số
  unit?: string | null;
  isFilterable: boolean;
  isVariant: boolean;
};

export type UpdateAttributeReq = CreateAttributeReq;

export type AttributeListQuery = {
  keyword?: string;
  page?: number;
  size?: number;
};

export type Option = { value: string | number; label: string };
