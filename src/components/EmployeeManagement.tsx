import React, { useState, useEffect } from 'react';
import { employeeAPI, Employee } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    position: '',
    department: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      const response = await employeeAPI.createEmployee(newEmployee);
      setEmployees([...employees, response.data]);
      setShowCreateModal(false);
      setNewEmployee({
        name: '',
        email: '',
        position: '',
        department: '',
        phoneNumber: '',
      });
      toast.success('Employee created successfully');
    } catch (error) {
      toast.error('Failed to create employee');
      console.error('Error creating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.deleteEmployee(id);
        setEmployees(employees.filter(emp => emp.id !== id));
        toast.success('Employee deleted successfully');
      } catch (error) {
        toast.error('Failed to delete employee');
        console.error('Error deleting employee:', error);
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Employee Management</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Manage your employees</p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          onClick={() => setShowCreateModal(true)}
        >
          Add New Employee
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
        />
      </div>

      <div className="grid gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-light-primary dark:bg-dark-primary p-6 rounded-lg shadow-sm border border-light-border dark:border-dark-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  {employee.name}
                </h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {employee.position}
                </p>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {employee.email}
                </p>
                {employee.department && (
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Department: {employee.department}
                  </p>
                )}
                {employee.phoneNumber && (
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Phone: {employee.phoneNumber}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDeleteEmployee(employee.id)}
                className="text-red-500 hover:text-red-400 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-light-primary dark:bg-dark-primary p-6 rounded-lg w-96 shadow-xl animate-slide-up">
            <h2 className="text-light-text dark:text-dark-text text-xl font-bold mb-4">
              Add New Employee
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="w-full p-2 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="w-full p-2 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
              <input
                type="text"
                placeholder="Position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                className="w-full p-2 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
              <input
                type="text"
                placeholder="Department"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                className="w-full p-2 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newEmployee.phoneNumber}
                onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                className="w-full p-2 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text rounded hover:bg-opacity-80 transition-colors duration-200"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                onClick={handleCreateEmployee}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement; 