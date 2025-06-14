import { Group, CreateGroupDto, GroupUser, GroupUserRole } from '../types/group';
import { shouldUseMock, simulateApiDelay } from '../config';
import axiosInstance from './axiosConfig';
import { User } from '../types/user';

class GroupService {
  async getGroups(): Promise<Group[]> {
    const response = await axiosInstance.get<Group[]>('/user/groups');
    return response.data;
  }

  async createGroup(data: CreateGroupDto): Promise<Group> {
    const response = await axiosInstance.post<Group>('/group', data);
    return response.data;
  }

  async updateGroupName(groupId: number, name: string): Promise<Group> {
    const response = await axiosInstance.put<Group>(`/group/${groupId}`, { name });
    return response.data;
  }

  async deleteGroup(groupId: number): Promise<void> {
    await axiosInstance.delete(`/group/${groupId}`);
  }

  async addGroupUserByEmail(groupId: number, email: string): Promise<void> {
    await axiosInstance.post(`/group/${groupId}/user`, { email });
  }

  async getGroupMembers(groupId: number): Promise<GroupUser[]> {
    const response = await axiosInstance.get<GroupUser[]>(`/group/${groupId}/users`);
    return response.data;
  }

  // Removed old methods as per new backend spec.
  // async getGroupUsers(groupId: number): Promise<GroupUser[]> { ... }
  // async addGroupUser(groupId: number, userId: number): Promise<void> { ... }
  // async updateGroupUserRole(groupId: number, userId: number, role: GroupUserRole): Promise<void> { ... }
  // async removeGroupUser(groupId: number, userId: number): Promise<void> { ... }
  // async getGroup(groupId: number): Promise<Group> { ... }
  // async getGroupMembers(groupId: number): Promise<GroupUser[]> { ... }
  // async addGroupMember(groupId: number, userId: number, role: GroupUserRole): Promise<GroupUser> { ... }
  // async updateGroupMemberRole(groupId: number, userId: number, role: GroupUserRole): Promise<GroupUser> { ... }
  // async removeGroupMember(groupId: number, userId: number): Promise<void> { ... }
  // async getAvailableEmployees(groupId: number): Promise<User[]> { ... }
}

export default new GroupService(); 