import { GroupUser, GroupUserRole } from '../types/group';
import axiosInstance from './axiosConfig';

class GroupMemberService {
  async getGroupMembers(groupId: string): Promise<GroupUser[]> {
    const response = await axiosInstance.get<GroupUser[]>(`/group/${groupId}/users`);
    return response.data;
  }

  async addMember(groupId: string, userId: number): Promise<void> {
    await axiosInstance.post(`/group/${groupId}/user/${userId}`);
  }

  async updateMemberRole(groupId: string, userId: number, role: GroupUserRole): Promise<void> {
    await axiosInstance.put(`/group/${groupId}/user/${userId}/role/${role}`);
  }

  async removeMember(groupId: string, userId: number): Promise<void> {
    await axiosInstance.delete(`/group/${groupId}/user/${userId}`);
  }
}

export default new GroupMemberService(); 