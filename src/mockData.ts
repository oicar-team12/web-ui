import { Group, GroupUser, GroupUserRole } from './types/group';
import { User } from './types/user';

const now = new Date().toISOString();

const users: User[] = [
  { id: '1', email: 'emily@example.com', firstName: 'Emily', lastName: 'Davis', role: 'EMPLOYEE', createdAt: now, updatedAt: now },
  { id: '2', email: 'robert@example.com', firstName: 'Robert', lastName: 'Wilson', role: 'MANAGER', createdAt: now, updatedAt: now },
  { id: '3', email: 'lisa@example.com', firstName: 'Lisa', lastName: 'Taylor', role: 'EMPLOYEE', createdAt: now, updatedAt: now },
  { id: '4', email: 'michael@example.com', firstName: 'Michael', lastName: 'Anderson', role: 'EMPLOYEE', createdAt: now, updatedAt: now },
  { id: '5', email: 'jessica@example.com', firstName: 'Jessica', lastName: 'Thomas', role: 'EMPLOYEE', createdAt: now, updatedAt: now },
  { id: '6', email: 'anna@example.com', firstName: 'Anna', lastName: 'Lee', role: 'EMPLOYEE', createdAt: now, updatedAt: now },
  { id: '7', email: 'tom@example.com', firstName: 'Tom', lastName: 'Brown', role: 'EMPLOYEE', createdAt: now, updatedAt: now },
];

function makeGroupUser(userId: string, role: GroupUserRole): GroupUser {
  const user = users.find(u => u.id === userId)!;
  return {
    id: userId,
    user,
    role,
    createdAt: now,
    updatedAt: now,
  };
}

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Front Desk',
    description: 'Front Desk group',
    managerId: '2',
    manager: users[1],
    members: [users[0], users[1]],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    name: 'Kitchen Staff',
    description: 'Kitchen Staff group',
    managerId: '4',
    manager: users[3],
    members: [users[3], users[4], users[5]],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    name: 'Housekeeping',
    description: 'Housekeeping group',
    managerId: '7',
    manager: users[6],
    members: [users[2], users[6]],
    createdAt: now,
    updatedAt: now,
  },
];

export const mockGroupUsers: { [groupId: string]: GroupUser[] } = {
  '1': [makeGroupUser('1', GroupUserRole.MEMBER), makeGroupUser('2', GroupUserRole.MANAGER)],
  '2': [makeGroupUser('4', GroupUserRole.MANAGER), makeGroupUser('5', GroupUserRole.MEMBER), makeGroupUser('6', GroupUserRole.MEMBER)],
  '3': [makeGroupUser('3', GroupUserRole.MEMBER), makeGroupUser('7', GroupUserRole.MANAGER)],
};

export const mockAvailableEmployees: { [groupId: string]: User[] } = {
  '1': [users[2], users[3], users[4]],
  '2': [users[0], users[1]],
  '3': [users[3], users[4]],
};

export const mockAvailabilities = [ ]; 