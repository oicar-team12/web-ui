import { GroupUser, GroupUserRole } from '../types/group';
import axiosInstance from './axiosConfig';

class GroupMemberService {
  async getGroupMembers(groupId: string): Promise<GroupUser[]> {
    const response = await axiosInstance.get<GroupUser[]>(`/group/${groupId}/members`);
    return response.data;
  }

  async addMember(groupId: string, userId: string): Promise<void> {
    await axiosInstance.post(`/group/${groupId}/members`, { userId });
  }

  async updateMemberRole(groupId: string, userId: string, role: GroupUserRole): Promise<void> {
    await axiosInstance.put(`/group/${groupId}/members/${userId}`, { role });
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    await axiosInstance.delete(`/group/${groupId}/members/${userId}`);
  }
}

export default new GroupMemberService(); 