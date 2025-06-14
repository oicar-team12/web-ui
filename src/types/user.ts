export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}

export interface CreateEmployeeDto extends Omit<CreateUserDto, 'role'> {
  position?: string;
}

export interface UpdateEmployeeDto extends Omit<UpdateUserDto, 'role'> {
  position?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
} 