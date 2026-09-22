import { Option, AttributeDataTypeBE } from "./types";

export const DATA_TYPE_OPTIONS: Option[] = [
  { value: "Text", label: "Chữ (Text)" },
  { value: "Number", label: "Số (Number)" },
  { value: "Bool", label: "Logic (Boolean)" },
  { value: "Date", label: "Ngày (Date)" },
  { value: "Select", label: "Chọn một (Select)" },
  { value: "Multiselect", label: "Chọn nhiều (Multiselect)" }
];

export function toBEDataType(key: string): AttributeDataTypeBE {
  switch (key) {
    case "Text": return 0;
    case "Number": return 1;
    case "Bool": return 2;
    case "Date": return 3;
    case "Select": return 4;
    case "Multiselect": return 5;
    default: return 0;
  }
}

export function fromBEDataType(beVal: number): "Text" | "Number" | "Bool" | "Date" | "Select" | "Multiselect" {
  switch (beVal) {
    case 0: return "Text";
    case 1: return "Number";
    case 2: return "Bool";
    case 3: return "Date";
    case 4: return "Select";
    case 5: return "Multiselect";
    default: return "Text";
  }
}
