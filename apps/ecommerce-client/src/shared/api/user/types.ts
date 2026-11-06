export interface UserProfile {
  userId: string;
  email: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  dateOfBirth?: string | null;
}

export interface UserAdminRes {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  isLocked: boolean;
  createdAt: string;
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

export interface PageListResponse<T> {
  items: T[];
  total: number;
}
