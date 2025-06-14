import { User, CreateUserDto, UpdateUserDto } from '../types/user';
import axiosInstance from './axiosConfig';
import { shouldUseMock, simulateApiDelay } from '../config';

export const userService = {
  async createEmployee(employeeData: CreateUserDto): Promise<User> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return {
        id: Math.floor(Math.random() * 1000000),
        email: employeeData.email,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    try {
      const response = await axiosInstance.post<User>('/user/employee', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async updateEmployee(id: number, employeeData: UpdateUserDto): Promise<User> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const mockUser = await this.getEmployee(id);
      return {
        ...mockUser,
        ...employeeData,
        updatedAt: new Date().toISOString()
      };
    }
    try {
      const response = await axiosInstance.put<User>(`/user/employee/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async getEmployee(id: number): Promise<User> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return {
        id,
        email: 'mock@example.com',
        firstName: 'Mock',
        lastName: 'User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    try {
      const response = await axiosInstance.get<User>(`/user/employee/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting employee:', error);
      throw error;
    }
  },

  async getAllEmployees(): Promise<User[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return [
        {
          id: 1,
          email: 'employee1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          email: 'employee2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    try {
      const response = await axiosInstance.get<User[]>('/user/employees');
      return response.data;
    } catch (error) {
      console.error('Error getting all employees:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      // This mock user should match the one set in AuthContext for consistency
      return {
        id: 1,
        email: 'n.separovic2@gmail.com',
        firstName: 'Nikola',
        lastName: 'Šeparović',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    try {
      // This endpoint doesn't exist on the backend based on Swagger, so this will likely fail
      // We are adding it as a placeholder to satisfy frontend requirements temporarily.
      // A proper solution requires a backend endpoint to return current user details.
      const response = await axiosInstance.get<User>('/user/current');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
};
