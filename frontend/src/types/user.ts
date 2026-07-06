export interface UpdateProfileDTO {
  fullName?: string;
  phone?: string;
  email?: string;
}

export interface ChangePasswordDTO {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
