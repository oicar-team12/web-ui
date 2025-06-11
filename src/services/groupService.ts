import axiosInstance from './axiosConfig';
import { Group, GroupUser, GroupUserRole } from '../types/group';

export const groupService = {
  // Get all groups for the current user
  getGroups: async (): Promise<Group[]> => {
    const response = await axiosInstance.get<Group[]>('/group');
    return response.data;
  },

  // Create a new group
  createGroup: async (name: string): Promise<Group> => {
    const response = await axiosInstance.post<Group>('/group', { name });
    return response.data;
  },

  // Get group details
  getGroup: async (groupId: number): Promise<Group> => {
    const response = await axiosInstance.get<Group>(`/group/${groupId}`);
    return response.data;
  },

  // Update group details
  updateGroup: async (groupId: number, name: string): Promise<Group> => {
    const response = await axiosInstance.put<Group>(`/group/${groupId}`, { name });
    return response.data;
  },

  // Delete a group
  deleteGroup: async (groupId: number): Promise<void> => {
    await axiosInstance.delete(`/group/${groupId}`);
  },

  // Get group members
  getGroupUsers: async (groupId: number): Promise<GroupUser[]> => {
    const response = await axiosInstance.get<GroupUser[]>(`/group/${groupId}/user`);
    return response.data;
  },

  // Add user to group
  addUserToGroup: async (groupId: number, email: string, role: GroupUserRole): Promise<GroupUser> => {
    const response = await axiosInstance.post<GroupUser>(`/group/${groupId}/user`, { email, role });
    return response.data;
  },

  // Update user role in group
  updateUserRole: async (groupId: number, userId: number, role: GroupUserRole): Promise<GroupUser> => {
    const response = await axiosInstance.put<GroupUser>(`/group/${groupId}/user/${userId}`, { role });
    return response.data;
  },

  // Remove user from group
  removeUserFromGroup: async (groupId: number, userId: number): Promise<void> => {
    await axiosInstance.delete(`/group/${groupId}/user/${userId}`);
  }
}; 