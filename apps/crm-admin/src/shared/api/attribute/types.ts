export type AttributeId = number;
export type AttributeDataTypeBE = number;

export interface Option {
  optionId?: number;
  value: string | number;
  displayOrder?: number;
  label?: string;
}

export interface Attribute {
  attributeId: AttributeId;
  name: string;
  slug: string;
  dataType: AttributeDataTypeBE;
  isFilterable: boolean;
  isRequired?: boolean;
  isVariant?: boolean;
  unit?: string | null;
  createdAt?: string;
  options: Option[];
}

export interface AttributeListQuery {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface AttributeListRes {
  items: Attribute[];
  page: number;
  size: number;
  total: number;
}

export interface CreateAttributeReq {
  name: string;
  slug: string;
  dataType: AttributeDataTypeBE;
  isFilterable: boolean;
  isRequired?: boolean;
  isVariant?: boolean;
  unit?: string | null;
  options?: Option[];
}

export interface UpdateAttributeReq {
  name: string;
  slug: string;
  dataType: AttributeDataTypeBE;
  isFilterable: boolean;
  isRequired?: boolean;
  isVariant?: boolean;
  unit?: string | null;
  options?: Option[];
}
