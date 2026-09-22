export interface UserProfile {
  userId: string;
  email: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string; // ISO String (YYYY-MM-DDTHH:mm:ss)
}

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  dateOfBirth?: string | null;
}