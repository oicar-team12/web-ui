import { Group, GroupUser, GroupUserRole } from './types/group';
import { User } from './types/user';

const now = new Date().toISOString();

const users: User[] = [
  { id: 1, email: 'emily@example.com', firstName: 'Emily', lastName: 'Davis', createdAt: now, updatedAt: now },
  { id: 2, email: 'robert@example.com', firstName: 'Robert', lastName: 'Wilson', createdAt: now, updatedAt: now },
  { id: 3, email: 'lisa@example.com', firstName: 'Lisa', lastName: 'Taylor', createdAt: now, updatedAt: now },
  { id: 4, email: 'michael@example.com', firstName: 'Michael', lastName: 'Anderson', createdAt: now, updatedAt: now },
  { id: 5, email: 'jessica@example.com', firstName: 'Jessica', lastName: 'Thomas', createdAt: now, updatedAt: now },
  { id: 6, email: 'anna@example.com', firstName: 'Anna', lastName: 'Lee', createdAt: now, updatedAt: now },
  { id: 7, email: 'tom@example.com', firstName: 'Tom', lastName: 'Brown', createdAt: now, updatedAt: now },
];

function makeGroupUser(userId: number, role: GroupUserRole): GroupUser {
  const user = users.find(u => u.id === userId)!;
  return {
    id: userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role,
    createdAt: now,
    updatedAt: now,
  };
}

export const mockGroups: Group[] = [
  {
    id: 1,
    name: 'Front Desk',
    description: 'Front Desk group',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: 'Kitchen Staff',
    description: 'Kitchen Staff group',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: 'Housekeeping',
    description: 'Housekeeping group',
    createdAt: now,
    updatedAt: now,
  },
];

export const mockGroupUsers: GroupUser[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: GroupUserRole.MANAGER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: GroupUserRole.EMPLOYEE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockAvailableEmployees: { [groupId: number]: User[] } = {
  1: [users[2], users[3], users[4]],
  2: [users[0], users[1]],
  3: [users[3], users[4]],
};

export const mockAvailabilities = []; 
