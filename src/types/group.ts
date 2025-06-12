import { User } from './user';

export enum GroupUserRole {
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER'
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  manager?: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupUser {
  id: string;
  user: User;
  role: GroupUserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  managerId?: string;
  members?: User[];
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
} 