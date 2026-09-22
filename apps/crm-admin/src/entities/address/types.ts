// src/entities/address/types.ts

export type AddressId = number;

export type Address = {
  addressId: number;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string | null;
};

export type AddressListRes = {
  items: Address[];
  page: number;
  size: number;
  total: number;
};

export type AddressListParams = {
  page?: number;
  size?: number;
};

export type AddressUpsertReq = {
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
};
