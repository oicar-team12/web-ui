import axiosInstance from "./axiosConfig";

class UserService {
  async deleteAccount(): Promise<void> {
    await axiosInstance.delete('/user/delete-account');
  }
}

export default new UserService();
