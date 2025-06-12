import  { Schedule } from '../types/schedule';
import axiosInstance from './axiosConfig';

class ScheduleService {
  async getGroupSchedules(groupId: string): Promise<Schedule[]> {
    const response = await axiosInstance.get<Schedule[]>(`/group/${groupId}/schedules`);
    return response.data;
  }
}

export default new ScheduleService(); 