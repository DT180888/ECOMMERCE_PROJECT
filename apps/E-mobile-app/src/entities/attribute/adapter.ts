import type { AttributeDataTypeBE, AttributeDataTypeKey } from "./types";

export const DATA_TYPE_MAP: Record<AttributeDataTypeKey, AttributeDataTypeBE> = {
  Text: 0,
  Number: 1,
  Bool: 2,
  Date: 3,
  Select: 4,
  Multiselect: 5,
};

export const DATA_TYPE_REVERSE_MAP: Record<AttributeDataTypeBE, AttributeDataTypeKey> = {
  0: "Text",
  1: "Number",
  2: "Bool",
  3: "Date",
  4: "Select",
  5: "Multiselect",
};

export function toBEDataType(key: AttributeDataTypeKey): AttributeDataTypeBE {
  return DATA_TYPE_MAP[key];
}

export function fromBEDataType(be: AttributeDataTypeBE): AttributeDataTypeKey {
  return DATA_TYPE_REVERSE_MAP[be];
}

// UI options: hiển thị nhãn, value là key FE (để form dễ dùng), khi submit map sang số
export const DATA_TYPE_OPTIONS: Array<{ value: AttributeDataTypeKey; label: string }> = [
  { value: "Text",        label: "Text" },
  { value: "Number",      label: "Number" },
  { value: "Bool",        label: "Boolean" },
  { value: "Date",        label: "Date" },
  { value: "Select",      label: "Select (1 lựa chọn)" },
  { value: "Multiselect", label: "Multiselect (nhiều lựa chọn)" },
];