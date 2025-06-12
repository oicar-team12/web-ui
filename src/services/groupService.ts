import { Group, CreateGroupDto, GroupUser, GroupUserRole } from '../types/group';
import { mockGroups, mockGroupUsers, mockAvailableEmployees } from '../mockData';
import { shouldUseMock, simulateApiDelay } from '../config';
import axiosInstance from './axiosConfig';
import { User } from '../types/user';

// Use module-level mutable variables for mock data
let currentMockGroups: Group[] = [...mockGroups];
let currentMockGroupUsers: { [groupId: string]: GroupUser[] } = { ...mockGroupUsers };
let currentMockAvailableEmployees: { [groupId: string]: User[] } = { ...mockAvailableEmployees };

class GroupService {
  // Remove the private groups state, as it's now managed at the module level
  // private groups: Group[] = [...mockGroups];

  async getGroups(): Promise<Group[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return currentMockGroups;
    }
    try {
      const response = await axiosInstance.get<Group[]>('/groups');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      return currentMockGroups; // Fallback to current mock data
    }
  }

  async getGroup(groupId: string): Promise<Group> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const group = currentMockGroups.find(g => g.id === groupId);
      if (!group) throw new Error('Group not found');
      return group;
    }
    try {
      const response = await axiosInstance.get<Group>(`/group/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch group:', error);
      const group = currentMockGroups.find(g => g.id === groupId);
      if (!group) throw new Error('Group not found');
      return group;
    }
  }

  async createGroup(group: CreateGroupDto): Promise<Group> {
    if (shouldUseMock()) {
      await simulateApiDelay();

      // Check for duplicate group name in mock mode
      if (currentMockGroups.some(existingGroup => existingGroup.name === group.name)) {
        throw new Error(`Group with name '${group.name}' already exists.`);
      }

      const newGroup: Group = {
        ...group,
        id: Math.random().toString(36).substr(2, 9),
        managerId: 'mockManagerId', // Default managerId for mock mode
        members: [], // Initialize members as an empty array
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Add some default mock members and available employees for the new group
      currentMockGroupUsers[newGroup.id] = [
        { id: 'mockUser1', user: { id: 'mockUser1', email: 'mock1@example.com', firstName: 'Mock', lastName: 'User1', role: 'EMPLOYEE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, role: GroupUserRole.MEMBER, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];
      currentMockAvailableEmployees[newGroup.id] = [
        { id: 'mockUser2', email: 'mock2@example.com', firstName: 'Mock', lastName: 'User2', role: 'EMPLOYEE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];
      // Populate the members array of the new group object directly
      newGroup.members = currentMockGroupUsers[newGroup.id].map(groupUser => groupUser.user);

      currentMockGroups.push(newGroup);
      return newGroup;
    }
    try {
      const response = await axiosInstance.post<Group>('/group', group);
      return response.data;
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  }

  async updateGroup(groupId: string, group: Partial<Group>): Promise<Group> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const index = currentMockGroups.findIndex(g => g.id === groupId);
      if (index === -1) throw new Error('Group not found');
      currentMockGroups[index] = {
        ...currentMockGroups[index],
        ...group,
        updatedAt: new Date().toISOString(),
      };
      return currentMockGroups[index];
    }
    try {
      const response = await axiosInstance.put<Group>(`/group/${groupId}`, group);
      return response.data;
    } catch (error) {
      console.error('Failed to update group:', error);
      throw error;
    }
  }

  async deleteGroup(groupId: string): Promise<void> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const index = currentMockGroups.findIndex(g => g.id === groupId);
      if (index === -1) throw new Error('Group not found');
      currentMockGroups.splice(index, 1);
      // Also delete from mockGroupUsers and mockAvailableEmployees
      delete currentMockGroupUsers[groupId];
      delete currentMockAvailableEmployees[groupId];
      return;
    }
    try {
      await axiosInstance.delete(`/group/${groupId}`);
    } catch (error) {
      console.error('Failed to delete group:', error);
      throw error;
    }
  }

  async getGroupMembers(groupId: string): Promise<any[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return currentMockGroupUsers[groupId] || [];
    }
    try {
      const response = await axiosInstance.get<any[]>(`/group/${groupId}/members`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch group members:', error);
      return currentMockGroupUsers[groupId] || [];
    }
  }

  async getAvailableEmployees(groupId: string): Promise<User[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return currentMockAvailableEmployees[groupId] || [];
    }
    try {
      const response = await axiosInstance.get<User[]>(`/group/${groupId}/available-employees`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch available employees:', error);
      return currentMockAvailableEmployees[groupId] || [];
    }
  }
}

export default new GroupService(); 