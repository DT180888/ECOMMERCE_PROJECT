export interface UserAdminRes {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  isLocked: boolean;
  createdAt: string; // ISO Date string
  roles: string[];
}

export interface UserListParams {
  page: number;
  size: number;
  search?: string;
}

export interface AssignRoleReq {
  role: string;
}

// Generic response cho list
export interface PageListResponse<T> {
    items: T[];
    total: number;
}