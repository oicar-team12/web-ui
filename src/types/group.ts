export enum GroupUserRole {
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER'
}

export interface Group {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupUser {
  id: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  role: GroupUserRole;
  createdAt: string;
  updatedAt: string;
} 