export enum GroupUserRole {
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type GroupUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: GroupUserRole;
  createdAt: string;
  updatedAt: string;
};

export interface CreateGroupDto {
  name: string;
  description?: string;
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
}
