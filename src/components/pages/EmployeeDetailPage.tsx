import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  shiftStart: string;
  shiftEnd: string;
  daysOff: string[];
  notes?: string;
  group?: { name: string };
}

const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:5000/employees/${id}`);
        if (!res.ok) throw new Error('Employee not found');
        const data: Employee = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error(err);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!employee) return <div className="text-white p-6">Employee not found.</div>;

  return (
    <div className="p-6 text-white max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>
      <div className="bg-[#1e2433] p-6 rounded-lg space-y-3 shadow-lg">
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Position:</strong> {employee.position}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Group:</strong> {employee.group?.name || 'N/A'}</p>
        <p><strong>Shift:</strong> 
          {` ${new Date(employee.shiftStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} 
          {' - '}
          {`${new Date(employee.shiftEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        </p>
        <p><strong>Days Off:</strong> {employee.daysOff.join(', ')}</p>
        {employee.notes && <p><strong>Notes:</strong> {employee.notes}</p>}
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
